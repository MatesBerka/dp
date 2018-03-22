// @flow
import * as React from 'react'
import { Checkbox, Select, Button } from 'semantic-ui-react'
import visualizationBuilder from '../../services/VisualizationBuilder.js'
import { unitDefinitionMenu, unitIdx } from "../../model/data_collections/UnitsDefinition";
import dispatcher from "../../services/Dispatcher";

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
    // component variables
    translating: boolean = false;
    trnsStartX: number = 0;
    trnsStartY: number = 0;

    viewerElm: HTMLCanvasElement;
    viewerCanvasCTX: CanvasRenderingContext2D;
    viewUpdateListener: Function;
    pasteListener: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            drawViewerGrid: false,
            viewerSideView: false,
            drawReconstructionRays: false,
            viewerCanvasUnit: unitIdx.cm,
            zoom: 100
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

        this.updateVisualization(this.state.drawViewerGrid, this.state.viewerSideView, this.state.drawReconstructionRays,
            this.state.viewerCanvasUnit, this.viewerCanvasCTX);
        // register event listeners
        this.viewUpdateListener = function(payload) {
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
        }.bind(this);
        this.pasteListener = function(payload) {
            visualizationBuilder.updateActiveModel();
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
        }.bind(this);
        dispatcher.register('modelSwitch', this.pasteListener);
        dispatcher.register('paste', this.pasteListener);
        dispatcher.register('configurationUpdate', this.viewUpdateListener);
    };
    /**
     * After the component is removed from the DOM un-register listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.pasteListener);
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
    updateVisualization = (grid: boolean, sideView: boolean, reconstructionRays: boolean, unit: number,
        ctx: CanvasRenderingContext2D) => {
        visualizationBuilder.setViewerViewConfiguration(grid, sideView, reconstructionRays, unit);
        visualizationBuilder.renderViewerVisualization(ctx, this.props.width, this.props.height);
    };
    /**
     * Events handling functions for canvas controls.
     */
    handleGridToggle = (e: Object, data: Object) => {
         this.setState({ drawViewerGrid: data.checked });
        this.updateVisualization(data.checked, this.state.viewerSideView, this.state.drawReconstructionRays,
            this.state.viewerCanvasUnit, this.viewerCanvasCTX);
    };
    handleSideViewToggle = (e: Object, data: Object) => {
        this.setState({ viewerSideView: data.checked });
        this.updateVisualization(this.state.drawViewerGrid, data.checked, this.state.drawReconstructionRays,
            this.state.viewerCanvasUnit, this.viewerCanvasCTX);
    };
    handleReconstructionRaysToggle = (e: Object, data: Object) => {
        this.setState({ drawReconstructionRays: data.checked });
        this.updateVisualization(this.state.drawViewerGrid, this.state.viewerSideView, data.checked,
            this.state.viewerCanvasUnit, this.viewerCanvasCTX);
    };
    handleCanvasUnitChange = (e: Object, data: Object) => {
        this.setState({ viewerCanvasUnit: data.value });
        this.updateVisualization(this.state.drawViewerGrid, this.state.viewerSideView, this.state.drawReconstructionRays,
            data.value, this.viewerCanvasCTX);
    };
    /**
     * Zooms in canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomIn = () => {
        if (this.state.zoom < this.ZOOM_UPPER_LIMIT) {
            let trns = visualizationBuilder.getViewerTrns();
            // get event coordinates relative to the canvas
            let rect = this.viewerElm.getBoundingClientRect();
            // apply scaling
            trns.scaleX *= Math.SQRT2;
            trns.scaleY *= Math.SQRT2;
            trns.translateX = (rect.left / 2) * (1 - Math.SQRT2) + trns.translateX * Math.SQRT2;
            trns.translateY = (rect.top / 2) * (1 - Math.SQRT2) + trns.translateY * Math.SQRT2;
            visualizationBuilder.setViewerTrns(trns);
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
            this.setState((prevState) => {
                return {zoom: prevState.zoom * Math.SQRT2}
            });
        }
    };
    /**
     * Zooms out canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomOut = () => {
        if (this.state.zoom > this.ZOOM_LOWER_LIMIT) {
            let trns = visualizationBuilder.getViewerTrns();
            // get event coordinates relative to the canvas
            let rect = this.viewerElm.getBoundingClientRect();
            // apply scaling
            trns.scaleX *= Math.SQRT1_2;
            trns.scaleY *= Math.SQRT1_2;
            trns.translateX = (rect.left / 2) * (1 - Math.SQRT1_2) + trns.translateX * Math.SQRT1_2;
            trns.translateY = (rect.top / 2) * (1 - Math.SQRT1_2) + trns.translateY * Math.SQRT1_2;
            visualizationBuilder.setViewerTrns(trns);
            visualizationBuilder.renderViewerVisualization(this.viewerCanvasCTX, this.props.width, this.props.height);
            this.setState((prevState) => {
                return {zoom: prevState.zoom * Math.SQRT1_2}
            });
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
        const { drawViewerGrid, viewerSideView, viewerCanvasUnit, drawReconstructionRays, zoom } = this.state;

        return (
            <div className="canvas-wrapper" id="viewer-view-wrapper" style={{width: width, height: height}}>
                <canvas id="viewer-view" width={width} height={(height - 28)} onMouseDown={this.handleTranslatingStart}
                    onMouseUp={this.handleTranslationEnd} onMouseLeave={this.handleTranslationEnd}
                    onTouchStart={(e) => this.handleTranslatingStart(e.touches[0])}>
                    Your browser does not support HTML5 Canvas. Please try different browser.
                </canvas>
                <div className="view-controls" id="viewer-view-controls">
                    <strong className="ui">Viewer view: </strong>
                    <Checkbox label='Grid' onChange={this.handleGridToggle} checked={drawViewerGrid}/>
                    <Checkbox label='Side view' onChange={this.handleSideViewToggle} checked={viewerSideView}/>
                    <Checkbox label='Show rays' onChange={this.handleReconstructionRaysToggle} checked={drawReconstructionRays}/>
                    <Select compact options={unitDefinitionMenu} onChange={this.handleCanvasUnitChange} defaultValue={viewerCanvasUnit}/>
                    Zoom: {Math.round(zoom)}%
                </div>
                <Button.Group basic size='mini' className="zoom-controls">>
                    <Button icon='plus' onClick={this.handleZoomIn}/>
                    <Button icon='minus' onClick={this.handleZoomOut}/>
                </Button.Group>
            </div>
        )
    }
}