// @flow
import * as React from 'react'
import { Accordion, Button, Icon, Popup, Label, Input, Select } from 'semantic-ui-react'

import SO from '../../model/entities/SceneObject';
import sceneObjectDAO from '../../model/SceneObjectDAO.js';
import {unitDefinitionMenu} from "../../model/data_collections/UnitsDefinition";
import {objTypeIdxMenu} from "../../model/data_collections/ObjectTypes";
import visualizationBuilder from "../../services/VisualizationBuilder";
import {ctlSetLoc, inputTypesName} from "../../model/data_collections/ControlsTypes";
import dispatcher from "../../services/Dispatcher";

type Props = {
    openSettings: Set<number>,
    toggleSettings: Function,
    copySettings: Function,
    checkPanelSize: Function
};
type State = {
    modelObjects: Array<SO>,
    openObjectSettings: Set<number>,
};

/**
 * @classdesc Left panel component with scene configuration.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class SceneConfiguration extends React.Component<Props, State> {
    TAB_INDEX: number = 0;
    checkColumnsSize: boolean = false;
    modelSwitchListener: Function;
    sceneConfigurationUpdate: Function;
    /**
     * Component constructor
     */
    constructor (props: Props) {
        super(props);
        this.state = {
            modelObjects: sceneObjectDAO.getActiveRecord(),
            openObjectSettings: new Set([]),
        };
    }
    /**
     * After the component is mounted register event listeners
     */
    componentDidMount() {
        this.modelSwitchListener = function(payload) {
            this.setState({ modelObjects: sceneObjectDAO.getActiveRecord() });
        }.bind(this);
        dispatcher.register('modelSwitch', this.modelSwitchListener);
        dispatcher.register('paste', this.modelSwitchListener);
        this.sceneConfigurationUpdate = function(payload) {
            this.forceUpdate();
        }.bind(this);
        dispatcher.register('sceneConfigurationUpdate', this.sceneConfigurationUpdate);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.modelSwitchListener);
        dispatcher.register('paste', this.modelSwitchListener);
        dispatcher.unregister('sceneConfigurationUpdate', this.sceneConfigurationUpdate);
    }
    /**
     * Fired after component DOM update and checks if column size must be updated.
     */
    componentDidUpdate = () => {
        if (this.checkColumnsSize) {
            this.checkColumnsSize = false;
            this.props.checkPanelSize();
        }
    };
    /**
     * Notify other components about internal change.
     */
    distributeUpdate() {
        visualizationBuilder.updateScene();
        dispatcher.dispatch('configurationUpdate', {});
        this.forceUpdate();
    }
    /**
     * Events handling functions for component controls.
     * @param {Object} e not used at the moment
     * @param {Object} titleProps used to detect which title is toggled
     */
    handleToggleObjectSettings = (e: Object, titleProps: Object) => {
        const { index } = titleProps;
        let { openObjectSettings } = this.state;

        if (openObjectSettings.has(index)) {
            openObjectSettings.delete(index);
        } else {
            openObjectSettings.add(index);
        }
        this.setState({ openObjectSettings: openObjectSettings });
        this.checkColumnsSize = true;
    };
    /**
     * Function adds new model into set and ensures that all entities for new model are created.
     */
    handleAddNewObject = () => {
        let modelObjects = sceneObjectDAO.addNewObject();
        this.setState({ modelObjects: modelObjects });
        this.distributeUpdate();
    };
    /**
     * Removes model form set and ensures that all related entities are removed as well.
     * @param {number} objectID removed object ID
     */
    removeObject = (objectID: number) => {
        let modelObjects = sceneObjectDAO.removeObject(objectID);
        this.setState({ modelObjects: modelObjects });
        this.distributeUpdate();
    };
    /**
     * Events handling functions for component controls.
     */
    handleObjectWidthChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setValueForControl('width', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectDepthChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setValueForControl('depth', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectAspectChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setAspect(parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectCenterXChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setValueForControl('centerX', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectCenterYChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setValueForControl('centerY', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectCenterZChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setValueForControl('centerZ', parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectRotateXChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setObjectRotX(parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectRotateYChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setObjectRotY(parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectRotateZChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setObjectRotZ(parseFloat(value));
            this.distributeUpdate();
        }
    };
    handleObjectWidthUnitChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setWidthUnit(parseInt(value, 10));
            this.distributeUpdate();
        }
    };
    handleObjectDepthUnitChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setDepthUnit(parseInt(value, 10));
            this.distributeUpdate();
        }
    };
    handleObjectCenterXUnitChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setCenterXUnit(parseInt(value, 10));
            this.distributeUpdate();
        }
    };
    handleObjectCenterYUnitChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setCenterYUnit(parseInt(value, 10));
            this.distributeUpdate();
        }
    };
    handleObjectCenterZUnitChange = (value: number, objectID: number) => {
        if (value) {
            this.state.modelObjects[objectID].setCenterZUnit(parseInt(value, 10));
            this.distributeUpdate();
        }
    };
    handleObjectTypeChange = (value: number, objectID: number) => {
        this.state.modelObjects[objectID].setObjectType(value);
        this.distributeUpdate();
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { openSettings, toggleSettings, copySettings } = this.props;
        const { modelObjects, openObjectSettings } = this.state;

        const objectView = (objModel, modelID) => (
            <div key={modelID} className="object-item">
                <Accordion.Title active={openObjectSettings.has(modelID)} index={modelID} onClick={this.handleToggleObjectSettings}>
                    <Icon name='dropdown'/><h3>Object Configuration</h3>
                    <Button negative animated compact onClick={this.removeObject} size='mini'>
                        <Button.Content hidden>Delete</Button.Content>
                        <Button.Content visible><Icon name='delete' /></Button.Content>
                    </Button>
                </Accordion.Title>
                <Accordion.Content active={openObjectSettings.has(modelID)}>
                    <div className="option-group-line"><h5>Object size:</h5></div>
                    <div className="option-group-line">
                        <div className="ui mini labeled input">
                            <label className="ui label label">Object Type:</label>
                            <Select compact onChange={(e, data) => this.handleObjectTypeChange(data.value, modelID)}
                                options={objTypeIdxMenu} defaultValue={objModel.getObjectType()} style={{minWidth: '120px'}} />
                        </div>
                    </div>
                    <div className="option-group-line">
                        <Input labelPosition='right' style={{float: 'none', display: 'inline-flex'}} size='mini'>
                            <Label>Width:</Label>
                            <input onChange={(e) => this.handleObjectWidthChange(e.target.value, modelID)}
                                step={SO.getWidthControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getWidthControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getValueForControl('width')} className="short-input"/>
                            <Select compact options={unitDefinitionMenu} onChange={(e, data) => this.handleObjectWidthUnitChange(data.value, modelID)}
                                defaultValue={objModel.getWidthUnit()} />
                        </Input><br/>
                        <Input labelPosition='right' style={{float: 'none', display: 'inline-flex'}} size='mini'>
                            <Label>Depth:</Label>
                            <input onChange={(e) => this.handleObjectDepthChange(e.target.value, modelID)}
                                step={SO.getDepthControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getDepthControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getValueForControl('depth')} className="short-input"/>
                            <Select compact options={unitDefinitionMenu} onChange={(e, data) => this.handleObjectDepthUnitChange(data.value, modelID)}
                                defaultValue={objModel.getDepthUnit()} />
                        </Input><br/>
                        <Input labelPosition='right' style={{float: 'none', display: 'inline-flex'}} size='mini'>
                            <Popup trigger={<Label>Aspect:</Label>}
                                   content='This value is used to determine object height.' inverted />
                            <input onChange={(e) => this.handleObjectAspectChange(e.target.value, modelID)}
                                step={SO.getAspectControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getAspectControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getAspect()} className="short-input right-border"/>
                        </Input>
                    </div>
                    <div className="option-group-line"><h5>Object position:</h5></div>
                    <div className="option-group-line">
                        <Input labelPosition='right' style={{float: 'none', display: 'inline-flex'}} size='mini'>
                            <Label>X:</Label>
                            <input onChange={(e) => this.handleObjectCenterXChange(e.target.value, modelID)}
                                step={SO.getCenterXControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getCenterXControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getValueForControl('centerX')} className="short-input"/>
                            <Select compact options={unitDefinitionMenu} onChange={(e, data) => this.handleObjectCenterXUnitChange(data.value, modelID)}
                                defaultValue={objModel.getCenterXUnit()} />
                        </Input><br/>
                        <Input labelPosition='right' style={{float: 'none', display: 'inline-flex'}} size='mini'>
                            <Label>Y:</Label>
                            <input onChange={(e) => this.handleObjectCenterYChange(e.target.value, modelID)}
                                step={SO.getCenterYControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getCenterYControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getValueForControl('centerY')} className="short-input"/>
                            <Select compact options={unitDefinitionMenu} onChange={(e, data) => this.handleObjectCenterYUnitChange(data.value, modelID)}
                                defaultValue={objModel.getCenterYUnit()} />
                        </Input><br/>
                        <Input labelPosition='right' style={{float: 'none', display: 'inline-flex'}} size='mini'>
                            <Label>Z:</Label>
                            <input onChange={(e) => this.handleObjectCenterZChange(e.target.value, modelID)}
                                step={SO.getCenterZControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getCenterZControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getValueForControl('centerZ')} className="short-input"/>
                            <Select compact options={unitDefinitionMenu} onChange={(e, data) => this.handleObjectCenterZUnitChange(data.value, modelID)}
                                defaultValue={objModel.getCenterZUnit()} />
                        </Input>
                    </div>
                    <div className="option-group-line"><h5>Object rotation:</h5></div>
                    <div className="option-group-line">
                        <Input labelPosition='right' size='mini'>
                            <Label>X x Y x Z:</Label>
                            <input onChange={(e) => this.handleObjectRotateXChange(e.target.value, modelID)}
                                step={SO.getObjectRotXControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getObjectRotXControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getObjectRotX()} className="short-input"/>
                            <input onChange={(e) => this.handleObjectRotateYChange(e.target.value, modelID)}
                                step={SO.getObjectRotYControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getObjectRotYControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getObjectRotY()} className="short-input"/>
                            <input onChange={(e) => this.handleObjectRotateZChange(e.target.value, modelID)}
                                step={SO.getObjectRotZControl(ctlSetLoc.step)}
                                type={inputTypesName[SO.getObjectRotZControl(ctlSetLoc.inputTypes)]}
                                value={objModel.getObjectRotZ()} className="short-input"/>
                            <Label>°</Label>
                        </Input>
                    </div>
                </Accordion.Content>
            </div>
        );
        return (
            <div className="configuration-item" id="scene-configuration-item">
                <Accordion.Title active={openSettings.has(this.TAB_INDEX)} index={this.TAB_INDEX} onClick={toggleSettings}>
                    <Icon name='dropdown' /><h4>Scene Configuration</h4>
                    <Button positive animated compact onClick={(e) => copySettings(e, sceneObjectDAO)} size='mini'>
                        <Button.Content hidden>Copy</Button.Content>
                        <Button.Content visible><Icon name='copy' /></Button.Content>
                    </Button>
                </Accordion.Title>
                <Accordion.Content active={openSettings.has(this.TAB_INDEX)}>
                    <Popup trigger={<Button positive content='Add object' icon='add' labelPosition='right' onClick={this.handleAddNewObject} size='mini'/>}
                           content='Added objects can be also selected and transformed in cameras view.' inverted />
                    <Accordion fluid id="simulation-objects-list">{ modelObjects.map(objectView) }</Accordion>
                </Accordion.Content>
            </div>
        )
    }
}