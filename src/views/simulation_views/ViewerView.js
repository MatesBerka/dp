// @flow
import * as React from 'react'
import { Checkbox, Select, Button } from 'semantic-ui-react'
import visualizationBuilder from '../../services/VisualizationBuilder.js'
import { unitDefinitionMenu, unitIdx } from "../../model/data_collections/UnitsDefinition";
import dispatcher from "../../services/Dispatcher";
import {default as utl} from "../../services/ControlsUtils";

type Props = {
    width: number,
    height: number,
    activeModelID: number
};
type State = {
    drawViewerGrid: boolean;
    viewerSideView: boolean;
    drawReconstructionRays: boolean;
    viewerCanvasUnit: number;
    zoom: number;
};

/**
 * @classdesc React component with viewer visualization.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class ViewerView extends React.Component<Props, State> {
    // component constants
    ZOOM_LOWER_LIMIT: number = 20;
    ZOOM_UPPER_LIMIT: number = 550;

    DRAW_VIEWER_GRID_DEFAULT: number = false;
    VIEWER_SIDE_VIEW_DEFAULT: number = false;
    DRAW_RECONSTRUCTION_RAYS_DEFAULT: number = false;
    VIEWER_CANVAS_UNIT_DEFAULT: number = unitIdx.cm;
    ZOOM_DEFAULT: number = 100;
    // component variables
    translating: boolean = false;
    trnsStartX: number = 0;
    trnsStartY: number = 0;

    viewerElm: HTMLCanvasElement;
    viewerCanvasCTX: CanvasRenderingContext2D;
    viewUpdateListener: Function;
    pasteListener: Function;
    modelSwitch: Function;
    modelDelete: Function;
    getCenterPanelSettingsListener: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            activeModelID: 0,
            models: [{drawViewerGrid: false, viewerSideView: false, drawReconstructionRays: false, viewerCanvasUnit: unitIdx.cm, zoom: 100}],
        };
    }
    /**
     * After the component is added the DOM register event listeners and initializes variables
     */
    componentDidMount = () => {
        // $FlowFixMe ignore null
        this.viewerElm = document.getElementById('viewer-view');
        // $FlowFixMe ignore null
        this.viewerCanvasCTX = this.viewerElm.getContext('2d');

        this.updateVisualization(this.state.activeModelID);
        // register event listeners
        this.viewUpdateListener = function(payload) {
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
        }.bind(this);

        this.pasteListener = function(payload) {
            let models = this.state.models;
            if (payload.hasOwnProperty('viewerViewC')) {
                models[this.state.activeModelID] = payload['viewerViewC'][0];
                visualizationBuilder.setViewerTrns(payload['viewerViewC'][1]);
            }
            visualizationBuilder.updateActiveModel(this.state.activeModelID);
            this.updateVisualization(this.state.activeModelID);
        }.bind(this);

        this.switchListener = function(payload) {
            if (payload.modelID === this.state.models.length) { // new model
                this.state.models.push({
                    drawViewerGrid: this.DRAW_VIEWER_GRID_DEFAULT,
                    viewerSideView: this.VIEWER_SIDE_VIEW_DEFAULT,
                    drawReconstructionRays: this.DRAW_RECONSTRUCTION_RAYS_DEFAULT,
                    viewerCanvasUnit: this.VIEWER_CANVAS_UNIT_DEFAULT,
                    zoom: this.ZOOM_DEFAULT
                })
            }

            this.setState({ activeModelID: payload.modelID });
            visualizationBuilder.updateActiveModel(payload.modelID);
            this.updateVisualization(payload.modelID);
        }.bind(this);

        this.deleteListener = function(payload) {
            this.state.models.splice(payload.modelIDToRemove, 1);
            visualizationBuilder.updateActiveModel(this.state.activeModelID);
            this.updateVisualization(this.state.activeModelID);
        }.bind(this);

        this.exportListener = function(payload) {
            payload['viewerView'] = [this.state.models, this.state.activeModelID, visualizationBuilder.getAllViewerTrns()]
        }.bind(this);

        this.importListener = function(payload) {
            visualizationBuilder.setAllViewerTrns(payload['cameraView'][2], payload['cameraView'][1]);
            this.setState({
                models:  payload['viewerView'][0],
                activeModelID:  payload['viewerView'][1]
            });
            this.forceUpdate();
        }.bind(this);

        this.getCenterPanelSettingsListener = function(payload) {
            payload['viewerViewC'] = [
                Object.assign({}, this.state.models[this.state.activeModelID]),
                Object.assign({}, visualizationBuilder.getViewerTrns())
            ];
        }.bind(this);

        dispatcher.register('getCenterPanelSettings', this.getCenterPanelSettingsListener);
        dispatcher.register('exporting', this.exportListener);
        dispatcher.register('importing', this.importListener);
        dispatcher.register('modelDelete', this.deleteListener);
        dispatcher.register('modelSwitch', this.switchListener);
        dispatcher.register('paste', this.pasteListener);
        dispatcher.register('configurationUpdate', this.viewUpdateListener);
    };
    /**
     * After the component is removed from the DOM un-register listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('getCenterPanelSettings', this.getCenterPanelSettingsListener);
        dispatcher.unregister('exporting', this.exportListener);
        dispatcher.unregister('importing', this.importListener);
        dispatcher.unregister('modelDelete', this.deleteListener);
        dispatcher.unregister('modelSwitch', this.switchListener);
        dispatcher.unregister('paste', this.pasteListener);
        dispatcher.unregister('configurationUpdate', this.viewUpdateListener);
    }
    /**
     * Re-render viewer visualization after component update.
     */
    componentDidUpdate = () => {
        visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Function updates visualization state and re-renders the view.
     */
    updateVisualization = (activeModelID: number) => {
        let activeModel = this.state.models[activeModelID];
        visualizationBuilder.setViewerViewConfiguration(activeModel.drawViewerGrid, activeModel.viewerSideView,
            activeModel.drawReconstructionRays, activeModel.viewerCanvasUnit);
        visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Events handling functions for canvas controls.
     */
    handleGridToggle = (e: Object, data: Object) => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.drawViewerGrid = data.checked;
        this.updateVisualization(this.state.activeModelID);
        this.forceUpdate();
    };
    handleSideViewToggle = (e: Object, data: Object) => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.viewerSideView = data.checked;
        this.updateVisualization(this.state.activeModelID);
        this.forceUpdate();
    };
    handleReconstructionRaysToggle = (e: Object, data: Object) => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.drawReconstructionRays = data.checked;
        this.updateVisualization(this.state.activeModelID);
        this.forceUpdate();
    };
    handleCanvasUnitChange = (e: Object, data: Object) => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.viewerCanvasUnit = data.value;
        this.updateVisualization(this.state.activeModelID);
        this.forceUpdate();
    };
    /**
     * Zooms in canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomIn = () => {
        let activeModel = this.state.models[this.state.activeModelID];
        if (activeModel.zoom < this.ZOOM_UPPER_LIMIT) {
            let trns = visualizationBuilder.getViewerTrns();
            // apply scaling
            trns.scaleX *= utl.SQRT2;
            trns.scaleY *= utl.SQRT2;
            trns.translateX = (this.viewerElm.offsetWidth / 2) * (1 - utl.SQRT2) + trns.translateX * utl.SQRT2;
            trns.translateY = (this.viewerElm.offsetHeight / 2) * (1 - utl.SQRT2) + trns.translateY * utl.SQRT2;
            visualizationBuilder.setViewerTrns(trns);
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
            activeModel.zoom *= utl.SQRT2;
            this.forceUpdate();
        }
    };
    /**
     * Zooms out canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomOut = () => {
        let activeModel = this.state.models[this.state.activeModelID];
        if (activeModel.zoom > this.ZOOM_LOWER_LIMIT) {
            let trns = visualizationBuilder.getViewerTrns();
            // apply scaling
            trns.scaleX *= utl.SQRT1_2;
            trns.scaleY *= utl.SQRT1_2;
            trns.translateX = (this.viewerElm.offsetWidth / 2) * (1 - utl.SQRT1_2) + trns.translateX * utl.SQRT1_2;
            trns.translateY = (this.viewerElm.offsetHeight / 2) * (1 - utl.SQRT1_2) + trns.translateY * utl.SQRT1_2;
            visualizationBuilder.setViewerTrns(trns);
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
            activeModel.zoom *= utl.SQRT1_2;
            this.forceUpdate();
        }
    };
    /**
     * Registers event listeners for canvas translation.
     * @param {Event} e
     */
    handleTranslatingStart = (e: MouseEvent | Touch) => {
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;
        this.viewerElm.addEventListener('mousemove', this.handleTranslate);
        this.viewerElm.addEventListener('touchmove', this.handleTouchTranslate);
    };
    /**
     * Handles horizontal bar movement.
     * @param {Event} e
     */
    handleTranslate = (e: MouseEvent | Touch) => {
        let trns = visualizationBuilder.getViewerTrns();
        trns.translateX += e.clientX - this.trnsStartX;
        trns.translateY += e.clientY - this.trnsStartY;
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;
        visualizationBuilder.setViewerTrns(trns);
        visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Converts Touch event to Mouse event.
     * @param {Event} e
     */
    handleTouchTranslate = (e: TouchEvent) => {
        this.handleTranslate(e.touches[0]);
    };
    /**
     * Unregisters event listeners for canvas translation.
     */
    handleTranslationEnd = () => {
        this.viewerElm.removeEventListener('mousemove', this.handleTranslate);
        this.viewerElm.removeEventListener('touchmove', this.handleTouchTranslate);
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { width, height } = this.props;
        const activeModel = this.state.models[this.state.activeModelID];

        return (
            <div className="canvas-wrapper" id="viewer-view-wrapper" style={{width: width, height: height}}>
                <canvas id="viewer-view" width={width} height={(height - 28)} onMouseDown={this.handleTranslatingStart}
                    onMouseUp={this.handleTranslationEnd} onMouseLeave={this.handleTranslationEnd}
                    onTouchStart={(e) => {e.preventDefault();this.handleTranslatingStart(e.touches[0])}}>
                    Your browser does not support HTML5 Canvas. Please try different browser.
                </canvas>
                <div className="view-controls" id="viewer-view-controls">
                    <strong className="ui">Viewer view </strong>
                    <Checkbox label='Grid' onChange={this.handleGridToggle} checked={activeModel.drawViewerGrid}/>
                    <Checkbox label='Side view' onChange={this.handleSideViewToggle} checked={activeModel.viewerSideView}/>
                    <Checkbox label='Show rays' onChange={this.handleReconstructionRaysToggle} checked={activeModel.drawReconstructionRays}/>
                    <Select compact options={unitDefinitionMenu} onChange={this.handleCanvasUnitChange} value={activeModel.viewerCanvasUnit}/>
                    Zoom: {Math.round(activeModel.zoom)}%
                </div>
                <Button.Group basic size='mini' className="zoom-controls">>
                    <Button icon='plus' onClick={this.handleZoomIn}/>
                    <Button icon='minus' onClick={this.handleZoomOut}/>
                </Button.Group>
            </div>
        )
    }
}