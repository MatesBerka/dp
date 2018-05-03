// @flow
import * as React from 'react';
import { Button, Icon, Modal, Popup, Header } from 'semantic-ui-react'

import DiagnosticsView from './DiagnosticsView';
import dispatcher from '../services/Dispatcher'
import visualizationBuilder from "../services/VisualizationBuilder";
import CameraView from "./simulation_views/CameraView";
import ImagesView from "./simulation_views/ImagesView";
import ViewerView from "./simulation_views/ViewerView";
import registry from '../services/RegistryService'

type Props = {
    centerPanelWidth: number,
    centerPanelHeight: number
};

type State = {
    modalAddModelIsOpen: boolean,
    modalRemoveModelIsOpen: boolean,
    modalRenameModelIsOpen: boolean,
    modelIDToRemove: number,
    models: Array<{name: string, imagesViewWidthRatio: number, viewerViewHeightRatio: number}>,
    activeModelID: number,
    renameModelID: number,
    renameModelName: string,

    simulationViewsHeight: number,
    centerPanelHeight: number,
    centerPanelWidth: number,
    imagesViewWidth: number,
    imagesViewHeight: number,
    cameraViewWidth: number,
    cameraViewHeight: number,
    viewerViewWidth: number,
    viewerViewHeight: number
};

