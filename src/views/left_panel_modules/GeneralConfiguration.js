// @flow
import * as React from 'react'
import { Accordion, Button, Icon, Popup, Select } from 'semantic-ui-react'
import 'react-rangeslider/lib/index.css'

import {colorSchemeMenu} from "../../model/data_collections/ColorSchemes";
import generalDAO from "../../model/GeneralDAO";
import cameraDAO from "../../model/CameraDAO";
import dispatcher from "../../services/Dispatcher";
import General from "../../model/entities/General";

type Props = {
    openSettings: Set<number>,
    toggleSettings: Function,
    copySettings: Function
};
type State = {
    general: General,
};

/**
 * @classdesc Left panel component with general configuration.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class GeneralConfiguration extends React.Component<Props, State> {
    TAB_INDEX: number = 4;
    modelSwitchListener: Function;
    /**
     * Component constructor
     */
    constructor (props: Props) {
        super(props);

        this.state = {
            general: generalDAO.getActiveRecord()
        };

    }
    /**
     * After the component is mounted register event listeners
     */
    componentDidMount() {
        this.modelSwitchListener = function (payload) {
            this.setState({ general: generalDAO.getActiveRecord() });
        }.bind(this);
        dispatcher.register('modelSwitch', this.modelSwitchListener);
        dispatcher.register('paste', this.modelSwitchListener);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.modelSwitchListener);
        dispatcher.register('paste', this.modelSwitchListener);
    }
    /**
     * Notify other components about internal change.
     */
    distributeUpdate = () => {
        dispatcher.dispatch('configurationUpdate', {});
        this.forceUpdate();
    };
    /**
     * Events handling function for component controls.
     * @param {number} value
     */
    handleColorSchemeChange = (value: number) => {
        this.state.general.setColorSchemeIdx(value);
        this.distributeUpdate();
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { openSettings, toggleSettings, copySettings } = this.props;
        const { general } = this.state;

        return (
            <div className="configuration-item">
                <Accordion.Title active={openSettings.has(this.TAB_INDEX)} index={this.TAB_INDEX} onClick={toggleSettings}>
                    <Icon name='dropdown'/><h4>General Configuration</h4>
                    <Button positive animated compact onClick={(e) => copySettings(e, cameraDAO)} size='mini'>
                        <Button.Content hidden>Copy</Button.Content>
                        <Button.Content visible><Icon name='copy' /></Button.Content>
                    </Button>
                </Accordion.Title>
                <Accordion.Content active={openSettings.has(this.TAB_INDEX)}>
                    <div className="option-group-line">
                        <div className="ui mini labeled input">
                            <Popup trigger={<label className="ui label label">Color Scheme:</label>}
                                   content='Hello. This is an inverted popup' inverted />
                            <Select label='sdf' compact onChange={(e, data) => this.handleColorSchemeChange(data.value)}
                                options={colorSchemeMenu} defaultValue={general.getColorSchemeIdx()} />
                        </div>
                    </div>
                </Accordion.Content>
            </div>
        )
    }
}