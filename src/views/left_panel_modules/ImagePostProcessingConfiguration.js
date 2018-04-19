// @flow
import * as React from 'react'
import { Accordion, Button, Icon, Popup, Input, Select } from 'semantic-ui-react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import IPR from "../../model/entities/PostProcessing";
import postProcessingDAO from "../../model/PostProcessingDAO";
import { percUnitDefinitionMenu } from "../../model/data_collections/UnitsDefinition";
import { ctlSetLoc, inputTypesName } from "../../model/data_collections/ControlsTypes";
import dispatcher from "../../services/Dispatcher";
import {default as utl} from "../../services/ControlsUtils";
import PostProcessing from "../../model/entities/PostProcessing";

type Props = {
    openSettings: Set<number>,
    toggleSettings: Function,
    copySettings: Function
};
type State = {
    imgPro: PostProcessing,
};

/**
 * @classdesc Left panel component with image post processing configuration.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class ImagePostProcessingConfiguration extends React.Component<Props, State> {
    TAB_INDEX: number = 2;
    modelSwitchListener: Function;
    /**
     * Component constructor
     */
    constructor (props: Props) {
        super(props);

        this.state = {
            imgPro: postProcessingDAO.getActiveRecord()
        };
    }
    /**
     * After the component is mounted register event listeners
     */
    componentDidMount() {
        this.modelSwitchListener = function (payload) {
            this.setState({ imgPro: postProcessingDAO.getActiveRecord() });
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
     * Events handling functions for component controls.
     */
    handleImagesKeystoneChange = (value: number) => {
        this.state.imgPro.setValueForControl('imagesKeystone', parseFloat(value));
        this.distributeUpdate();
    };
    handleImagesKeystoneUnitChange = (e: Object, data: Object) => {
        this.state.imgPro.setImagesKeystoneUnit(parseInt(data.value, 10));
        this.distributeUpdate();
    };
    handleImagesStretchChange = (value: number) => {
        this.state.imgPro.setValueForControl('imagesStretch', parseFloat(value));
        this.distributeUpdate();
    };
    handleImagesStretchUnitChange = (e: Object, data: Object) => {
        this.state.imgPro.setImagesStretchUnit(parseInt(data.value, 10));
        this.distributeUpdate();
    };
    handleImagesShiftChange = (value: number) => {
        this.state.imgPro.setValueForControl('imagesShift', parseFloat(value));
        this.distributeUpdate();
    };
    handleImagesShiftUnitChange = (e: Object, data: Object) => {
        this.state.imgPro.setImagesShiftUnit(parseInt(data.value, 10));
        this.distributeUpdate();
    };
    handleImagesZoomChange = (value: number) => {
        this.state.imgPro.setValueForControl('imagesZoom', parseFloat(value));
        this.distributeUpdate();
    };
    handleImagesZoomUnitChange = (e: Object, data: Object) => {
        this.state.imgPro.setImagesZoomUnit(parseInt(data.value, 10));
        this.distributeUpdate();
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { openSettings, toggleSettings, copySettings } = this.props;
        const { imgPro } = this.state;

        return (
            <div className="configuration-item">
                <Accordion.Title active={openSettings.has(this.TAB_INDEX)} index={this.TAB_INDEX} onClick={toggleSettings}>
                    <Icon name='dropdown'/><h4>Images postprocessing</h4>
                    <Button positive compact onClick={(e) => copySettings(e, postProcessingDAO)} size='mini'>
                        Copy
                    </Button>
                </Accordion.Title>
                <Accordion.Content active={openSettings.has(this.TAB_INDEX)}>
                    <Popup trigger={<div className="option-group-line"><h5>Image Keystone:</h5></div>}
                           content='Use to repair possible keystone effect.' inverted />
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input value={imgPro.getValueForControl('imagesKeystone')}
                                min={IPR.getImagesKeystoneControl(ctlSetLoc.min)}
                                max={IPR.getImagesKeystoneControl(ctlSetLoc.max)}
                                step={IPR.getImagesKeystoneControl(ctlSetLoc.step)}
                                type={inputTypesName[IPR.getImagesKeystoneControl(ctlSetLoc.inputTypes)]}
                                onChange={(e) => this.handleImagesKeystoneChange(e.target.value)}
                                className="short-input" style={{ borderRight: 0}}/>
                            <Select compact options={percUnitDefinitionMenu} onChange={this.handleImagesKeystoneUnitChange}
                                defaultValue={imgPro.getImagesKeystoneUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1}
                                value={utl.updateRangeLin(IPR.getImagesKeystoneControl(ctlSetLoc.min),
                                    IPR.getImagesKeystoneControl(ctlSetLoc.max), imgPro.getValueForControl('imagesKeystone'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleImagesKeystoneChange(utl.updateNumLin(IPR.getImagesKeystoneControl(ctlSetLoc.min),
                                        IPR.getImagesKeystoneControl(ctlSetLoc.max), IPR.getImagesKeystoneControl(ctlSetLoc.precision), val))}}/>
                    </div>

                    <Popup trigger={<div className="option-group-line"><h5>Images Stretch:</h5></div>}
                           content='Use to repair possible deformations.' inverted />
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input value={imgPro.getValueForControl('imagesStretch')}
                                min={IPR.getImagesStretchControl(ctlSetLoc.min)}
                                max={IPR.getImagesStretchControl(ctlSetLoc.max)}
                                step={IPR.getImagesStretchControl(ctlSetLoc.step)}
                                type={inputTypesName[IPR.getImagesStretchControl(ctlSetLoc.inputTypes)]}
                                onChange={(e) => this.handleImagesStretchChange(e.target.value)} className="short-input"
                                style={{borderRight: 0}}/>
                            <Select compact options={percUnitDefinitionMenu} onChange={this.handleImagesStretchUnitChange}
                                defaultValue={imgPro.getImagesStretchUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1}
                                value={utl.updateRangeLin(IPR.getImagesStretchControl(ctlSetLoc.min),
                                    IPR.getImagesStretchControl(ctlSetLoc.max), imgPro.getValueForControl('imagesStretch'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleImagesStretchChange(utl.updateNumLin(IPR.getImagesStretchControl(ctlSetLoc.min),
                                        IPR.getImagesStretchControl(ctlSetLoc.max), IPR.getImagesStretchControl(ctlSetLoc.precision), val))}}/>
                    </div>

                    <Popup trigger={<div className="option-group-line"><h5>Images Shift:</h5></div>}
                           content='Use to influence final scene depth.' inverted />
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input value={imgPro.getValueForControl('imagesShift')}
                                   min={IPR.getImagesShiftControl(ctlSetLoc.min)}
                                   max={IPR.getImagesShiftControl(ctlSetLoc.max)}
                                   step={IPR.getImagesShiftControl(ctlSetLoc.step)}
                                   type={inputTypesName[IPR.getImagesShiftControl(ctlSetLoc.inputTypes)]}
                                onChange={(e) => this.handleImagesShiftChange(e.target.value)} className="short-input"
                                style={{borderRight: 0}}/>
                            <Select compact options={percUnitDefinitionMenu} onChange={this.handleImagesShiftUnitChange}
                                defaultValue={imgPro.getImagesShiftUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1}
                                value={utl.updateRangeLin(IPR.getImagesShiftControl(ctlSetLoc.min),
                                    IPR.getImagesShiftControl(ctlSetLoc.max), imgPro.getValueForControl('imagesShift'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleImagesShiftChange(utl.updateNumLin(IPR.getImagesShiftControl(ctlSetLoc.min),
                                        IPR.getImagesShiftControl(ctlSetLoc.max), IPR.getImagesShiftControl(ctlSetLoc.precision), val))}}/>
                    </div>

                    <div className="option-group-line"><h5>Images Zoom:</h5></div>
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input className="short-input" value={imgPro.getValueForControl('imagesZoom')}
                                   min={IPR.getImagesZoomControl(ctlSetLoc.min)}
                                   max={IPR.getImagesZoomControl(ctlSetLoc.max)}
                                   step={IPR.getImagesZoomControl(ctlSetLoc.step)}
                                   type={inputTypesName[IPR.getImagesZoomControl(ctlSetLoc.inputTypes)]}
                                onChange={(e) => this.handleImagesZoomChange(e.target.value)}  style={{borderRight: 0}}/>
                            <Select compact options={percUnitDefinitionMenu} onChange={this.handleImagesZoomUnitChange}
                                defaultValue={imgPro.getImagesZoomUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1}
                                value={utl.updateRangeLin(IPR.getImagesZoomControl(ctlSetLoc.min),
                                    IPR.getImagesZoomControl(ctlSetLoc.max), imgPro.getValueForControl('imagesZoom'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleImagesZoomChange(utl.updateNumLin(IPR.getImagesZoomControl(ctlSetLoc.min),
                                        IPR.getImagesZoomControl(ctlSetLoc.max), IPR.getImagesZoomControl(ctlSetLoc.precision), val))}}/>
                    </div>
                </Accordion.Content>
            </div>
        )
    }
}