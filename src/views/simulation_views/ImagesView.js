// @flow
import * as React from 'react'
import { Button } from 'semantic-ui-react'

import visualizationBuilder from '../../services/VisualizationBuilder.js'
import dispatcher from "../../services/Dispatcher";

type Props = {
    width: number,
    height: number,
    activeModelID: number
};
type State = {
    zoom: number
};

/**
 * @classdesc React component with images visualization.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class ImagesView extends React.Component<Props, State> {
    // component constants
    ZOOM_LOWER_LIMIT: number = 20;
    ZOOM_UPPER_LIMIT: number = 550;
    // component variables
    translating: boolean = false;
    trnsStartX: number = 0;
    trnsStartY: number = 0;
    imagesElm: HTMLCanvasElement;
    imagesCanvasCTX: CanvasRenderingContext2D;
    viewUpdateListener: Function;
    pasteListener: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            zoom: 100,
        };
    }
    /**
     * After the component is added the DOM register event listeners and initializes variables
     */
    componentDidMount = () => {
        // $FlowFixMe ignore null
        this.imagesElm = document.getElementById('images-view');
        // $FlowFixMe ignore null
        this.imagesCanvasCTX = this.imagesElm.getContext('2d');
        visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
        // register event listeners
        this.viewUpdateListener = function(payload) {
            visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width,this.props.height);
        }.bind(this);
        this.pasteListener = function(payload) {
            visualizationBuilder.updateActiveModel();
            visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width,this.props.height);
        }.bind(this);
        dispatcher.register('modelSwitch', this.pasteListener);
        dispatcher.register('paste', this.pasteListener);
        dispatcher.register('configurationUpdate', this.viewUpdateListener);
    };
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.pasteListener);
        dispatcher.unregister('paste', this.pasteListener);
        dispatcher.unregister('configurationUpdate', this.viewUpdateListener);
    }
    /**
     * Re-render images visualization after component update.
     */
    componentDidUpdate = () =>{
        visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Zooms in canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomIn = () => {
        if (this.state.zoom < this.ZOOM_UPPER_LIMIT) {
            let trns = visualizationBuilder.getImagesTrns();
            // get event coordinates relative to the canvas
            let rect = this.imagesElm.getBoundingClientRect();
            // apply scaling
            trns.scaleX *= Math.SQRT2;
            trns.scaleY *= Math.SQRT2;
            trns.translateX = (rect.left / 2) * (1 - Math.SQRT2) + trns.translateX * Math.SQRT2;
            trns.translateY = (rect.top / 2) * (1 - Math.SQRT2) + trns.translateY * Math.SQRT2;
            visualizationBuilder.setImagesTrns(trns);
            visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
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
            let trns = visualizationBuilder.getImagesTrns();
            // get event coordinates relative to the canvas
            let rect = this.imagesElm.getBoundingClientRect();
            // apply scaling
            trns.scaleX *= Math.SQRT1_2;
            trns.scaleY *= Math.SQRT1_2;
            trns.translateX = (rect.left / 2) * (1 - Math.SQRT1_2) + trns.translateX * Math.SQRT1_2;
            trns.translateY = (rect.top / 2) * (1 - Math.SQRT1_2) + trns.translateY * Math.SQRT1_2;
            visualizationBuilder.setImagesTrns(trns);
            visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
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
        this.imagesElm.addEventListener('mousemove', this.handleTranslate);
        this.imagesElm.addEventListener('touchmove', this.handleTouchTranslate);
    };
    /**
     * Handles horizontal bar movement.
     * @param {Event} e
     */
    handleTranslate = (e: MouseEvent | Touch) => {
        let trns = visualizationBuilder.getImagesTrns();
        trns.translateX += e.clientX - this.trnsStartX;
        trns.translateY += e.clientY - this.trnsStartY;
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;
        visualizationBuilder.setImagesTrns(trns);
        visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
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
        this.imagesElm.removeEventListener('mousemove', this.handleTranslate);
        this.imagesElm.removeEventListener('touchmove', this.handleTouchTranslate);
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { width, height } = this.props;
        const { zoom } = this.state;

        return (
            <div className="canvas-wrapper" id="images-view-wrapper" style={{width: width, height: height}}>
                <canvas id="images-view" width={width} height={(height - 28)} onMouseDown={this.handleTranslatingStart}
                    onMouseUp={this.handleTranslationEnd} onMouseLeave={this.handleTranslationEnd}
                    onTouchStart={(e) => this.handleTranslatingStart(e.touches[0])}>
                    Your browser does not support HTML5 Canvas. Please try different browser.
                </canvas>
                <div className="view-controls" id="images-view-controls">
                    <strong className="ui">Images composition view:</strong>
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