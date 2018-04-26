// @flow
import * as React from 'react'
import { Button } from 'semantic-ui-react'

import visualizationBuilder from '../../services/VisualizationBuilder.js'
import dispatcher from "../../services/Dispatcher";
import {default as utl} from "../../services/ControlsUtils";

type Props = {
    width: number,
    height: number,
    activeModelID: number
};
type State = {
    activeModelID: number;
    models: Array<{zoom: number}>;
};

/**
 * @classdesc React component with images visualization.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class ImagesView extends React.Component<Props, State> {
    // component constants
    CONTROLS_PANEL_HEIGHT: number = 28;

    ZOOM_DEFAULT: number = 100;
    // component variables
    translating: boolean = false;
    trnsStartX: number = 0;
    trnsStartY: number = 0;
    imagesElm: HTMLCanvasElement;
    imagesCanvasCTX: CanvasRenderingContext2D;
    viewUpdateListener: Function;
    pasteListener: Function;
    switchListener: Function;
    deleteListener: Function;
    exportListener: Function;
    importListener: Function;
    getCenterPanelSettingsListener: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            activeModelID: 0,
            models: [{zoom: 100}],
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
            let models = this.state.models;
            if (payload.hasOwnProperty('imagesViewC')) {
                models[this.state.activeModelID] = Object.assign({}, payload['imagesViewC'][0]);
                visualizationBuilder.setImagesTrns(Object.assign({}, payload['imagesViewC'][1]));
            }
            visualizationBuilder.updateActiveModel(this.state.activeModelID);
            visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width,this.props.height);
        }.bind(this);

        this.switchListener = function(payload) {
            if (payload.modelID === this.state.models.length) { // new model
                this.state.models.push({
                    zoom: this.ZOOM_DEFAULT
                })
            }
            this.setState({ activeModelID: payload.modelID });
            visualizationBuilder.updateActiveModel(payload.modelID);
            visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width,this.props.height);
        }.bind(this);

        this.deleteListener = function(payload) {
            this.state.models.splice(payload.modelIDToRemove, 1);
        }.bind(this);

        this.exportListener = function(payload) {
            payload['imagesView'] = [this.state.models, this.state.activeModelID, visualizationBuilder.getAllImagesTrns()]
        }.bind(this);

        this.importListener = function(payload) {
            visualizationBuilder.setAllImagesTrns(payload['imagesView'][2], payload['imagesView'][1]);
            this.setState({
                activeModelID:  payload['imagesView'][1],
                models:  payload['imagesView'][0],
            });
        }.bind(this);

        this.getCenterPanelSettingsListener = function(payload) {
            payload['imagesViewC'] =  [
                Object.assign({}, this.state.models[this.state.activeModelID]),
                Object.assign({}, visualizationBuilder.getImagesTrns())
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
     * After the component is removed from the DOM unregister listeners
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
     * Re-render images visualization after component update.
     */
    componentDidUpdate = () => {
        visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Zooms in canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomIn = () => {
        let activeModel = this.state.models[this.state.activeModelID];
        let trns = visualizationBuilder.getImagesTrns();
        // apply scaling
        trns.scaleX *= utl.SQRT2;
        trns.scaleY *= utl.SQRT2;
        trns.translateX = (this.imagesElm.offsetWidth / 2) * (1 - utl.SQRT2) + trns.translateX * utl.SQRT2;
        trns.translateY = (this.imagesElm.offsetHeight / 2) * (1 - utl.SQRT2) + trns.translateY * utl.SQRT2;
        visualizationBuilder.setImagesTrns(trns);
        visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
        activeModel.zoom *= utl.SQRT2;
        this.forceUpdate();
    };
    /**
     * Zooms out canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomOut = () => {
        let activeModel = this.state.models[this.state.activeModelID];
        let trns = visualizationBuilder.getImagesTrns();
        // apply scaling
        trns.scaleX *= utl.SQRT1_2;
        trns.scaleY *= utl.SQRT1_2;
        trns.translateX = (this.imagesElm.offsetWidth / 2) * (1 - utl.SQRT1_2) + trns.translateX * utl.SQRT1_2;
        trns.translateY = (this.imagesElm.offsetHeight / 2) * (1 - utl.SQRT1_2) + trns.translateY * utl.SQRT1_2;
        visualizationBuilder.setImagesTrns(trns);
        visualizationBuilder.renderImagesVisualization(this.imagesCanvasCTX, this.props.width, this.props.height);
        activeModel.zoom *= utl.SQRT1_2;
        this.forceUpdate();
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
        const activeModel = this.state.models[this.state.activeModelID];

        return (
            <div className="canvas-wrapper" id="images-view-wrapper" style={{width: width, height: height}}>
                <canvas id="images-view" width={width} height={(height - this.CONTROLS_PANEL_HEIGHT)} onMouseDown={this.handleTranslatingStart}
                    onMouseUp={this.handleTranslationEnd} onMouseLeave={this.handleTranslationEnd}
                    onTouchStart={(e) => {e.preventDefault();this.handleTranslatingStart(e.touches[0])}}>
                    Your browser does not support HTML5 Canvas. Please try different browser.
                </canvas>
                <div className="view-controls" id="images-view-controls">
                    <strong className="ui">Images composition view</strong>
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