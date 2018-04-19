// @flow
import * as React from 'react'
import { Checkbox, Select, Button } from 'semantic-ui-react'

import visualizationBuilder from '../../services/VisualizationBuilder.js'
import { unitDefinitionMenu, unitIdx } from "../../model/data_collections/UnitsDefinition";
import dispatcher from "../../services/Dispatcher";
import type {vec2, vec3} from "../../model/data_collections/flowTypes";
import SceneObject from "../../model/entities/SceneObject";
import {default as utl} from "../../services/ControlsUtils";

type Props = {
    width: number,
    height: number,
    activeModelID: number
};
type State = {
    drawCameraGrid: boolean,
    cameraSideView: boolean,
    objCtrlShow: string,
    cameraCanvasUnit: number,
    objCtrlPosX: number,
    objCtrlPosY: number,
    objCtrlWidth: number,
    objCtrlHeight: number,
    zoom: number
};

/**
 * @classdesc React component with scene visualization.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class CameraView extends React.Component<Props, State> {
    // constants
    OBJ_CTRL_PADDING: number = 10;
    OBJ_CTRL_MIN_WIDTH: number = 70;
    OBJ_CTRL_MMN_HEIGHT: number = 70;
    ZOOM_LOWER_LIMIT: number = 20;
    ZOOM_UPPER_LIMIT: number = 550;
    OBJ_MIN_DISTANCE: number = 0.1;
    // there is no reason to store these variables in Component state since they are used for decision making
    // or computation by internal code
    translating: boolean = false;
    focusedObj: SceneObject;
    trnsStartX: number = 0;
    trnsStartY: number = 0;
    rotationStartPoint: vec2;
    rotationCenterPoint: vec2;
    xyRotationRatio: number = 0;
    // this variables were prepared for object rotations
    // objCtrlCenterX: number = 0;
    // objCtrlCenterY: number = 0;
    // actionStartDistance: number = 0;
    _activeTouchMoveFunction: Function;
    // DOM elements
    body: HTMLElement;
    cameraElm: HTMLCanvasElement;
    objectControlElm: HTMLElement;
    cameraCanvasCTX: CanvasRenderingContext2D;
    // Listeners
    viewUpdateListener: Function;
    pasteListener: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            drawCameraGrid: false,
            cameraSideView: false,
            objCtrlShow: 'none',
            cameraCanvasUnit: unitIdx.cm,
            objCtrlPosX: 100,
            objCtrlPosY: 100,
            objCtrlWidth: 100,
            objCtrlHeight: 100,
            // this variable was prepared for object rotations
            // objCtrlRot: 0,
            zoom: 100
        };
    }
    /**
     * After the component is added the DOM register event listeners and initializes variables
     */
    componentDidMount = () => {
        // $FlowFixMe ignore null
        this.body = document.body;
        // $FlowFixMe ignore null
        this.cameraElm = document.getElementById('camera-view');
        // $FlowFixMe ignore null
        this.objectControlElm = document.getElementById('scene-object-control');
        this.cameraCanvasCTX = this.cameraElm.getContext('2d');

        this.updateVisualization(this.state.drawCameraGrid, this.state.cameraSideView, this.state.cameraCanvasUnit, this.cameraCanvasCTX);
        // register event listeners
        this.viewUpdateListener = function(payload) {
            visualizationBuilder.renderCameraVisualization(this.cameraCanvasCTX, this.props.width,this.props.height);
        }.bind(this);
        this.pasteListener = function(payload) {
            // close object focus frame
            this.setState({ objCtrlShow: 'none' });
            visualizationBuilder.updateActiveModel();
            visualizationBuilder.renderCameraVisualization(this.cameraCanvasCTX, this.props.width,this.props.height);
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
     * Re-render camera visualization after component update.
     */
    componentDidUpdate = () => {
        visualizationBuilder.renderCameraVisualization(this.cameraCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Function updates visualization state and re-renders the view.
     * @param {boolean} grid informs if grid view is active
     * @param {boolean} sideView informs if side view is active
     * @param {number} unit informs which unit is used in the view
     * @param {CanvasRenderingContext2D} ctx
     */
    updateVisualization = (grid: boolean, sideView: boolean, unit: number, ctx: CanvasRenderingContext2D) => {
        visualizationBuilder.setCameraViewConfiguration(grid, sideView, unit);
        visualizationBuilder.renderCameraVisualization(ctx, this.props.width, this.props.height);
    };
    /**
     * Events handling functions for canvas controls.
     */
    handleGridToggle = (e: SyntheticMouseEvent<>, data: Object) => {
        this.setState({drawCameraGrid: data.checked, objCtrlShow: 'none'});
        this.updateVisualization(data.checked, this.state.cameraSideView,
            this.state.cameraCanvasUnit, this.cameraCanvasCTX);
    };
    handleSideViewToggle = (e: SyntheticMouseEvent<>, data: Object) => {
        this.setState({cameraSideView: data.checked, objCtrlShow: 'none'});
        this.updateVisualization(this.state.drawCameraGrid, data.checked,
            this.state.cameraCanvasUnit, this.cameraCanvasCTX);
    };
    handleCanvasUnitChange = (e: SyntheticMouseEvent<>, data: Object) => {
        this.setState({cameraCanvasUnit: data.value, objCtrlShow: 'none'});
        this.updateVisualization(this.state.drawCameraGrid, this.state.cameraSideView,
            data.value, this.cameraCanvasCTX);
    };
    /**
     * Zooms in canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomIn = () => {
        if (this.state.zoom < this.ZOOM_UPPER_LIMIT) {
            let trns = visualizationBuilder.getCameraTrns();
            // apply scaling
            trns.scaleX *= utl.SQRT2;
            trns.scaleY *= utl.SQRT2;
            trns.translateX = (this.cameraElm.offsetWidth / 2) * (1 - utl.SQRT2) + trns.translateX * utl.SQRT2;
            trns.translateY = (this.cameraElm.offsetHeight / 2) * (1 - utl.SQRT2) + trns.translateY * utl.SQRT2;
            visualizationBuilder.setCameraTrns(trns);
            visualizationBuilder.renderCameraVisualization(this.cameraCanvasCTX, this.props.width, this.props.height);
            this.setState((prevState) => {
                return {
                    zoom: prevState.zoom * utl.SQRT2,
                    objCtrlShow: 'none'
                }
            });
        }
    };
    /**
     * Zooms out canvas view.
     * NOTE: These function is duplicated in every view so it cloud be customized for each specific view.
     */
    handleZoomOut = () => {
        if (this.state.zoom > this.ZOOM_LOWER_LIMIT) {
            let trns = visualizationBuilder.getCameraTrns();
            // apply scaling
            trns.scaleX *= utl.SQRT1_2;
            trns.scaleY *= utl.SQRT1_2;
            trns.translateX = (this.cameraElm.offsetWidth / 2) * (1 - utl.SQRT1_2) + trns.translateX * utl.SQRT1_2;
            trns.translateY = (this.cameraElm.offsetHeight / 2) * (1 - utl.SQRT1_2) + trns.translateY * utl.SQRT1_2;
            visualizationBuilder.setCameraTrns(trns);
            visualizationBuilder.renderCameraVisualization(this.cameraCanvasCTX, this.props.width, this.props.height);
            this.setState((prevState) => {
                return {
                    zoom: prevState.zoom * utl.SQRT1_2,
                    objCtrlShow: 'none'
                }
            });
        }
    };
    /**
     * Open object control frame.
     * @param {vec3} objCenter
     */
    showObjectControl = (objCenter: vec3) => {
        let objCtrlPosX, objCtrlPosY, objCtrlWidth, objCtrlHeight;
        let object = visualizationBuilder.getFocusedObject();
        let trns = visualizationBuilder.getCameraTrns();

        objCtrlWidth = object.getDepth() * trns.scaleX;
        objCtrlHeight = ((this.state.cameraSideView) ? (object.getWidth() * object.getAspect() * trns.scaleY) : (object.getWidth() * trns.scaleY));

        objCtrlWidth = ((objCtrlWidth < this.OBJ_CTRL_MIN_WIDTH) ? this.OBJ_CTRL_MIN_WIDTH : objCtrlWidth);
        objCtrlHeight = ((objCtrlHeight < this.OBJ_CTRL_MMN_HEIGHT) ? this.OBJ_CTRL_MMN_HEIGHT : objCtrlHeight);

        objCtrlPosX = objCenter[0] - objCtrlWidth / 2;
        objCtrlPosY = objCenter[1] - objCtrlHeight / 2;

        this.focusedObj = object;
        this.setState({
            // objCtrlRot: (this.state.cameraSideView) ? object.getObjectRotX() : object.getObjectRotY(),
            objCtrlPosX: objCtrlPosX,
            objCtrlPosY: objCtrlPosY,
            objCtrlWidth: objCtrlWidth,
            objCtrlHeight: objCtrlHeight,
            objCtrlShow: 'block'
        });
    };
    /**
     * Close object control frame.
     * @param {Event} e
     */
    handleCloseObjectControl = (e: Object) => {
        e.stopPropagation();
        this.setState({ objCtrlShow: 'none' });
    };
    /**
     * Registers event listeners for canvas translation.
     * @param {Event} e
     */
    handleTranslatingStart = (e: Object) => {
        this.setState({ objCtrlShow: 'none' });
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;
        this.cameraElm.addEventListener('mousemove', this.handleTranslate, window.passiveEventListener);
        this.cameraElm.addEventListener('touchmove', this.handleTouchTranslate, window.passiveEventListener);
    };
    /**
     * Handles horizontal bar movement.
     * @param {Event} e
     */
    handleTranslate = (e: Object) => {
        let trns = visualizationBuilder.getCameraTrns();
        this.translating = true;
        trns.translateX += e.clientX - this.trnsStartX;
        trns.translateY += e.clientY - this.trnsStartY;
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;
        visualizationBuilder.setCameraTrns(trns);
        visualizationBuilder.renderCameraVisualization(this.cameraCanvasCTX, this.props.width, this.props.height);
    };
    /**
     * Converts Touch event to Mouse event.
     * @param {Event} e
     */
    handleTouchTranslate = (e: Object) => {
        this.handleTranslate(e.touches[0]);
    };
    /**
     * Stop canvas translation and check if some object was selected.
     * @param {Event} e
     */
    handleObjSelectionAndTrnsEnd = (e: Object) => {
        let rect = this.cameraElm.getBoundingClientRect();
        this.handleTranslationEnd();
        if (!this.translating) {
            let ex = e.clientX - rect.left;
            let ey = e.clientY - rect.top;
            let objCenter = visualizationBuilder.getSelectedObject(ex, ey);
            if (objCenter != null)
                this.showObjectControl(objCenter);
        }
    };
    /**
     * Un-registers event listeners for canvas translation.
     */
    handleTranslationEnd = () => {
        this.translating = false;
        this.cameraElm.removeEventListener('mousemove', this.handleTranslate, window.passiveEventListener);
        this.cameraElm.removeEventListener('touchmove', this.handleTouchTranslate, window.passiveEventListener);
    };
    // _getCenterDistance(x, y) {
    //     let startX, startY;
    //     startX = x - this.objCtrlCenterX;
    //     startY = y - this.objCtrlCenterY;
    //     return Math.sqrt(Math.pow(startX, 2) + Math.pow(startY, 2));
    // }
    /**
     * Helper function used to convert Touch event to Mouse event.
     * @param {string} functionName name of function used for move action
     * @param {Event} event
     */
    _touchEventTransform = (functionName: string, event: TouchEvent) => {
        // $FlowFixMe Flow can not resolve function from string
        this[functionName](event.touches[0]);
    };
    /**
     * Helper function to register event listeners for specific object control frame action.
     * @param {string} moveFunction name of function used for move action
     * @param {string} endFunction name of function used for end action
     */
    _addControlListeners = (moveFunction: string, endFunction: string) => {
        // $FlowFixMe Flow can not resolve function from string
        this.cameraElm.addEventListener('mousemove', this[moveFunction], window.passiveEventListener);
        this._activeTouchMoveFunction = this._touchEventTransform.bind(this, moveFunction);
        this.cameraElm.addEventListener('touchmove', this._activeTouchMoveFunction, window.passiveEventListener);
        // $FlowFixMe Flow can not resolve function from string
        this.objectControlElm.addEventListener('mousemove', this[moveFunction], window.passiveEventListener);
        this.objectControlElm.addEventListener('touchmove', this._activeTouchMoveFunction, window.passiveEventListener);
        // $FlowFixMe Flow can not resolve function from string
        this.body.addEventListener('mouseup', this[endFunction], window.passiveEventListener);
        // $FlowFixMe Flow can not resolve function from string
        this.body.addEventListener('touchend', this[endFunction], window.passiveEventListener);
    };
    /**
     * Helper function to remove event listeners for specific object control frame action.
     * @param {string} moveFunction name of function used for move action
     * @param {string} endFunction name of function used for end action
     */
    _removeControlListeners = (moveFunction: string, endFunction: string) => {
        // $FlowFixMe Flow can not resolve function from string
        this.cameraElm.removeEventListener('mousemove', this[moveFunction], window.passiveEventListener);
        this.cameraElm.removeEventListener('touchmove', this._activeTouchMoveFunction, window.passiveEventListener);
        // $FlowFixMe Flow can not resolve function from string
        this.objectControlElm.removeEventListener('mousemove', this[moveFunction], window.passiveEventListener);
        this.objectControlElm.removeEventListener('touchmove', this._activeTouchMoveFunction, window.passiveEventListener);
        // $FlowFixMe Flow can not resolve function from string
        this.body.removeEventListener('mouseup', this[endFunction], window.passiveEventListener);
        // $FlowFixMe Flow can not resolve function from string
        this.body.removeEventListener('touchend', this[endFunction], window.passiveEventListener);
    };
    /**
     * Helper function to start selected object rotation.
     * @param {Event} e
     */
    handleObjectStartRotate = (e: Object) => {
        let rec = this.cameraElm.getBoundingClientRect();
        let centerX = rec.left + (this.state.objCtrlPosX + this.state.objCtrlWidth / 2);
        let centerY = rec.top + (this.state.objCtrlPosY + this.state.objCtrlHeight / 2);
        this.rotationStartPoint = [rec.left + this.state.objCtrlPosX + this.state.objCtrlWidth - centerX,
            rec.top + this.state.objCtrlPosY + this.state.objCtrlHeight - centerY];
        this.xyRotationRatio = this.state.objCtrlWidth / this.state.objCtrlHeight;
        this.rotationCenterPoint = [centerX, centerY];
        this._addControlListeners('handleObjectRotate', 'handleObjectEndRotate');
        e.stopPropagation();
        e.preventDefault();
    };
    /**
     * Helper function used to handle selected object rotation.
     * @param {Event} e
     */
    handleObjectRotate = (e: Object) => {
        let x = e.clientX - this.rotationCenterPoint[0];
        let y = e.clientY - this.rotationCenterPoint[1];
        let l = ((x * this.rotationStartPoint[0] + y * this.rotationStartPoint[1]) / (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            * Math.sqrt(Math.pow(this.rotationStartPoint[0], 2) + Math.pow(this.rotationStartPoint[1], 2))));
        let deg = Math.acos(l) * (180 / Math.PI);
        deg = (x <= this.xyRotationRatio*y) ? deg : -deg;

        if (this.state.cameraSideView) { this.focusedObj.setObjectRotX(deg); } else {  this.focusedObj.setObjectRotY(deg); }
        // this.setState({ objCtrlRot: deg });
        visualizationBuilder.updateScene();
        dispatcher.dispatch('sceneConfigurationUpdate', {});
        dispatcher.dispatch('configurationUpdate', {});
    };
    /**
     * Helper function to end selected object rotation.
     * @param {Event} e
     */
    handleObjectEndRotate = (e: Object) => {
        e.stopPropagation();
        this._removeControlListeners('handleObjectRotate', 'handleObjectEndRotate');
    };
    /**
     * Helper function to start selected object scale.
     * @param {Event} e
     */
    handleObjectStartScale = (e: Object) => {
        if (e.type === 'touchstart') {
            this.trnsStartX = e.touches[0].clientX;
            this.trnsStartY = e.touches[0].clientY;
        } else {
            this.trnsStartX = e.clientX;
            this.trnsStartY = e.clientY;
        }
        this._addControlListeners('handleObjectScale', 'handleObjectEndScale');
        e.stopPropagation();
        e.preventDefault();
    };
    /**
     * Helper function used to handle selected object scale.
     * @param {Event} e
     */
    handleObjectScale = (e: Object) => {
        let x = this.trnsStartX - e.clientX;
        let y = this.trnsStartY - e.clientY;
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;
        let trns = visualizationBuilder.getCameraTrns();
        let moveSize = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if (x < 0 || y < 0)
            moveSize = -moveSize;
        let frameDiagonal = Math.sqrt(Math.pow(this.state.objCtrlWidth, 2) + Math.pow(this.state.objCtrlHeight, 2));
        let ratio = moveSize / frameDiagonal;
        let newHeight;

        let newDepth = this.focusedObj.getDepth() + 2 * this.focusedObj.getDepth() * ratio;
        if (newDepth < this.OBJ_MIN_DISTANCE)
            return true;

        if (this.state.cameraSideView) {
            let curHeight = this.focusedObj.getAspect() * this.focusedObj.getWidth();
            let newAspect = (curHeight + 2 * ratio * curHeight) / this.focusedObj.getWidth();
            newHeight = newAspect * this.focusedObj.getWidth();
            if (newHeight < this.OBJ_MIN_DISTANCE)
                return true;
            // set only if is bigger then the limit
            this.focusedObj.setAspect(newAspect);
        } else {
            newHeight = this.focusedObj.getWidth() + 2 * this.focusedObj.getWidth() * ratio;
            if (newHeight < this.OBJ_MIN_DISTANCE)
                return true;
            this.focusedObj.setWidth(newHeight);
        }

        this.focusedObj.setDepth(newDepth);
        let objHeight = newHeight * trns.scaleY;
        let objWidth = newDepth * trns.scaleX;
        let objY = this.state.objCtrlPosY + (this.state.objCtrlHeight - objHeight) / 2;
        let objX = this.state.objCtrlPosX + (this.state.objCtrlWidth - objWidth) / 2;
        if (objWidth < this.OBJ_CTRL_MIN_WIDTH) {
            objWidth = this.OBJ_CTRL_MIN_WIDTH;
            objX = this.state.objCtrlPosX + ((this.state.objCtrlWidth - objWidth) / 2);
        }
        if (objHeight < this.OBJ_CTRL_MMN_HEIGHT) {
            objHeight = this.OBJ_CTRL_MMN_HEIGHT;
            objY = this.state.objCtrlPosY + ((this.state.objCtrlHeight - objHeight) / 2);
        }

        this.setState({
            objCtrlPosY: objY,
            objCtrlPosX: objX,
            objCtrlWidth: objWidth,
            objCtrlHeight: objHeight
        });

        visualizationBuilder.updateScene();
        dispatcher.dispatch('sceneConfigurationUpdate', {});
        dispatcher.dispatch('configurationUpdate', {});
    };
    /**
     * Helper function to end selected object rotation.
     * @param {Event} e
     */
    handleObjectEndScale = (e: Object) => {
        e.stopPropagation();
        this._removeControlListeners('handleObjectScale', 'handleObjectEndScale');
    };
    /**
     * Helper function to start selected object X resize.
     * @param {Event} e
     */
    handleObjectStartXResize = (e: Object) => {
        // this code was prepared for case were ctrl object is rotating as well
        // let x, y;
        // let rect = this.cameraElm.getBoundingClientRect();
        // this.objCtrlCenterX = rect.left + this.state.objCtrlPosX + this.state.objCtrlWidth / 2;
        // this.objCtrlCenterY = rect.top + this.state.objCtrlPosY + this.state.objCtrlHeight / 2;
        // if (e.type === 'touchstart) {
        //     x = e.touches[0].clientX - this.objCtrlCenterX;
        //     y = e.touches[1].clientY - this.objCtrlCenterY;
        // } else {
        //     x = e.clientX - this.objCtrlCenterX;
        //     y = e.clientY - this.objCtrlCenterY;
        // }
        // let newCoords = vecOpr.reverse2Drotate(x, y, this.state.objCtrlRot);
        // this.actionStartDistance = -newCoords[0];
        if (e.type === 'touchstart') { this.trnsStartX = e.touches[0].clientX; } else { this.trnsStartX = e.clientX; }
        this._addControlListeners('handleObjectXResize', 'handleObjectEndXResize');
        e.stopPropagation();
        e.preventDefault();
    };
    /**
     * Helper function used to handle selected object X resize.
     * @param {Event} e
     */
    handleObjectXResize = (e: Object) => {
        let disChange = this.trnsStartX - e.clientX;
        this.trnsStartX = e.clientX;
        // this code was prepared for case were ctrl object is rotating as well
        // let newCoords = vecOpr.reverse2Drotate(e.clientX - this.objCtrlCenterX, e.clientY - this.objCtrlCenterY, this.state.objCtrlRot);
        // let disChange = Math.abs(newCoords[0]) - this.actionStartDistance;
        // this.actionStartDistance = Math.abs(newCoords[0]);
        let trns = visualizationBuilder.getCameraTrns();
        let newDepth = this.focusedObj.getDepth() + (2 * (disChange / trns.scaleX));
        if (newDepth < this.OBJ_MIN_DISTANCE)
            return true;
        this.focusedObj.setDepth(newDepth);

        visualizationBuilder.updateScene();
        dispatcher.dispatch('sceneConfigurationUpdate', {});
        dispatcher.dispatch('configurationUpdate', {});

        let objWidth = this.state.objCtrlWidth + 2 * disChange;
        let objX = this.state.objCtrlPosX - disChange;
        if (objWidth < this.OBJ_CTRL_MIN_WIDTH)
            return true;
        this.setState({
            objCtrlWidth: objWidth,
            objCtrlPosX: objX
        });
    };
    /**
     * Helper function to end selected object X resize.
     * @param {Event} e
     */
    handleObjectEndXResize = (e: Object) => {
        e.stopPropagation();
        this._removeControlListeners('handleObjectXResize', 'handleObjectEndXResize');
    };
    /**
     * Helper function to start selected object Y resize.
     * @param {Event} e
     */
    handleObjectStartYResize = (e: Object) => {
        if (e.type === 'touchstart') { this.trnsStartY = e.touches[0].clientY; } else { this.trnsStartY = e.clientY; }
        this._addControlListeners('handleObjectYResize', 'handleObjectEndYResize');
        e.stopPropagation();
        e.preventDefault();
    };
    /**
     * Helper function used to handle selected object Y resize.
     * @param {Event} e
     */
    handleObjectYResize = (e: Object) => {
        let disChange = this.trnsStartY - e.clientY;
        this.trnsStartY = e.clientY;
        let trns = visualizationBuilder.getCameraTrns();

        if (this.state.cameraSideView) {
            let newAspect = (this.focusedObj.getAspect() * this.focusedObj.getWidth() + (2 * (disChange / trns.scaleY))) / this.focusedObj.getWidth();
            if (newAspect * this.focusedObj.getWidth() <= this.OBJ_MIN_DISTANCE)
                return true;
            this.focusedObj.setAspect(newAspect);
        } else {
            let newWidth = this.focusedObj.getWidth() + 2 *(disChange / trns.scaleY);
            if (newWidth < this.OBJ_MIN_DISTANCE)
                return true;
            this.focusedObj.setWidth(newWidth);
        }

        visualizationBuilder.updateScene();
        dispatcher.dispatch('sceneConfigurationUpdate', {});
        dispatcher.dispatch('configurationUpdate', {});

        let objHeight = this.state.objCtrlHeight + 2 * disChange;
        let objY = this.state.objCtrlPosY - disChange;
        if (objHeight < this.OBJ_CTRL_MMN_HEIGHT)
            return true;
        this.setState({ objCtrlHeight: objHeight,  objCtrlPosY: objY });
    };
    /**
     * Helper function to end selected object Y resize.
     * @param {Event} e
     */
    handleObjectEndYResize = (e: Object) => {
        e.stopPropagation();
        this._removeControlListeners('handleObjectYResize', 'handleObjectEndYResize');
    };
    /**
     * Helper function to start selected object translation.
     * @param {Event} e
     */
    handleObjectStartTranslate = (e: Object) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'touchstart') {
            this.trnsStartX = e.touches[0].clientX;
            this.trnsStartY = e.touches[0].clientY;
        } else {
            this.trnsStartX = e.clientX;
            this.trnsStartY = e.clientY;
        }
        this._addControlListeners('handleObjectTranslate', 'handleObjectEndTranslate');
    };
    /**
     * Helper function used to handle selected object translation.
     * @param {Event} e
     */
    handleObjectTranslate = (e: Object) => {
        let x = e.clientX - this.trnsStartX;
        let y = e.clientY - this.trnsStartY;
        let trns = visualizationBuilder.getCameraTrns();
        if (this.state.cameraSideView) {
            this.focusedObj.setCenterY(this.focusedObj.getCenterY() - (y / trns.scaleY));
            this.focusedObj.setCenterZ(this.focusedObj.getCenterZ() + (x / trns.scaleX));
        } else {
            this.focusedObj.setCenterX(this.focusedObj.getCenterX() + (y / trns.scaleY));
            this.focusedObj.setCenterZ(this.focusedObj.getCenterZ() + (x / trns.scaleX));
        }
        this.trnsStartX = e.clientX;
        this.trnsStartY = e.clientY;

        this.setState((prevState) => {
            return {
                    objCtrlPosY: (prevState.objCtrlPosY + y),
                    objCtrlPosX: (prevState.objCtrlPosX + x)
                };
        });

        visualizationBuilder.updateScene();
        dispatcher.dispatch('sceneConfigurationUpdate', {});
        dispatcher.dispatch('configurationUpdate', {});
    };
    /**
     * Helper function to end selected object translation.
     * @param {Event} e
     */
    handleObjectEndTranslate = (e: Object) => {
        e.stopPropagation();
        this._removeControlListeners('handleObjectTranslate', 'handleObjectEndTranslate');
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { width, height } = this.props;
        const { drawCameraGrid, cameraSideView, cameraCanvasUnit, zoom, objCtrlHeight, objCtrlWidth, objCtrlPosX, objCtrlPosY, objCtrlShow } = this.state;
        return (
            <div className="canvas-wrapper" style={{width: width, height: (height)}}>
                <div id="scene-object-control" onMouseDown={this.handleObjectStartTranslate} onTouchStart={this.handleObjectStartTranslate}
                     style={{width: objCtrlWidth, height: objCtrlHeight, top: objCtrlPosY, left: objCtrlPosX, display: objCtrlShow}}>
                     {/*style={{transform: `rotate(${objCtrlRot}deg)`, width: objCtrlWidth, height: objCtrlHeight, top: objCtrlPosY, left: objCtrlPosX, display: objCtrlShow}}>*/}
                    <Button circular color="red" icon='close' id="object-control-close" onMouseUp={this.handleCloseObjectControl} onTouchEnd={this.handleCloseObjectControl}
                        onMouseDown={(e)=>e.stopPropagation()} onTouchStart={(e)=>{e.stopPropagation();e.preventDefault()}} size='mini'/>
                    <Button circular color="green" icon='undo' id="object-control-rotate" onMouseDown={this.handleObjectStartRotate} onTouchStart={this.handleObjectStartRotate} size='mini'/>
                    <Button circular color="green" icon='resize vertical' id="object-control-scale" onMouseDown={this.handleObjectStartScale} onTouchStart={this.handleObjectStartScale} size='mini'/>
                    <Button circular color="green" icon='resize vertical' id="object-control-resy" onMouseDown={this.handleObjectStartYResize} onTouchStart={this.handleObjectStartYResize} size='mini'/>
                    <Button circular color="green" icon='resize horizontal' id="object-control-resx" onMouseDown={this.handleObjectStartXResize} onTouchStart={this.handleObjectStartXResize} size='mini'/>
                </div>
                <canvas id="camera-view" width={width} height={(height - 28)}
                        onMouseDown={this.handleTranslatingStart} onMouseUp={this.handleObjSelectionAndTrnsEnd} onMouseLeave={this.handleTranslationEnd}
                        onTouchStart={(e) => {e.preventDefault();this.handleTranslatingStart(e.touches[0])}} onTouchEnd={(e) => {this.handleObjSelectionAndTrnsEnd(e.changedTouches[0])}}>
                    Your browser does not support HTML5 Canvas. Please try different browser.
                </canvas>
                <div className="view-controls" id="camera-view-controls">
                    <strong className="ui">Cameras view </strong>
                    <Checkbox label='Grid' onChange={this.handleGridToggle} checked={drawCameraGrid}/>
                    <Checkbox label='Side view' onChange={this.handleSideViewToggle} checked={cameraSideView}/>
                    <Select compact options={unitDefinitionMenu} onChange={this.handleCanvasUnitChange} defaultValue={cameraCanvasUnit} />
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