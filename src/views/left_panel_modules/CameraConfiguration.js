// @flow
import * as React from 'react'
import { Accordion, Button, Icon, Popup, Label, Input, Select, Checkbox } from 'semantic-ui-react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import CM from "../../model/entities/Camera"
import cameraDAO from "../../model/CameraDAO";
import Camera from '../../model/entities/Camera.js';
import cameraTypes from "../../model/data_collections/CameraTypes"
import cameraSensors from "../../model/data_collections/CameraSensors"
import { unitDefinition, unitDefinitionMenu } from "../../model/data_collections/UnitsDefinition"
import { ctlSetLoc, inputTypesName } from "../../model/data_collections/ControlsTypes";
import { default as utl } from "../../services/ControlsUtils";
import dispatcher from "../../services/Dispatcher";

type Props = {
    openSettings: Set<number>,
    toggleSettings: Function,
    copySettings: Function
};
type State = {
    cm: Camera,
};

/**
 * @classdesc Left panel component with camera configuration.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class CameraConfiguration extends React.Component<Props, State> {
    TAB_INDEX: number = 1;
    modelSwitchListener: Function;
    /**
     * Component constructor
     */
    constructor (props: Props) {
        super(props);
        this.state = {
            cm: cameraDAO.getActiveRecord()
        };
    }
    /**
     * After the component is mounted register event listeners
     */
    componentDidMount() {
        this.modelSwitchListener = function (payload) {
            this.setState({ cm: cameraDAO.getActiveRecord() });
        }.bind(this);
        dispatcher.register('modelSwitch', this.modelSwitchListener);
        dispatcher.register('paste', this.modelSwitchListener);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.modelSwitchListener);
        dispatcher.unregister('paste', this.modelSwitchListener);
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
    handleFocalLengthChange = (value: number) => {
        if (value) {
            this.state.cm.setFocalLength(parseFloat(value) * unitDefinition[this.state.cm.getFocalLengthUnit()].value);
            this.distributeUpdate();
        }
    };
    handleCameraDistanceChange = (value: number) => {
        if (value) {
            this.state.cm.setCameraDistance(parseFloat(value) * unitDefinition[this.state.cm.getCameraDistanceUnit()].value);
            this.distributeUpdate();
        }
    };
    handleCameraSeparationChange = (value: number) => {
        if (value) {
            this.state.cm.setCameraSeparation(parseFloat(value) * unitDefinition[this.state.cm.getCameraSeparationUnit()].value);
            this.distributeUpdate();
        }
    };
    handleCameraCrossingChange = (value: number) => {
        if (value) {
            this.state.cm.setCameraCrossing(parseFloat(value) * unitDefinition[this.state.cm.getCameraCrossingUnit()].value);
            this.distributeUpdate();
        }
    };
    handleCameraSensorWidthChange = (e: Object) => {
        if (e.target.value) {
            this.state.cm.setSensorWidth(parseFloat(e.target.value) * unitDefinition[this.state.cm.getSensorWidthUnit()].value);
            this.distributeUpdate();
        }
    };
    handleCameraSensorHeightChange = (e: Object) => {
        if (e.target.value) {
            this.state.cm.setSensorHeight(parseFloat(e.target.value) * unitDefinition[this.state.cm.getSensorHeightUnit()].value);
            this.distributeUpdate();
        }
    };
    handleCameraHeightChange = (value: number) => {
        if (value) {
            this.state.cm.setValueForControl('cameraHeight', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleCameraSensorTypeChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.cm.setSensorSizeIdx(data.value);
            this.distributeUpdate();
        }
    };
    handleFocalLengthUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.cm.setFocalLengthUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleCameraDistanceUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.cm.setCameraDistanceUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleCameraSeparationUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.cm.setCameraSeparationUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleCameraCrossingUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.cm.setCameraCrossingUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleCameraHeightUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.cm.setCameraHeightUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleCamerasCountChange = (value: number) => {
        if (value && value > CM.getCamerasCountControl(ctlSetLoc.min) && value < CM.getCamerasCountControl(ctlSetLoc.max)) {
            this.state.cm.setCamerasCount(parseInt(value, 10));
            dispatcher.dispatch('camerasCountChange', {});
            this.distributeUpdate();
        }
    };
    handleFNumberChange = (value: number) => {
        if (value) {
            this.state.cm.setFNumber(parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleCameraTypeChange = (value: string) => {
        if (value) {
            this.state.cm.setCameraType(value);
            this.distributeUpdate();
        }
    };
    handleFocalLengthCorrectionToggle = (e: Object, data: Object) => {
        this.state.cm.setFocalLengthCorrection(data.checked);
        this.distributeUpdate();
    };
    handleKeepCamerasAngleToggle = (e: Object, data: Object) => {
        this.state.cm.setKeepCamerasAngle(data.checked);
        this.distributeUpdate();
    };
    handleKeepObjectSizeToggle = (e: Object, data: Object) => {
        this.state.cm.setKeepObjectSize(data.checked);
        this.distributeUpdate();
    };

    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { openSettings, toggleSettings, copySettings } = this.props;
        const { cm } = this.state;

        return (
            <div className="configuration-item">
                <Accordion.Title active={openSettings.has(this.TAB_INDEX)} index={this.TAB_INDEX} onClick={toggleSettings}>
                    <Icon name='dropdown'/><h4>Camera Settings</h4>
                    <Button positive compact onClick={(e) => copySettings(e, cameraDAO)} size='mini'>
                        Copy
                    </Button>
                </Accordion.Title>
                <Accordion.Content active={openSettings.has(this.TAB_INDEX)}>
                    <Popup trigger={<div className="option-group-line"><h5>Camera sensor:</h5></div>}
                           content='Pick one of the predefined sensors or enter your own size.' inverted />
                    <div className="option-group-line">
                        <Input labelPosition='right' size='mini'>
                            <Label>W x H:</Label>
                            <input type={inputTypesName[CM.getSensorWidthControl(ctlSetLoc.inputTypes)]}
                                value={cm.getValueForControl('sensorWidth')} onChange={this.handleCameraSensorWidthChange}
                                className="short-input" step={CM.getSensorWidthControl(ctlSetLoc.step)}/>
                            <input type={inputTypesName[CM.getSensorHeightControl(ctlSetLoc.inputTypes)]}
                                value={cm.getValueForControl('sensorHeight')} onChange={this.handleCameraSensorHeightChange}
                                className="short-input" step={CM.getSensorHeightControl(ctlSetLoc.step)}/>
                            <Label>mm</Label>
                            <Select compact onChange={this.handleCameraSensorTypeChange} options={cameraSensors}
                                value={cm.getSensorSizeIdx()} />
                        </Input>
                    </div>
                    <div className="option-group-line"><h5>Focal Length:</h5></div>
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input
                                type={inputTypesName[CM.getFocalLengthControl(ctlSetLoc.inputTypes)]}
                                step={CM.getFocalLengthControl(ctlSetLoc.step)}
                                min={CM.getFocalLengthControl(ctlSetLoc.min)}
                                max={CM.getFocalLengthControl(ctlSetLoc.max)}
                                value={cm.getValueForControl('focalLength')}
                                onChange={(e) => this.handleFocalLengthChange(e.target.value)}
                                className="short-input" style={{borderRight: 0}} />
                            <Select compact onChange={this.handleFocalLengthUnitChange} options={unitDefinitionMenu}
                                    value={cm.getFocalLengthUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                            value={utl.updateRangeLog(CM.getFocalLengthControl(ctlSetLoc.min), CM.getFocalLengthControl(ctlSetLoc.max), cm.getValueForControl('focalLength'))}
                            format={utl.formatSliderValue}
                            onChange={(val, e) => {e.preventDefault();
                                this.handleFocalLengthChange(utl.updateNumLog(CM.getFocalLengthControl(ctlSetLoc.min),
                                CM.getFocalLengthControl(ctlSetLoc.max), CM.getFocalLengthControl(ctlSetLoc.precision), val))}} />
                    </div>

                    <div className="option-group-line">
                        (angle: {cm.getCameraAngle()})
                    </div>

                    <Popup trigger={<div className="option-group-line"><h5>Camera Distance:</h5></div>}
                           content='Distance from the scene.' inverted />
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input
                                onChange={(e) => this.handleCameraDistanceChange(e.target.value)}
                                min={CM.getCameraDistanceControl(ctlSetLoc.min)}
                                max={CM.getCameraDistanceControl(ctlSetLoc.max)}
                                type={inputTypesName[CM.getCameraDistanceControl(ctlSetLoc.inputTypes)]}
                                value={cm.getValueForControl('cameraDistance')} className="short-input"
                                step={CM.getCameraDistanceControl(ctlSetLoc.step)} style={{ borderRight: 0}}/>
                            <Select compact onChange={this.handleCameraDistanceUnitChange} options={unitDefinitionMenu}
                                value={cm.getCameraDistanceUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                                value={utl.updateRangeLog(CM.getCameraDistanceControl(ctlSetLoc.min), CM.getCameraDistanceControl(ctlSetLoc.max), cm.getValueForControl('cameraDistance'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleCameraDistanceChange(utl.updateNumLog(CM.getCameraDistanceControl(ctlSetLoc.min),
                                        CM.getCameraDistanceControl(ctlSetLoc.max), CM.getCameraDistanceControl(ctlSetLoc.precision), val))}} />
                    </div>

                    <Popup trigger={<div className="option-group-line"><h5>Camera Separation:</h5></div>}
                           content='Distance between cameras.' inverted />
                    <div className="option-group-line">
                        <Input type='number' size='mini'>
                            <input onChange={(e) => this.handleCameraSeparationChange(e.target.value)}
                                min={CM.getCameraSeparationControl(ctlSetLoc.min)}
                                max={CM.getCameraSeparationControl(ctlSetLoc.max)}
                                type={inputTypesName[CM.getCameraSeparationControl(ctlSetLoc.inputTypes)]}
                                value={cm.getValueForControl('cameraSeparation')} className="short-input"
                                step={CM.getCameraSeparationControl(ctlSetLoc.step)} style={{borderRight: 0}}/>
                            <Select compact onChange={this.handleCameraSeparationUnitChange} options={unitDefinitionMenu}
                                value={cm.getCameraSeparationUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                                value={utl.updateRangeLog(CM.getCameraSeparationControl(ctlSetLoc.min), CM.getCameraSeparationControl(ctlSetLoc.max), cm.getValueForControl('cameraSeparation'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleCameraSeparationChange(utl.updateNumLog(CM.getCameraSeparationControl(ctlSetLoc.min),
                                        CM.getCameraSeparationControl(ctlSetLoc.max), CM.getCameraSeparationControl(ctlSetLoc.precision), val))}} />
                    </div>
                    <div className="option-group-line"><h5>Camera Crossing:</h5></div>
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input onChange={(e) => this.handleCameraCrossingChange(e.target.value)}
                                type={inputTypesName[CM.getCameraCrossingControl(ctlSetLoc.inputTypes)]}
                                min={CM.getCameraCrossingControl(ctlSetLoc.min)}
                                max={CM.getCameraCrossingControl(ctlSetLoc.max)}
                                value={cm.getValueForControl('cameraCrossing')} className="short-input"
                                step={CM.getCameraCrossingControl(ctlSetLoc.step)} style={{borderRight: 0}}/>
                            <Select compact  onChange={this.handleCameraCrossingUnitChange} options={unitDefinitionMenu}
                                value={cm.getCameraCrossingUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                                value={utl.updateRangeLin(CM.getCameraCrossingControl(ctlSetLoc.min), CM.getCameraCrossingControl(ctlSetLoc.max), cm.getValueForControl('cameraCrossing'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleCameraCrossingChange(utl.updateNumLin(CM.getCameraCrossingControl(ctlSetLoc.min),
                                        CM.getCameraCrossingControl(ctlSetLoc.max), CM.getCameraCrossingControl(ctlSetLoc.precision), val))}} />
                    </div>

                    <Popup trigger={<div className="option-group-line"><h5>Camera Height:</h5></div>}
                           content='Use cameras view side view to see the effect.' inverted />
                    <div className="option-group-line">
                        <Input size='mini'>
                            <input onChange={(e) => this.handleCameraHeightChange(e.target.value)}
                                min={CM.getCameraHeightControl(ctlSetLoc.min)}
                                max={CM.getCameraHeightControl(ctlSetLoc.max)}
                                value={cm.getValueForControl('cameraHeight')}
                                type={inputTypesName[CM.getCameraHeightControl(ctlSetLoc.inputTypes)]} className="short-input"
                                step={CM.getCameraHeightControl(ctlSetLoc.step)} style={{borderRight: 0}}/>
                            <Select compact  onChange={this.handleCameraHeightUnitChange} options={unitDefinitionMenu}
                                value={cm.getCameraHeightUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                                value={utl.updateRangeLin(CM.getCameraHeightControl(ctlSetLoc.min), CM.getCameraHeightControl(ctlSetLoc.max), cm.getValueForControl('cameraHeight'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleCameraHeightChange(utl.updateNumLin(CM.getCameraHeightControl(ctlSetLoc.min),
                                        CM.getCameraHeightControl(ctlSetLoc.max), CM.getCameraHeightControl(ctlSetLoc.precision), val))}} />
                    </div>

                    <div className="option-group-line">
                        <div className="ui mini labeled input">
                            <Popup trigger={<label className="ui label label">Cameras Count:</label>}
                                   content='Determines number of images used for final composition. Also can influence diagnostics (global setting).' inverted />
                            <input onChange={(e) => this.handleCamerasCountChange(e.target.value)} className="short-input"
                                min={CM.getCamerasCountControl(ctlSetLoc.min)}
                                max={CM.getCamerasCountControl(ctlSetLoc.max)}
                                defaultValue={cm.getCamerasCount()}
                                type={inputTypesName[CM.getCamerasCountControl(ctlSetLoc.inputTypes)]}
                                step={CM.getCamerasCountControl(ctlSetLoc.step)}/>
                        </div>
                    </div>

                    <div className="option-group-line">
                        <div className="ui mini labeled input">
                            <Popup trigger={<label className="ui label label">F-number:</label>}
                                   content="Ratio of the cameras's focal length to the diameter of the entrance pupil." inverted />
                            <input onChange={(e) => this.handleFNumberChange(e.target.value)} className="short-input"
                                   min={CM.getFNumberControl(ctlSetLoc.min)}
                                   max={CM.getFNumberControl(ctlSetLoc.max)}
                                   value={cm.getFNumber()}
                                   type={inputTypesName[CM.getFNumberControl(ctlSetLoc.inputTypes)]}
                                   step={CM.getFNumberControl(ctlSetLoc.step)}/>
                        </div>
                    </div>

                    <div className="option-group-line">
                        <div className="ui mini labeled input">
                            <Popup trigger={<label className="ui label label">Camera Type:</label>}
                                   content='Determines camera sensor orientation.' inverted />
                            <Select compact onChange={(e, data) => this.handleCameraTypeChange(data.value)}
                                options={cameraTypes} value={cm.getCameraType()} />
                        </div>
                    </div>

                    <div className="option-group-line">
                        <Popup trigger={<Checkbox label='Focal length correction' onChange={this.handleFocalLengthCorrectionToggle}
                            checked={cm.getFocalLengthCorrection()}/>} content='Set true for autocorrection.' inverted />
                    </div>
                    <div className="option-group-line">
                        <Checkbox label='Keep cameras angle' onChange={this.handleKeepCamerasAngleToggle}
                            checked={cm.getKeepCamerasAngle()}/>
                    </div>
                    <div className="option-group-line">
                        <Checkbox label='Keep object size' onChange={this.handleKeepObjectSizeToggle}
                            checked={cm.getKeepObjectSize()}/>
                    </div>
                </Accordion.Content>
            </div>
        )
    }
}