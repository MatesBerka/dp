// @flow
import * as React from 'react'
import { Accordion, Button, Icon, Popup, Label, Input, Select } from 'semantic-ui-react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import DAW from "../../model/entities/DisplayAndViewer";
import displayAndViewerDAO from "../../model/DisplayAndViewerDAO";
import {displayTypes, displayTypesMenu} from "../../model/data_collections/DisplayTypes";
import {unitDefinition, unitDefinitionMenu} from "../../model/data_collections/UnitsDefinition";
import cameraDAO from "../../model/CameraDAO";
import {ctlSetLoc, inputTypesName} from "../../model/data_collections/ControlsTypes";
import dispatcher from "../../services/Dispatcher";
import {default as utl} from "../../services/ControlsUtils";
import DisplayAndViewer from "../../model/entities/DisplayAndViewer";
import Camera from "../../model/entities/Camera";
import type {vec4} from "../../model/data_collections/flowTypes";

type Props = {
    openSettings: Set<number>,
    toggleSettings: Function,
    copySettings: Function
};
type State = {
    cm: Camera,
    DAWi: DisplayAndViewer
};

/**
 * @classdesc Left panel component with display and viewer configuration.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class DisplayAndViewerConfiguration extends React.Component<Props, State> {
    TAB_INDEX: number = 3;
    modelSwitchListener: Function;
    camerasCountChange: Function;
    /**
     * Component constructor
     */
    constructor (props: Props) {
        super(props);
        this.state = {
            DAWi: displayAndViewerDAO.getActiveRecord(),
            cm: cameraDAO.getActiveRecord()
        };
    }
    /**
     * After the component is mounted register event listeners
     */
    componentDidMount() {
        // register listeners
        this.modelSwitchListener = function(payload) {
            this.setState({
                DAWi: displayAndViewerDAO.getActiveRecord(),
                cm: cameraDAO.getActiveRecord()
            });
        }.bind(this);
        dispatcher.register('modelSwitch', this.modelSwitchListener);
        dispatcher.register('paste', this.modelSwitchListener);
        this.camerasCountChange = function(payload) {
            this.state.DAWi.setDisplayCameraLeft(this.state.DAWi.getDisplayCameraLeft(), this.state.cm.getCamerasCount());
        }.bind(this);
        dispatcher.register('camerasCountChange', this.camerasCountChange);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.modelSwitchListener);
        dispatcher.unregister('paste', this.modelSwitchListener);
        dispatcher.unregister('camerasCountChange', this.camerasCountChange);
    }
    /**
     * Used to convert number into correct range and in the number is out of range add warning sign.
     * @param {vec4} value transformed value
     */
    _convert = (value: vec4) => {
        let val = (Number(value[0].toPrecision(value[1]))).toString(), sgnLength;
        if (value[0] < 0) sgnLength = 1; else sgnLength = 0;
        if (val.length > value[1] + 2 + sgnLength && value[0] < 1 && value[0] > -1) // cut
            val = val.slice(0, value[1] + 2 + sgnLength);
        if (value[2] !== value[3] && (value[0] < value[2] || value[0] > value[3])) // if out of range
            return (<Label color="orange" className="warning-label">{val}</Label>);
        return val;
    };
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
    handleDisplayTypeChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.DAWi.setDisplayType(data.value);
            this.distributeUpdate();
        }
    };
    handleDisplayStereoPPLChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue >= 0) {
                this.state.DAWi.setDisplayStereoPPL(newValue);
                this.distributeUpdate();
            }
        }
    };
    handleDisplayCameraLeftChange = (value: number) => {
        if (value) {
            this.state.DAWi.setDisplayCameraLeft(parseFloat(value), this.state.cm.getCamerasCount());
            this.distributeUpdate();
        }
    };
    handleDisplayCameraOffsetChange = (value: number) => {
        if (value) {
            this.state.DAWi.setDisplayCameraOffset(parseFloat(value), this.state.cm.getCamerasCount());
            this.distributeUpdate();
        }
    };
    handleDisplayLPIChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue >= 0) {
                this.state.DAWi.setDisplayLPI(newValue);
                this.distributeUpdate();
            }
        }
    };
    handleDisplayDPIChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue >= 0) {
                this.state.DAWi.setDisplayDPI(newValue);
                this.distributeUpdate();
            }
        }
    };
    handleDisplayViewAngleChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue > 0) {
                this.state.DAWi.setDisplayViewAngle(newValue);
                this.distributeUpdate();
            }
        }
    };
    handleHeadOptimalDistanceChange = (value: number) => {
        if (value) {
            this.state.DAWi.setHeadOptimalDistance(parseFloat(value) * unitDefinition[this.state.DAWi.getHeadOptimalDistanceUnit()].value);
            this.distributeUpdate();
        }
    };
    handleDisplayWidthChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue >= 0) {
                this.state.DAWi.setDisplayWidth(newValue * unitDefinition[this.state.DAWi.getDisplayWidthUnit()].value);
                this.distributeUpdate();
            }
        }
    };
    handleDisplayAspectChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue >= 0) {
                this.state.DAWi.setDisplayAspect(newValue);
                this.distributeUpdate();
            }
        }
    };
    handleViewingComfortChange = (value: number) => {
        if (value) {
            let newValue = parseFloat(value);
            if (newValue >= 0) {
                this.state.DAWi.setViewingComfort(newValue);
                this.distributeUpdate();
            }
        }
    };
    handleHeadDistanceChange = (value: number) => {
        if (value) {
            this.state.DAWi.setValueForControl('headDistance', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleHeadPositionChange = (value: number) => {
        if (value) {
            this.state.DAWi.setValueForControl('headPosition', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleHeadOptimalDistanceUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.DAWi.setHeadOptimalDistanceUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleDisplayWidthUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.DAWi.setDisplayWidthUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleHeadDistanceUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.DAWi.setHeadDistanceUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    handleHeadPositionUnitChange = (e: Object, data: Object) => {
        if (data.value) {
            this.state.DAWi.setHeadPositionUnit(parseInt(data.value, 10));
            this.distributeUpdate();
        }
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { openSettings, toggleSettings, copySettings } = this.props;
        const { DAWi } = this.state;

        return (
            <div className="configuration-item">
                <Accordion.Title active={openSettings.has(this.TAB_INDEX)} index={this.TAB_INDEX} onClick={toggleSettings}>
                    <Icon name='dropdown' /><h4>Display & Viewer Configuration</h4>
                    <Button positive compact onClick={(e) => copySettings(e, displayAndViewerDAO)} size='mini'>
                        Copy
                    </Button>
                </Accordion.Title>
                <Accordion.Content active={openSettings.has(this.TAB_INDEX)}>
                    <Input size='mini' className="option-group-line">
                        <Select onChange={this.handleDisplayTypeChange} options={displayTypesMenu} compact
                            defaultValue={DAWi.getDisplayType()} size='mini' id="display-type-select"/>
                    </Input>
                    <div id="stereoscopic-display-settings" style={{display: ((DAWi.getDisplayType() === displayTypes.stereoscopic) ? 'block': 'none')}}>
                        <div className="option-group-line">
                            <Input labelPosition='right' size='mini'>
                                <Popup trigger={<Label>Pixels per line:</Label>}
                                       content='Display resolution.' inverted />
                                <input onChange={(e) => this.handleDisplayStereoPPLChange(e.target.value)}
                                    min={DAW.getDisplayStereoPPLControl(ctlSetLoc.min)}
                                    max={DAW.getDisplayStereoPPLControl(ctlSetLoc.max)}
                                    step={DAW.getDisplayStereoPPLControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getDisplayStereoPPLControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getDisplayStereoPPL()} className="short-input"/>
                                <Popup trigger={<Label>Left image:</Label>}
                                       content='Select image for left eye. First camera has index 1.' inverted />
                                <input onChange={(e) => this.handleDisplayCameraLeftChange(e.target.value)}
                                    min={DAW.getDisplayCameraLeftControl(ctlSetLoc.min)}
                                    max={DAW.getDisplayCameraLeftControl(ctlSetLoc.max)}
                                    step={DAW.getDisplayCameraLeftControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getDisplayCameraLeftControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getDisplayCameraLeft()} className="mini-input right-border"/>
                            </Input>
                        </div>
                        <div className="option-group-line">
                            <Input labelPosition='right' size='mini'>
                                <Popup trigger={<Label>Right image offset:</Label>}
                                       content='Select image for right eye (= left image index + offset).' inverted />
                                <input onChange={(e) => this.handleDisplayCameraOffsetChange(e.target.value)}
                                    min={DAW.getDisplayCameraOffsetControl(ctlSetLoc.min)}
                                    max={DAW.getDisplayCameraOffsetControl(ctlSetLoc.max)}
                                    step={DAW.getDisplayCameraOffsetControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getDisplayCameraOffsetControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getDisplayCameraOffset()} className="mini-input right-border"/>
                            </Input>
                        </div>
                    </div>
                    <div id="lenticular-display-settings" style={{display: ((DAWi.getDisplayType() === displayTypes.lenticular) ? 'block': 'none')}}>
                        <div className="option-group-line">
                            <Input labelPosition='right' size='mini' >
                                <Label>Display LPI:</Label>
                                <input onChange={(e) => this.handleDisplayLPIChange(e.target.value)}
                                    min={DAW.getDisplayLPIControl(ctlSetLoc.min)}
                                    max={DAW.getDisplayLPIControl(ctlSetLoc.max)}
                                    step={DAW.getDisplayLPIControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getDisplayLPIControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getDisplayLPI()} className="short-input"/>
                                <Label>Display DPI:</Label>
                                <input onChange={(e) => this.handleDisplayDPIChange(e.target.value)}
                                    min={DAW.getDisplayDPIControl(ctlSetLoc.min)}
                                    max={DAW.getDisplayDPIControl(ctlSetLoc.max)}
                                    step={DAW.getDisplayDPIControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getDisplayDPIControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getDisplayDPI()} className="short-input right-border"/>
                            </Input>
                        </div>
                        <div className="option-group-line">
                            <Input labelPosition='right' size='mini'>
                                <Label>View. angle:</Label>
                                <input onChange={(e) => this.handleDisplayViewAngleChange(e.target.value)}
                                    min={DAW.getDisplayViewAngleControl(ctlSetLoc.min)}
                                    max={DAW.getDisplayViewAngleControl(ctlSetLoc.max)}
                                    step={DAW.getDisplayViewAngleControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getDisplayViewAngleControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getDisplayViewAngle()} className="short-input right-border"/>
                            </Input>
                        </div>
                        <div className="option-group-line">
                            <Input labelPosition='right' size='mini'>
                                <Label>Preferred head distance:</Label>
                                <input onChange={(e) => this.handleHeadOptimalDistanceChange(e.target.value)}
                                    min={DAW.getHeadOptimalDistanceControl(ctlSetLoc.min)}
                                    max={DAW.getHeadOptimalDistanceControl(ctlSetLoc.max)}
                                    step={DAW.getHeadOptimalDistanceControl(ctlSetLoc.step)}
                                    type={inputTypesName[DAW.getHeadOptimalDistanceControl(ctlSetLoc.inputTypes)]}
                                    value={DAWi.getValueForControl('headOptimalDistance')} className="short-input"/>
                                <Select compact options={unitDefinitionMenu} onChange={this.handleHeadOptimalDistanceUnitChange}
                                    defaultValue={DAWi.getHeadOptimalDistanceUnit()} />
                            </Input>
                        </div>
                    </div>
                    <div className="option-group-line">
                        <Input labelPosition='right' size='mini' >
                            <Label>Display width:</Label>
                            <input onChange={(e) => this.handleDisplayWidthChange(e.target.value)}
                                min={DAW.getDisplayWidthControl(ctlSetLoc.min)}
                                max={DAW.getDisplayWidthControl(ctlSetLoc.max)}
                                step={DAW.getDisplayWidthControl(ctlSetLoc.step)}
                                type={inputTypesName[DAW.getDisplayWidthControl(ctlSetLoc.inputTypes)]}
                                value={DAWi.getValueForControl('displayWidth')} className="short-input"/>
                            <Select compact options={unitDefinitionMenu} onChange={this.handleDisplayWidthUnitChange}
                                defaultValue={DAWi.getDisplayWidthUnit()} />
                        </Input>
                    </div>
                    <div className="option-group-line">
                        <Input labelPosition='right' size='mini' >
                            <Popup trigger={<Label>Display W/H:</Label>}
                                   content='This value is used to determine display height.' inverted />
                            <input onChange={(e) => this.handleDisplayAspectChange(e.target.value)}
                                min={DAW.getDisplayAspectControl(ctlSetLoc.min)}
                                max={DAW.getDisplayAspectControl(ctlSetLoc.max)}
                                step={DAW.getDisplayAspectControl(ctlSetLoc.step)}
                                type={inputTypesName[DAW.getDisplayAspectControl(ctlSetLoc.inputTypes)]}
                                value={DAWi.getDisplayAspect()} className="short-input right-border"/>
                        </Input>
                    </div>
                    <div className="option-group-line">
                        <Input labelPosition='right' size='mini'>
                            <Popup trigger={<Label>Viewing Comfort:</Label>}
                                   content='10 for the best and 0 for the worst.' inverted />
                            <input onChange={(e) => this.handleViewingComfortChange(e.target.value)}
                                   min={DAW.getViewingComfortControl(ctlSetLoc.min)}
                                   max={DAW.getViewingComfortControl(ctlSetLoc.max)}
                                   step={DAW.getViewingComfortControl(ctlSetLoc.step)}
                                   type={inputTypesName[DAW.getViewingComfortControl(ctlSetLoc.inputTypes)]}
                                   value={DAWi.getViewingComfort()} className="short-input right-border"/>
                        </Input>
                    </div>
                    <div className="option-group-line"><h5>Head Distance:</h5></div>
                    <div className="option-group-line">
                        <Input type='text' size='mini'>
                            <input onChange={(e) => this.handleHeadDistanceChange(e.target.value)}
                                type={inputTypesName[DAW.getHeadDistanceControl(ctlSetLoc.inputTypes)]}
                                min={DAW.getHeadDistanceControl(ctlSetLoc.min)}
                                max={DAW.getHeadDistanceControl(ctlSetLoc.max)}
                                step={DAW.getHeadDistanceControl(ctlSetLoc.step)}
                                value={DAWi.getValueForControl('headDistance')} className="short-input" style={{ borderRight: 0}}/>
                            <Select compact options={unitDefinitionMenu} onChange={this.handleHeadDistanceUnitChange}
                                defaultValue={DAWi.getHeadDistanceUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                                value={utl.updateRangeLog(DAW.getHeadDistanceControl(ctlSetLoc.min),
                                    DAW.getHeadDistanceControl(ctlSetLoc.max), DAWi.getValueForControl('headDistance'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleHeadDistanceChange(utl.updateNumLog(DAW.getHeadDistanceControl(ctlSetLoc.min),
                                        DAW.getHeadDistanceControl(ctlSetLoc.max), DAW.getHeadDistanceControl(ctlSetLoc.precision), val))}}/>
                    </div>
                    <div className="option-group-line" id="daw-calculation">
                        <span>({this._convert(DAWi.getDisplayPPI())} ppi</span>
                        <span> ~ {this._convert(DAWi.getDisplayPPDeg())} pp°,</span>
                        <span> angle {this._convert(DAWi.getViewerAngle())}°,</span>
                        <span> ideal dist. {DAWi.getIdealDisplayDistance()} m)</span>
                    </div>
                    <div className="option-group-line"><h5>Head Position:</h5></div>
                    <div className="option-group-line">
                        <Input type='text' size='mini'>
                            <input onChange={(e) => this.handleHeadPositionChange(e.target.value)}
                                type={inputTypesName[DAW.getHeadPositionControl(ctlSetLoc.inputTypes)]}
                                min={DAW.getHeadPositionControl(ctlSetLoc.min)}
                                max={DAW.getHeadPositionControl(ctlSetLoc.max)}
                                step={DAW.getHeadPositionControl(ctlSetLoc.step)}
                                value={DAWi.getValueForControl('headPosition')} className="short-input" style={{ borderRight: 0}}/>
                            <Select compact options={unitDefinitionMenu} onChange={this.handleHeadPositionUnitChange}
                                defaultValue={DAWi.getHeadPositionUnit()} />
                        </Input>
                        <Slider min={0} max={100} step={1} tooltip={false}
                                value={utl.updateRangeLin(DAW.getHeadPositionControl(ctlSetLoc.min), DAW.getHeadPositionControl(ctlSetLoc.max),
                                    DAWi.getValueForControl('headPosition'))}
                                format={utl.formatSliderValue}
                                onChange={(val, e) => {e.preventDefault();
                                    this.handleHeadPositionChange(utl.updateNumLin(DAW.getHeadPositionControl(ctlSetLoc.min),
                                        DAW.getHeadPositionControl(ctlSetLoc.max), DAW.getHeadPositionControl(ctlSetLoc.precision), val))}}/>
                    </div>
                </Accordion.Content>
            </div>
        )
    }
}