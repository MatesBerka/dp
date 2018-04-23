// @flow
import * as React from 'react';
import { Accordion, Button, Icon, Popup, Checkbox } from 'semantic-ui-react'
import 'react-rangeslider/lib/index.css'
import CameraConfiguration from "./left_panel_modules/CameraConfiguration";
import DisplayAndViewerConfiguration from "./left_panel_modules/DisplayAndViewerConfiguration";
import GeneralConfiguration from "./left_panel_modules/GeneralConfiguration";
import ImagePostProcessingConfiguration from "./left_panel_modules/ImagePostProcessingConfiguration";
import SceneConfiguration from "./left_panel_modules/SceneConfiguration";
import dispatcher from "../services/Dispatcher";
import GenericDAO from "../model/GenericDAO";
import registry from "../services/RegistryService";
import sceneObjectDAO from "../model/SceneObjectDAO";

type Props = {
    sidePanelWidth: number,
    leftPanelWidth: number,
    updateCallback: Function
};
type State = {
    clipboard: Map<string, Array<Object>>,
    openSettings: Set<number>,
    useDoubleColumn: boolean,
    isPanelSettingsOpen: boolean
};

/**
 * @classdesc React component left panel is used to display all the available configuration options
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class LeftPanel extends React.Component<Props, State> {
    // component constant
    PANEL_COMPONENTS: Array<Function> = [
        (openSettings: Set<number>, index: number) => (
            <SceneConfiguration key={index} openSettings={openSettings} toggleSettings={this.handleToggleSettings} checkPanelSize={this.checkPanelSize} copySettings={this.handleCopySettings}/>
        ),
        (openSettings: Set<number>, index: number) => (
            <CameraConfiguration key={index} openSettings={openSettings} toggleSettings={this.handleToggleSettings} copySettings={this.handleCopySettings}/>
        ),
        (openSettings: Set<number>, index: number) => (
            <ImagePostProcessingConfiguration key={index} openSettings={openSettings} toggleSettings={this.handleToggleSettings} copySettings={this.handleCopySettings}/>
        ),
        (openSettings: Set<number>, index: number) => (
            <DisplayAndViewerConfiguration key={index} openSettings={openSettings} toggleSettings={this.handleToggleSettings} copySettings={this.handleCopySettings}/>
        ),
        (openSettings: Set<number>, index: number) => (
            <GeneralConfiguration key={index} openSettings={openSettings} toggleSettings={this.handleToggleSettings} copySettings={this.handleCopySettings}/>
        ),
    ];
    // used to copy all settings
    CONFIGURATION_COMPONENTS_NAMES: Array<string> = ['CameraDAO', 'DisplayAndViewerDAO', 'GeneralDAO', 'PostProcessingDAO', 'SceneObjectDAO'];
    // component variable
    panelConfigurationItemsELMs: HTMLCollection<HTMLElement>;
    firstLeftColumnELM: Element | null = null;
    panelFirstColumn: Array<Function> = this.PANEL_COMPONENTS;
    panelSecondColumn: Array<Function> = [];
    checkColumnsSize: boolean = true;
    resizeListener: Function;
    /**
     * Component constructor
     */
    constructor (props: Props) {
        super(props);

        this.state = {
            clipboard: new Map(),
            openSettings: new Set([0]), // we want tab with index 0 to be open by default
            isPanelSettingsOpen: false,
            useDoubleColumn: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        };
    }
    /**
     * After the component is added the DOM register event listeners and initializes variables
     */
    componentDidMount() {
        this.panelConfigurationItemsELMs = document.getElementsByClassName("configuration-item");
        this.firstLeftColumnELM = document.getElementById('first-left-column');
        // register listener
        this.resizeListener = function(payload) {
            this.checkPanelSize();
        }.bind(this);
        dispatcher.register('resize', this.resizeListener);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('resize', this.resizeListener);
    };
    /**
     * If component updates check component size
     */
    componentDidUpdate = () => {
        if (this.checkColumnsSize) {
            this.checkColumnsSize = false;
            this.checkPanelSize();
        }
    };
    /**
     * Function opens or closes selected settings block.
     */
    handleToggleSettings = (e: SyntheticEvent<>, titleProps: Object) => {
        const { index } = titleProps;
        this.checkColumnsSize = true;
        let { openSettings } = this.state;
        if (openSettings.has(index)) {
            openSettings.delete(index);
        } else {
            openSettings.add(index);
        }
        this.setState({ openSettings: openSettings });
    };
    /**
     * Function takes stored entities in clipboard and stores them in active model
     */
    handleConfigurationPaste = () => {
        let pasteObj = {};
        this.state.clipboard.forEach(function(value, key, map) {
            if (key === 'centerPanelSettings') {
                pasteObj = value[0];
            } else {
                if (key === 'SceneObjectDAO') {
                    // $FlowFixMe
                    value[1].replaceRecord(sceneObjectDAO.createCopy(value[0]));
                } else {
                    value[1].replaceRecord(value[0].getCopy());
                }
            }
        });
        dispatcher.dispatch('paste', pasteObj);
        this.forceUpdate();
    };
    /**
     * Function copies all available settings
     */
    handleConfigurationCopyAll = () => {
        registry.getAll().forEach(function(dao) {
            if (this.CONFIGURATION_COMPONENTS_NAMES.indexOf(dao.name) > -1) { // only simulation settings.
                this.state.clipboard.set(dao.name, [dao.getCopy(), dao]);
            }
        }.bind(this));
        this.handleCenterPanelCopy();
        this.forceUpdate();
    };
    handleCenterPanelCopy = () => {
        let centerPanelSettings = {};
        dispatcher.dispatch('getCenterPanelSettings', centerPanelSettings);
        this.state.clipboard.set('centerPanelSettings', [centerPanelSettings]);
        this.forceUpdate();
    };
    /**
     * Function clears clipboard
     */
    handleConfigurationClearAll = () => {
        this.state.clipboard.clear();
        this.forceUpdate();
    };
    /**
     * Function splits available blocks between two left columns depending on available height.
     */
    checkPanelSize = () => {
        // use panel double size only for desktop devices
        if(this.state.useDoubleColumn) {
            this.panelFirstColumn = [];
            this.panelSecondColumn = [];
            // $FlowFixMe
            let firstSize = 0, columnHeight = this.firstLeftColumnELM.clientHeight, i = 0;
            for (; i < this.panelConfigurationItemsELMs.length; i++) {
                firstSize += this.panelConfigurationItemsELMs[i].clientHeight;
                this.panelFirstColumn.push(this.PANEL_COMPONENTS[i]);
                if (firstSize >= columnHeight) {
                    i++;
                    break;
                }
            }
            for (; i < this.panelConfigurationItemsELMs.length; i++)
                this.panelSecondColumn.push(this.PANEL_COMPONENTS[i]);
            if (this.panelSecondColumn.length > 0) {
                this.props.updateCallback(true);
            } else {
                this.props.updateCallback(false);
            }
        }
    };
    /**
     * Stores selected settings block in clipboard.
     */
    handleCopySettings = (e: SyntheticEvent<>, settingsDAO: GenericDAO) => {
        this.state.clipboard.set(settingsDAO.name, [settingsDAO.getCopy(), settingsDAO]);
        e.stopPropagation();
        this.forceUpdate();
    };

    handleTogglePanelSettings = () => {
        this.setState((prev) => {
            return {isPanelSettingsOpen: !prev.isPanelSettingsOpen}
        }, this.checkPanelSize);
    };

    handleToggleDoubleColumn = () => {
        this.setState((prev) => {
            return {useDoubleColumn: !prev.useDoubleColumn}
        });
    };

    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { isPanelSettingsOpen, useDoubleColumn, openSettings, clipboard } = this.state;
        const { sidePanelWidth, leftPanelWidth } = this.props;

        return (
            <div id="left-column" style={{width: leftPanelWidth}}>
                <h2>
                    <Button active={isPanelSettingsOpen} onClick={this.handleTogglePanelSettings} icon><Icon name='settings'/></Button>
                    Configuration
                </h2>
                <div id="clipboard-settings" style={{display: ((isPanelSettingsOpen) ? 'none' : 'block')}}>
                    <div className="option-group-line">
                        Clipboard: {clipboard.size} setting(s)
                    </div>
                    <Button.Group size='mini' style={{float: ((this.panelSecondColumn.length > 0) ? 'right' : 'none')}}>
                        <Button size='mini' color='yellow' onClick={this.handleConfigurationPaste}>Paste</Button>
                        <Button size='mini' color='red' onClick={this.handleConfigurationClearAll}>Clear all</Button>
                        <Button size='mini' color='olive' onClick={this.handleConfigurationCopyAll}>Copy all</Button>
                        <Button size='mini' color='green' onClick={this.handleCenterPanelCopy}>Copy views</Button>
                    </Button.Group>
                </div>
                <div className={((this.panelSecondColumn.length > 0) ? 'side-panel-column double-column' : 'side-panel-column')} id="first-left-column" style={{width: sidePanelWidth}}>
                    <div id="panel-settings" style={{display: ((isPanelSettingsOpen) ? 'block' : 'none')}}>
                        <h3>Panel Settings</h3>
                        <div className="option-group-line">
                            <Popup trigger={<Checkbox label='Use double column' onChange={this.handleToggleDoubleColumn}
                                checked={useDoubleColumn}/>} content="If open settings can't fit into one." inverted />
                        </div>
                    </div>
                    <Accordion fluid style={{display: ((isPanelSettingsOpen) ? 'none' : 'block')}}>
                        {this.panelFirstColumn.map((f, index) => f(openSettings, index))}
                    </Accordion>
                </div>
                <div className={((this.panelSecondColumn.length > 0) ? 'side-panel-column double-column' : 'side-panel-column')} style={{width: sidePanelWidth, display: ((isPanelSettingsOpen) ? 'none' : 'block')}}>
                    <Accordion fluid>
                        {this.panelSecondColumn.map((f, index) => f(openSettings, index))}
                    </Accordion>
                </div>
            </div>
        )
    }
}