/**
 * @classdesc React component center panel contains all simulation views and diagnostics.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class CenterPanel extends React.Component<Props, State> {
    // component constants
    NAVIGATION_HEIGHT: number = 0;
    CAN_MIN_EDGE_SIZE: number = 70;
    SIM_VIEWS_MIN_HEIGHT: number = 40;

    // component variables
    exportListener: Function;
    importListener: Function;
    pasteListener: Function;
    getCenterPanelSettingsListener: Function;
    getImageViewDefaultYCoord: Function;
    getImageViewDefaultXCoord: Function;
    body: HTMLElement;
    diagnosticsElm: HTMLElement;
    simulationsViewElm: HTMLElement;
    verticalBarStartX: number = 0;
    horizontalBarStartY: number = 0;
    orgImagesViewWidthRatio: number = 0.3;
    orgViewerViewHeightRatio: number = 0.4;
    renameTouchCounter: number = 0; // this is a helper value used to determine if double tab was triggered
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            modalAddModelIsOpen: false,
            modalRemoveModelIsOpen: false,
            modalRenameModelIsOpen: false,
            modelIDToRemove: -1,
            activeModelID: 0,
            renameModelID: 0,
            renameModelName: '',
            simulationViewsHeight: 0,
            centerPanelHeight: 0,
            centerPanelWidth: 0,
            imagesViewWidth: 100,
            imagesViewHeight: 100,
            cameraViewWidth: 100,
            cameraViewHeight: 100,
            viewerViewWidth: 100,
            viewerViewHeight: 100,
            models: [{
                name: 'default',
                imagesViewWidthRatio: 0.3,
                viewerViewHeightRatio: 0.4
            }],
        };
    }
    /**
     * After the component is added the DOM register event listeners and initializes variables.
     */
    componentDidMount = () => {
        // $FlowFixMe ignore null
        this.diagnosticsElm = document.getElementById('diagnostics');
        // $FlowFixMe ignore null
        this.simulationsViewElm = document.getElementById('simulation-views');
        // $FlowFixMe ignore null
        this.body = document.body;
        // $FlowFixMe ignore null
        this.NAVIGATION_HEIGHT = document.getElementById('center-panel-navigation').offsetHeight + document.getElementById('simulation-header').offsetHeight;
        this.setState({
            centerPanelWidth: this.props.centerPanelWidth,
            centerPanelHeight: this.props.centerPanelHeight
        });

        this.updateViewsSize(this.state.activeModelID);
        // These callbacks are used when new model is created.
        this.getImageViewDefaultXCoord = function() {
            return Math.floor(this.props.centerPanelWidth * this.state.models[this.state.activeModelID].imagesViewWidthRatio) / 2;
        }.bind(this);
        this.getImageViewDefaultYCoord = function() {
            return  Math.floor((this.props.centerPanelHeight - this.diagnosticsElm.clientHeight - this.NAVIGATION_HEIGHT)
                * (1 - this.state.models[this.state.activeModelID].viewerViewHeightRatio)) /2;
        }.bind(this);
        visualizationBuilder.registerImageTranslationGenerators(this.getImageViewDefaultXCoord, this.getImageViewDefaultYCoord);
        // center images composition view at the beginning
        let trns = visualizationBuilder.getImagesTrns();
        trns.translateX = this.getImageViewDefaultXCoord();
        trns.translateY = this.getImageViewDefaultYCoord();
        visualizationBuilder.setImagesTrns(trns);

        // register event listeners
        this.exportListener = function(payload) {
            payload['centerPanel'] = [this.state.models, this.state.activeModelID]
        }.bind(this);

        this.importListener = function(payload) {
            this.setState({
                activeModelID:  payload['centerPanel'][1],
                models:  payload['centerPanel'][0],
            });
        }.bind(this);

        this.getCenterPanelSettingsListener = function(payload) {
            payload['centerPanelC'] = Object.assign({}, this.state.models[this.state.activeModelID]);
        }.bind(this);

        this.pasteListener = function(payload) {
            let models = this.state.models;
            if (payload.hasOwnProperty('centerPanelC')) {
                let name = models[this.state.activeModelID].name; // keep model name
                models[this.state.activeModelID] = Object.assign({}, payload['centerPanelC']);
                models[this.state.activeModelID].name = name;
                this.updateViewsSize(this.state.activeModelID);
            }
        }.bind(this);

        dispatcher.register('getCenterPanelSettings', this.getCenterPanelSettingsListener);
        dispatcher.register('paste', this.pasteListener);
        dispatcher.register('exporting', this.exportListener);
        dispatcher.register('importing', this.importListener);
    };
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('getCenterPanelSettings', this.getCenterPanelSettingsListener);
        dispatcher.unregister('paste', this.pasteListener);
        dispatcher.unregister('exporting', this.exportListener);
        dispatcher.unregister('importing', this.importListener);
    };
    /**
     * If component updates check component size
     */
    componentDidUpdate() {
        this.updatePanelsSize();
    }
    /**
     * If window size changes update also component size.
     */
    updateViewsSize = (activeModelID: number) => {
        let activeModel = this.state.models[activeModelID];
        let simulationViewsHeight = this.props.centerPanelHeight - this.diagnosticsElm.clientHeight - this.NAVIGATION_HEIGHT,
            newViewerViewHeight = Math.floor(simulationViewsHeight * activeModel.viewerViewHeightRatio),
            newImagesViewWidth = Math.floor(this.props.centerPanelWidth * activeModel.imagesViewWidthRatio),
            newCameraViewWidth = this.props.centerPanelWidth - newImagesViewWidth,
            newCameraHeight = simulationViewsHeight - newViewerViewHeight;

        if (newViewerViewHeight < this.CAN_MIN_EDGE_SIZE) {
            newViewerViewHeight = this.CAN_MIN_EDGE_SIZE;
            newCameraHeight = simulationViewsHeight - this.CAN_MIN_EDGE_SIZE;
        } else if (newCameraHeight < this.CAN_MIN_EDGE_SIZE) {
            newViewerViewHeight = simulationViewsHeight - this.CAN_MIN_EDGE_SIZE;
            newCameraHeight = this.CAN_MIN_EDGE_SIZE;
        }

        if (newImagesViewWidth < this.CAN_MIN_EDGE_SIZE) {
            newImagesViewWidth = this.CAN_MIN_EDGE_SIZE;
            newCameraViewWidth = this.props.centerPanelWidth - this.CAN_MIN_EDGE_SIZE;
        } else if (newCameraViewWidth < this.CAN_MIN_EDGE_SIZE) {
            newImagesViewWidth = this.props.centerPanelWidth - this.CAN_MIN_EDGE_SIZE;
            newCameraViewWidth = this.CAN_MIN_EDGE_SIZE;
        }

        this.setState({
            viewerViewWidth: this.props.centerPanelWidth,
            imagesViewWidth: newImagesViewWidth,
            cameraViewWidth: newCameraViewWidth,
            viewerViewHeight: newViewerViewHeight,
            cameraViewHeight: newCameraHeight,
            imagesViewHeight: newCameraHeight,
            simulationViewsHeight: simulationViewsHeight
        });
    };
    /**
     * If window size changes update also component size. Triggered during component update.
     */
    updatePanelsSize = () => {
        let centerPanelHeight = this.props.centerPanelHeight,
            centerPanelWidth = this.props.centerPanelWidth;
        if (this.state.centerPanelHeight !== centerPanelHeight || this.state.centerPanelWidth !== centerPanelWidth) {
            this.setState({
                centerPanelHeight: centerPanelHeight,
                centerPanelWidth: centerPanelWidth
            });
            this.updateViewsSize(this.state.activeModelID);
        }
    };
    /**
     * Switch to new active model a distribute the event.
     */
    static _setNewActiveModel(modelID: number) {
        registry.getAll().forEach(function(value) {
            value.setActiveRecord(modelID);
        });
    }
    /**
     * Opens warning window which ensures that you really want to delete selected model.
     */
    handleOpenDeleteModel = (e: MouseEvent, modelID: number) => {
        this.setState({ modalRemoveModelIsOpen: true, modelIDToRemove: modelID });
        e.stopPropagation();
    };
    /**
     * Close warning window which ensures that you really want to delete selected model.
     */
    handleCloseDeleteModel = () => this.setState({ modalRemoveModelIsOpen: false });
    /**
     * Deletes selected model.
     */
    handleDeleteModel = () => {
        let newActiveModelID = this.state.activeModelID;
        if (newActiveModelID === this.state.modelIDToRemove) {
            let defaultActiveModel = 0;
            CenterPanel._setNewActiveModel(defaultActiveModel);
            this.setState({ modalRemoveModelIsOpen: false, activeModelID: defaultActiveModel });
            this.updateViewsSize(defaultActiveModel);
            // first switch to temporary model
            dispatcher.dispatch('modelSwitch', {modelID: defaultActiveModel});
        } else {
            if (newActiveModelID > this.state.modelIDToRemove) {
                newActiveModelID--;
                CenterPanel._setNewActiveModel(newActiveModelID);
                this.setState({
                    modalRemoveModelIsOpen: false,
                    activeModelID: newActiveModelID
                });
                // first switch to temporary model
                dispatcher.dispatch('modelSwitch', {modelID: newActiveModelID});
            } else {
                this.setState({ modalRemoveModelIsOpen: false });
            }
        }

        registry.getAll().forEach(function(value) {
            value.removeRecord(this.state.modelIDToRemove);
        }.bind(this));
        this.state.models.splice(this.state.modelIDToRemove, 1);
        dispatcher.dispatch('modelDelete', {modelIDToRemove: this.state.modelIDToRemove});
        dispatcher.dispatch('modelSwitch', {modelID: newActiveModelID});
    };
    /* Open modal window for adding new model */
    handleAddModelOpen = () => this.setState({ modalAddModelIsOpen: true });
    /* Close modal window for adding new model */
    handleAddModelClose = () => this.setState({ modalAddModelIsOpen: false });
    /**
     * Adds entered model.
     */
    handleAddNewModel = () => {
        // $FlowFixMe ignore null
        let modelName = document.getElementById('new-model-name').value;
        let newModelID = this.state.models.length;
        this.state.models.push({
            name: modelName,
            imagesViewWidthRatio: 0.3,
            viewerViewHeightRatio: 0.4
        });

        registry.getAll().forEach(function(value) {
            value.addNewRecord();
        });

        this.setState({ activeModelID: newModelID });
        CenterPanel._setNewActiveModel(newModelID);
        this.updateViewsSize(newModelID);
        dispatcher.dispatch('modelSwitch', {modelID: newModelID});
        this.handleAddModelClose();
    };
    /**
     * Switch to new active model.
     */
    handleOpenModel = (e: MouseEvent | Touch, modelID: number) => {
        this.setState({ activeModelID: modelID });
        CenterPanel._setNewActiveModel(modelID);
        this.updateViewsSize(modelID);
        dispatcher.dispatch('modelSwitch', {modelID: modelID});
    };
    /**
     * Helper function used to create double tap on mobile devices.
     */
    handleTouchRenameModelOpen = (modelID: number) => {
        this.renameTouchCounter++;
        if (this.renameTouchCounter >= 2) { // only if it is double touch
            this.handleRenameModelOpen(modelID);
        }
        setTimeout(function(){ this.renameTouchCounter--; }.bind(this), 500);
    };
    /**
     * Function opens Rename model modal.
     */
    handleRenameModelOpen = (modelID: number) => {
        this.setState((prev) => ({
            renameModelID: modelID,
            renameModelName: prev.models[modelID].name,
            modalRenameModelIsOpen: true,
        }));
    };
    /**
     * Function updates scene name.
     */
    handleRenameModel = () => {
        // $FlowFixMe ignore null
        let newName = document.getElementById('model-rename').value;
        let models = this.state.models;
        models[this.state.renameModelID].name = newName;
        this.setState({ modalRenameModelIsOpen: false });
    };
    /**
     * Function closes Rename scene modal.
     */
    handleRenameModelClose = () => {
        this.setState({ modalRenameModelIsOpen: false });
    };
    /**
     * Registers event listeners for vertical bar movement and setups used variables.
     * @param {Event} e
     */
    handleVerticalBarMoveStart = (e: MouseEvent | Touch) => {
        // NOTE: here we use state directly because we not there will be no update in the DOM
        this.verticalBarStartX = e.clientX;
        this.orgImagesViewWidthRatio = this.state.models[this.state.activeModelID].imagesViewWidthRatio;
        this.body.addEventListener('mousemove', this.handleVerticalBarMove, window.passiveEventListener);
        this.body.addEventListener('touchmove', this.handleVerticalBarTouchMove, window.passiveEventListener);
        this.body.addEventListener('mouseup', this.handleVerticalBarMoveEnd);
        this.body.addEventListener('touchend', this.handleVerticalBarMoveEnd, window.passiveEventListener);
        this.simulationsViewElm.addEventListener('mouseleave', this.handleVerticalBarMoveEnd, window.passiveEventListener);
    };
    /**
     * Handles vertical bar movement.
     * @param {Event} e
     */
    handleVerticalBarMove = (e: MouseEvent | Touch) => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.imagesViewWidthRatio = (this.orgImagesViewWidthRatio + (((this.verticalBarStartX - e.clientX) / (this.state.centerPanelWidth/100))/100));
        this.updateViewsSize(this.state.activeModelID);
    };
    /**
     * Converts Touch event to Mouse event.
     * @param {Event} e
     */
    handleVerticalBarTouchMove = (e: TouchEvent) => {
        this.handleVerticalBarMove(e.touches[0]);
    };
    /**
     * Unregisters event listeners for vertical bar movement and updates state.
     */
    handleVerticalBarMoveEnd = () => {
        this.orgImagesViewWidthRatio = this.state.models[this.state.activeModelID].imagesViewWidthRatio;
        this.body.removeEventListener('mousemove', this.handleVerticalBarMove, window.passiveEventListener);
        this.body.removeEventListener('touchmove', this.handleVerticalBarTouchMove, window.passiveEventListener);
        this.body.removeEventListener('mouseup', this.handleVerticalBarMoveEnd, window.passiveEventListener);
        this.body.removeEventListener('touchend', this.handleVerticalBarMoveEnd, window.passiveEventListener);
        this.simulationsViewElm.removeEventListener('mouseleave', this.handleVerticalBarMoveEnd, window.passiveEventListener);
    };
    /**
     * Registers event listeners for horizontal bar movement and setups used variables.
     * @param {Event} e
     */
    handleHorizontalBarMoveStart = (e: MouseEvent | Touch) => {
        this.horizontalBarStartY = e.clientY;
        this.orgViewerViewHeightRatio = this.state.models[this.state.activeModelID].viewerViewHeightRatio;
        this.body.addEventListener('mousemove', this.handleHorizontalBarMove, window.passiveEventListener);
        this.body.addEventListener('touchmove', this.handleHorizontalBarTouchMove, window.passiveEventListener);
        this.body.addEventListener('mouseup', this.handleHorizontalBarMoveEnd, window.passiveEventListener);
        this.body.addEventListener('touchend', this.handleHorizontalBarMoveEnd, window.passiveEventListener);
        this.simulationsViewElm.addEventListener('mouseleave', this.handleHorizontalBarMoveEnd, window.passiveEventListener);
    };
    /**
     * Handles horizontal bar movement.
     * @param {Event} e
     */
    handleHorizontalBarMove = (e: MouseEvent | Touch) => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.viewerViewHeightRatio = this.orgViewerViewHeightRatio + (((this.horizontalBarStartY - e.clientY) / (this.state.simulationViewsHeight/100))/100);
        this.updateViewsSize(this.state.activeModelID);
    };
    /**
     * Converts Touch event to Mouse event.
     * @param {Event} e
     */
    handleHorizontalBarTouchMove = (e: TouchEvent) => {
        this.handleHorizontalBarMove(e.touches[0]);
    };
    /**
     * Unregisters event listeners for horizontal bar movement and updates state.
     */
    handleHorizontalBarMoveEnd = () => {
        this.orgViewerViewHeightRatio = this.state.models[this.state.activeModelID].viewerViewHeightRatio;
        this.body.removeEventListener('mousemove', this.handleHorizontalBarMove, window.passiveEventListener);
        this.body.removeEventListener('touchmove', this.handleHorizontalBarTouchMove, window.passiveEventListener);
        this.body.removeEventListener('mouseup', this.handleHorizontalBarMoveEnd, window.passiveEventListener);
        this.body.removeEventListener('touchend', this.handleHorizontalBarMoveEnd, window.passiveEventListener);
        this.simulationsViewElm.removeEventListener('mouseleave', this.handleHorizontalBarMoveEnd, window.passiveEventListener);
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { models, activeModelID, imagesViewWidth, imagesViewHeight, cameraViewWidth, cameraViewHeight, viewerViewWidth, viewerViewHeight } = this.state;

        const modelTabs = (model, index) => (
            <span onClick={(e) => this.handleOpenModel(e, index)} key={index}
                className={((activeModelID === index) ? 'view-model-item active' : 'view-model-item')}
                onDoubleClick={() => this.handleRenameModelOpen(index)}
                onTouchStart={() => this.handleTouchRenameModelOpen(index)}>
                <h3 className="noselect">{model.name}</h3>
                <Icon name='remove' onClick={(e) => this.handleOpenDeleteModel(e, index)}/>
            </span>
        );

        const modelSingleTab = (model, index) => (
            <span onClick={(e) => this.handleOpenModel(e, index)} key={index}
                className={((activeModelID === index) ? 'view-model-item active' : 'view-model-item')}
                onDoubleClick={() => this.handleRenameModelOpen(index)}
                onTouchStart={() => this.handleTouchRenameModelOpen(index)}>
                <h3 className="noselect">{model.name}</h3>
            </span>
        );

        return (
            <div id="center-panel">
                <nav id="center-panel-navigation">
                    { ((models.length === 1) ? models.map(modelSingleTab) : models.map(modelTabs)) }
                    <Modal basic size='small' open={this.state.modalRemoveModelIsOpen}>
                        <Header icon='warning sign' content='Deleting scene' />
                        <Modal.Content>
                            <p>Are you sure you want to remove this scene?</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='green' inverted onClick={this.handleDeleteModel}><Icon name='checkmark'/>Yes</Button>
                            <Button color='red' inverted onClick={this.handleCloseDeleteModel}><Icon name='delete'/>No</Button>
                        </Modal.Actions>
                    </Modal>
                    <Popup trigger={<Button circular positive icon='add' onClick={this.handleAddModelOpen} size='mini'/>}
                           content='Add new scene.' inverted />
                    <Modal open={this.state.modalAddModelIsOpen} onClose={this.handleAddModelClose} size='small'>
                        <Modal.Header>Add new scene</Modal.Header>
                        <Modal.Content>
                            <div className="ui labeled input">
                                <Popup trigger={<label className="ui label label">Scene name:</label>}
                                       content='Choose a name that will help you distinguish your tabs and experiments.' inverted />
                                <input placeholder='some name' id="new-model-name"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={this.handleAddModelClose}>Close</Button>
                            <Button color='green' onClick={this.handleAddNewModel}>Add</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal open={this.state.modalRenameModelIsOpen} onClose={this.handleRenameModelClose} size='small'>
                        <Modal.Header>Rename scene</Modal.Header>
                        <Modal.Content>
                            <div className="ui labeled input">
                                <label className="ui label label">Scene name:</label>
                                <input placeholder='some name' id="model-rename" defaultValue={this.state.renameModelName}/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={this.handleRenameModelClose}>Close</Button>
                            <Button color='green' onClick={this.handleRenameModel}>Rename</Button>
                        </Modal.Actions>
                    </Modal>
                </nav>
                <div id="simulation-views">
                    <CameraView width={cameraViewWidth - 20} height={cameraViewHeight} activeModelID={activeModelID}/>
                    <div className="views-bar" style={{height: cameraViewHeight, lineHeight: cameraViewHeight + 'px'}}
                         onMouseDown={this.handleVerticalBarMoveStart}
                         onTouchStart={(e) => {e.preventDefault();this.handleVerticalBarMoveStart(e.touches[0])}}
                         id="views-vertical-bar"><Icon name='ellipsis vertical'/></div>
                    <ImagesView width={imagesViewWidth} height={imagesViewHeight} activeModelID={activeModelID}/>
                    <div className="views-bar" style={{width: viewerViewWidth}}
                         onMouseDown={this.handleHorizontalBarMoveStart}
                         onTouchStart={(e) => {e.preventDefault();this.handleHorizontalBarMoveStart(e.touches[0])}}
                         id="views-horizontal-bar"><Icon name='ellipsis horizontal'/></div>
                    <ViewerView width={viewerViewWidth} height={viewerViewHeight - 20} activeModelID={activeModelID}/>
                </div>
                <DiagnosticsView centerPanelWidth={this.props.centerPanelWidth} updateViewsSize={this.updateViewsSize}/>
            </div>
        )
    }
}