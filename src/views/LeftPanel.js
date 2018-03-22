// @flow
import * as React from 'react';
import { Accordion, Button, Label } from 'semantic-ui-react'
import 'react-rangeslider/lib/index.css'
import CameraConfiguration from "./left_panel_modules/CameraConfiguration";
import DisplayAndViewerConfiguration from "./left_panel_modules/DisplayAndViewerConfiguration";
import GeneralConfiguration from "./left_panel_modules/GeneralConfiguration";
import ImagePostProcessingConfiguration from "./left_panel_modules/ImagePostProcessingConfiguration";
import SceneConfiguration from "./left_panel_modules/SceneConfiguration";
import dispatcher from "../services/Dispatcher";
import GenericDAO from "../model/GenericDAO";

type Props = {
    sidePanelWidth: number,
    leftPanelWidth: number,
    updateCallback: Function
};
type State = {
    clipboard: Map<string, [number, GenericDAO]>,
    openSettings: Set<number>,
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
        this.state.clipboard.forEach(function(value, key, map) {
            value[1].copyRecord(value[0]);
        });
        this.state.clipboard.clear();
        dispatcher.dispatch('paste', {});
        this.forceUpdate();
    };
    /**
     * Function splits available blocks between two left columns depending on available height.
     */
    checkPanelSize = () => {
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
    };
    /**
     * Stores selected settings block in clipboard.
     */
    handleCopySettings = (e: SyntheticEvent<>, settingsDAO: GenericDAO) => {
        this.state.clipboard.set(settingsDAO.constructor.name, [settingsDAO.getActiveRecordID(), settingsDAO]);
        e.stopPropagation();
        this.forceUpdate();
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { openSettings, clipboard } = this.state;
        const { sidePanelWidth, leftPanelWidth } = this.props;

        return (
            <div id="left-column" style={{width: leftPanelWidth}}>
                <h2>Configuration
                    <Button positive as='div' labelPosition='right' size='mini' onClick={this.handleConfigurationPaste}>
                        <Button positive>Paste</Button>
                        <Label as='a' basic color='green' pointing='left'>{clipboard.size}</Label>
                    </Button>
                </h2>
                <div className="side-panel-column" id="first-left-column" style={{width: sidePanelWidth}}>
                    <Accordion fluid>
                        {this.panelFirstColumn.map((f, index) => f(openSettings, index))}
                    </Accordion>
                </div>
                <div className="side-panel-column" style={{width: sidePanelWidth}}>
                    <Accordion fluid>
                        {this.panelSecondColumn.map((f, index) => f(openSettings, index))}
                    </Accordion>
                </div>
            </div>
        )
    }
}