// @flow
import cameraDAO from '../model/CameraDAO.js'
import diagnosticsDAO from '../model/DiagnosticsDAO.js'
import displayAndViewerDAO from '../model/DisplayAndViewerDAO.js'
import generalDAO from '../model/GeneralDAO.js'

import { colorScheme } from '../model/data_collections/ColorSchemes.js'
import { drawingHelper, DrawingHelper } from '../helpers/DrawingHelper.js'
import { photoTransformationsHelper } from '../helpers/PhotoTransformationsHelper.js'
import vecOpr from '../helpers/VectorOperationsHelper.js'
import { unitIdx } from "../model/data_collections/UnitsDefinition.js";
import { objTypeIdx } from "../model/data_collections/ObjectTypes.js";
import sceneObjectDAO from "../model/SceneObjectDAO";
import type { camerasType, displayType, eyesType, imagesType, trnsType, vec3, vertices, reconstructionType } from "../model/data_collections/flowTypes";
import SceneObject from "../model/entities/SceneObject";
import Diagnostics from "../model/entities/Diagnostics";
import Camera from "../model/entities/Camera";
import DisplayAndViewer from "../model/entities/DisplayAndViewer";
import General from "../model/entities/General";
import DrawableObject from "../model/drawable_objects/DrawableObject";

/**
 * @classdesc Service class used to create simulation visualizations
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class VisualizationBuilder {
    OBJ_MARGIN: number = 0.02;
    cameraTrns: trnsType = {scaleX:100, translateX:300, scaleY:100, translateY:100};
    viewerTrns: trnsType = {scaleX:100, translateX:300, scaleY:100, translateY:100};
    imagesTrns: trnsType = {scaleX:100, translateX:250, scaleY:100, translateY:100};
    images: imagesType;
    imagesVisible: imagesType;
    cameras: camerasType;
    focusedObject: SceneObject;

    drawViewerGrid: boolean = false;
    viewerSideView: boolean = false;
    drawReconstructionRays: boolean = false;
    viewerCanvasUnit: number = unitIdx.cm;
    drawCameraGrid: boolean = false;
    cameraSideView: boolean = false;
    cameraCanvasUnit: number = unitIdx.cm;

    statVals: Diagnostics = diagnosticsDAO.getActiveRecord();
    cmVals: Camera = cameraDAO.getActiveRecord();
    DAW: DisplayAndViewer = displayAndViewerDAO.getActiveRecord();
    gnrVals: General = generalDAO.getActiveRecord();

    scene: Array<DrawableObject>;
    /**
     * @constructs
     */
    constructor() {
        this.updateActiveModel();
    }
    /**
     * If there is a model switch, this function should be called to update active records used for visualization.
     * @public
     */
    updateActiveModel() {
        this.statVals = diagnosticsDAO.getActiveRecord();
        this.cmVals = cameraDAO.getActiveRecord();
        this.DAW = displayAndViewerDAO.getActiveRecord();
        this.gnrVals = generalDAO.getActiveRecord();
        drawingHelper.updateActiveModel();
        photoTransformationsHelper.updateActiveModel();
        this.scene = drawingHelper.createScene();
    }
    /**
     * Function used to recreate views scene in case of some change.
     * @public
     */
    updateScene() {
        this.scene = drawingHelper.createScene();
    }
    /**
     * Getters and setters for views translation settings.
     * @public
     */
    getCameraTrns(): trnsType {
        return this.cameraTrns;
    }
    getViewerTrns(): trnsType {
        return this.viewerTrns;
    }
    getImagesTrns(): trnsType {
        return this.imagesTrns;
    }
    setCameraTrns(trns: trnsType) {
        this.cameraTrns = trns;
    }
    setViewerTrns(trns: trnsType) {
        this.viewerTrns = trns;
    }
    setImagesTrns(trns: trnsType) {
        this.imagesTrns = trns;
    }
    /**
     * Helper function used to get mouse click to the object origin.
     * @private
     * @param {vertices} vertices represents mouse click/touch
     * @param {SceneObject} model object used for coordinates transformation
     */
    static _reverseTransformObject(vertices: vertices, model: SceneObject) {
        vecOpr.reverseObjectTranslate(vertices, [model.getCenterX(), model.getCenterY(), model.getCenterZ()]);
        // prepared for future update
        // vecOpr.reverseObjectRotateY(vertices, model.getObjectRotY());
        // vecOpr.reverseObjectRotateX(vertices, model.getObjectRotX());
        // vecOpr.reverseObjectRotateZ(vertices, model.getObjectRotZ());
    }
    /**
     * Returns currently selected object.
     * @public
     * @return {SceneObject} selected object
     */
    getFocusedObject(): SceneObject {
        return this.focusedObject;
    }
    /**
     * Getters and setters for views translation settings.
     * @public
     * @param {number} x coordinates
     * @param {number} y coordinates
     * @return {null | vec3} selected object center coordinates or null
     */
    getSelectedObject(x: number, y: number): null | vec3 {
        // $FlowFixMe
        this.focusedObject = null;
        let vertices = [[x, y, 0]], point;
        vecOpr.reverseObjectTranslate(vertices, [this.cameraTrns.translateX, this.cameraTrns.translateY, 0]);
        vecOpr.reverseObjectScale(vertices, [this.cameraTrns.scaleX, this.cameraTrns.scaleY, 1]);
        let objects = sceneObjectDAO.getActiveRecord();
        if (this.cameraSideView) { // height and depth
            let vec = [0, -vertices[0][1], vertices[0][0]];
            for (let oi = 0; oi < objects.length; oi++) {
                let verCopy = [vec.slice()];
                // $FlowFixMe
                VisualizationBuilder._reverseTransformObject(verCopy, objects[oi]);
                if ((Math.abs(verCopy[0][2]) < (objects[oi].getDepth() / 2 + this.OBJ_MARGIN)) &&
                    ((Math.abs(verCopy[0][1])) < ((objects[oi].getWidth() * objects[oi].getAspect()) / 2 + this.OBJ_MARGIN))) {
                        this.focusedObject = objects[oi];
                        point = [[this.focusedObject.getCenterZ(), -this.focusedObject.getCenterY(), 0]];
                        break;
                }
            }
        } else { // width and depth
            let vec = [vertices[0][1], 0, vertices[0][0]];
            for (let oi = 0; oi < objects.length; oi++) {
                let verCopy = [vec.slice()];
                // $FlowFixMe
                VisualizationBuilder._reverseTransformObject(verCopy, objects[oi]);
                if ((Math.abs(verCopy[0][2]) < (objects[oi].getDepth() / 2 + this.OBJ_MARGIN)) &&
                    (Math.abs(verCopy[0][0]) < (objects[oi].getWidth() / 2 + this.OBJ_MARGIN))) {
                        this.focusedObject = objects[oi];
                        point = [[ this.focusedObject.getCenterZ(), this.focusedObject.getCenterX(), 0]];
                        break;
                }
            }
        }
        if (this.focusedObject != null) {
            // scene translation
            // $FlowFixMe
            vecOpr.objectScale(point, [this.cameraTrns.scaleX, this.cameraTrns.scaleY, 1]);
            // $FlowFixMe
            vecOpr.objectTranslate(point, [this.cameraTrns.translateX, this.cameraTrns.translateY, 0]);
            // $FlowFixMe
            return point[0];
        } else {
            return null;
        }
    }
    /**
     * Function used to update viewer view configuration so re-render can be a bit faster.
     * @public
     * @param {boolean} drawViewerGrid
     * @param {boolean} viewerSideView
     * @param {boolean} drawReconstructionRays
     * @param {number} viewerCanvasUnit
     */
    setViewerViewConfiguration(drawViewerGrid: boolean, viewerSideView: boolean, drawReconstructionRays: boolean, viewerCanvasUnit: number) {
        this.drawViewerGrid = drawViewerGrid;
        this.viewerSideView = viewerSideView;
        this.drawReconstructionRays = drawReconstructionRays;
        this.viewerCanvasUnit = viewerCanvasUnit;
    }
    /**
     * Function used to update camera view configuration so re-render can be a bit faster.
     * @public
     * @param {boolean} drawCameraGrid
     * @param {boolean} cameraSideView
     * @param {number} cameraCanvasUnit
     */
    setCameraViewConfiguration(drawCameraGrid: boolean, cameraSideView: boolean, cameraCanvasUnit: number) {
        this.drawCameraGrid = drawCameraGrid;
        this.cameraSideView = cameraSideView;
        this.cameraCanvasUnit = cameraCanvasUnit;
    }
    /**
     * Depending on diagnostics settings returns images used for diag. calculations.
     * @public
     * @param {boolean} isGlobal diagnostics configuration used for selection
     * @return {imagesType} selected images
     */
    getImagesForDiagnostics(isGlobal: boolean): imagesType {
        return (isGlobal) ? [this.images[0], this.images[this.cmVals.getCamerasCount()-1]] : this.imagesVisible;
    }
    /**
     * Calculates reconstruction object used during viewer view construction
     * @private
     * @param {eyesType} eyes
     * @param {displayType} display
     * @param {imagesType} images
     * @return {reconstructionType}
     */
    static _calculateReconstruction(eyes: eyesType, display: displayType, images: imagesType): reconstructionType {
        let oi, i, ie;
        let pd = [[], []]; // two points of a stereopair on a display
        let pr = [];       // array of reconstructed points
        // let mix = [1, 1, 1];
        // let pointR = 3;

        // iterate through all objects
        for (oi = 0; oi < images[0].length; oi++) {
            let obj = [];
            // iterate through all points
            for (i = 0; i < images[0][oi].length; i++) {
                // calculate point position on a display for both eyes
                for (ie = 0; ie < 2; ie++) {
                    pd[ie] = vecOpr.vectAdd(display.center, vecOpr.vectAdd(
                            vecOpr.vectScale(display.right, images[ie][oi][i][0]),
                            vecOpr.vectScale(display.up, images[ie][oi][i][1])));
                }
                // $FlowFixMe
                obj.push(vecOpr.calculateIntersectionXZ(eyes[0].location, pd[0], eyes[1].location, pd[1]));
            }
            pr.push(obj);
        }
        return pr;
    }
    /**
     * Updates vertices in scene object from reconstruction object.
     * @private
     * @param {Array<DrawableObject>} scene
     * @param {reconstructionType} reconstruction
     * @return {Array<DrawableObject>}
     */
    static _reconstructScene(scene: Array<DrawableObject>, reconstruction: reconstructionType): Array<DrawableObject> {
        for (let i = 0; i < scene.length; i++)
            scene[i].setVertices(reconstruction[i].slice(0));
        return scene;
    }
    /**
     * Takes images created by all the cameras in the setup.
     * Selects just two of them for left/right eye depending on display type and eyes position.
     * @private
     * @param {eyesType} eyes
     * @param {displayType} display
     * @param {imagesType} imagesOrig
     * @return {imagesType}
     */
    _calculateVisibleImages(eyes: eyesType, display: displayType, imagesOrig: imagesType): imagesType {
        if (this.DAW.getDisplayType() === 'stereoscopic') {
            return [imagesOrig[this.DAW.getDisplayCameraLeft()-1], imagesOrig[this.DAW.getDisplayCameraLeft() + this.DAW.getDisplayCameraOffset() - 1]];
        } else { // else is lenticular
            let e, i, o, p; //index of image, object, point
            let imagesOrigCount = imagesOrig.length;
            let objectsOrigCount = imagesOrig[0].length;

            // calculate display parameters
            let mechanicalPitch = this.DAW.getMechanicalPitch();
            let displayDepth = this.DAW.getDisplayDepth();
            let visualPitch = this.DAW.getVisualPitch();
            // loop over eyes
            let imagesVisible = [];
            for (e = 0; e < eyes.length; e++) {
                let eyeLocation = eyes[e].location;
                // loop over objects
                let iNewObjects = [];
                for (o = 0; o < objectsOrigCount; o++) {
                    // loop over points of every object
                    let iNewPoints = [];
                    for (p = 0; p < imagesOrig[0][o].length; p++) {
                        // loop over point location of every image
                        let point = [], pointVisible = [];
                        let visibilityCount = 0; // how many images can the actual eye see
                        for (i = 0; i < imagesOrigCount; i++) {
                            point = imagesOrig[i][o][p];
                            // Autostereoscopic image is divided to cells, each cell is visible through an adjacent pinhole.
                            // Each cell is divided to subcells, a subcell contains a slice from an image.
                            // Cell number = 0 in the display center, subcells are numbered from 0 to imagesOrigCount-1
                            let cellNumber = Math.round(point[0] / visualPitch);
                            let cellMinX = (cellNumber - 0.5) * visualPitch;
                            let pinholeX = cellNumber * mechanicalPitch;
                            // Image of the point p is displayed in the particular subcell
                            // calculate min and max x coordinates
                            // Do not forget that subcells are reversed in the cell
                            let subCellMinX = visualPitch * (imagesOrigCount - i - 1) / imagesOrigCount + cellMinX;
                            let subCellMaxX = visualPitch * (imagesOrigCount - i) / imagesOrigCount + cellMinX;
                            // Draw a line from subCellMinX through pinholeX and decide if the eye e is to the right or to the left.
                            // Do the same for the line from subCellMaxX and decide if the eye is on the opposite side.
                            // If this is the case, the point p is visible from the eye e.
                            let orient1 = vecOpr.triangleOrientation([subCellMinX, displayDepth], [pinholeX, 0], [eyeLocation[0], eyeLocation[2]]);
                            let orient2 = vecOpr.triangleOrientation([subCellMaxX, displayDepth], [pinholeX, 0], [eyeLocation[0], eyeLocation[2]]);
                            if (orient1 <=0 && orient2 >=0) { // point p is visible!
                                visibilityCount++;
                                // quantization to subcells
                                // pointVisible = [0.5*(subCellMinX + subCellMaxX), point[1]];
                                pointVisible = point;
                            }
                        }
                        if (visibilityCount === 1) { // the eye can see the point in a single image only
                            iNewPoints.push(pointVisible);
                        } else { // the eye can either see the point in multiple images or cannot see it at all
                            iNewPoints.push([Number.NaN, Number.NaN]);
                        }
                    }
                    iNewObjects.push(iNewPoints);
                }
                imagesVisible.push(iNewObjects);
            }
            // $FlowFixMe
            return imagesVisible;
        }
    }
    /**
     * Function creates images displayed in Images view.
     * @private
     * @param {camerasType} cameras
     * @param {Array<DrawableObject>} scene
     * @return {imagesType}
     */
    static _calculateImages(cameras: camerasType, scene: Array<DrawableObject>): imagesType {
        let images = [], simage = [];
        let obj, oimage, raydir, denom, r, u, c, cl, cd, cr, cu, vertices;
        for (let ic = 0; ic < cameras.length; ic++) {
            simage = [];
            c = cameras[ic];
            cl = c.location;
            cl = c.location;
            cd = c.direction;
            cr = c.right;
            cu = c.up;
            for (let oi = 0; oi < scene.length; oi++) {
                obj = scene[oi];
                vertices = obj.getVertices();
                oimage = [];
                for (let i = 0; i < vertices.length; i++) {
                    raydir = (vecOpr.vectSub(vertices[i], cl): vec3);
                    denom = vecOpr.det3x3([[-raydir[0], cr[0], cu[0]], [-raydir[1], cr[1], cu[1]], [-raydir[2], cr[2], cu[2]]]);
                    r = vecOpr.det3x3([[-raydir[0], -cd[0], cu[0]],[-raydir[1], -cd[1], cu[1]],[-raydir[2], -cd[2], cu[2]]]) / denom;
                    u = vecOpr.det3x3([[-raydir[0], cr[0], -cd[0]],[-raydir[1], cr[1], -cd[1]],[-raydir[2], cr[2], -cd[2]]]) / denom;
                    oimage.push([r, u]);
                }
                simage.push(oimage);
            }
            images.push(simage);
        }
        return images;
    }
    /**
     * Set up cameras definition array according to cameraDefinition.
     * That means cameras positions, dir/right/up vectors, and colors.
     * @private
     * @return {camerasType}
     */
    _getCamerasDefinition(): camerasType {
        let camerasCount = this.cmVals.getCamerasCount();
        let cameraSeparation = this.cmVals.getCameraSeparation();
        let cameraZ = -this.cmVals.getCameraDistance();
        let fLength = this.cmVals.getFocalLength();
        let cameraCrossing = this.cmVals.getCameraCrossing();
        let sensorWidthHalf = this.cmVals.getSensorWidth() / 2;
        // set direction, right and up vectors
        //
        // lens equation: 1 / cameraZ + 1/q = 1/fLength
        // => 1/q = 1/fLength - 1/cameraZ
        // => tan(fov angle)/2 = (sensorWidth / 2)/q
        // 1 / dirZ = 18e-3 / q
        let dirLength = fLength * cameraZ / (fLength + cameraZ) / sensorWidthHalf;
        let c, camX, camY, dirVector, upVector, rightVector;
        let cameras = [];
        let sensorAspect = this.cmVals.getSensorWidth() / this.cmVals.getSensorHeight();

        if (dirLength < 0) // unable to focus!
            dirLength = 0;

        camY = this.cmVals.getCameraHeight();
        for (c = 0; c < camerasCount; c++) {
            camX = -cameraSeparation/2.0 + c/(camerasCount - 1) * cameraSeparation;
            if (this.cmVals.getCameraType() === 'toe-in' || this.cmVals.getCameraType() === 'tilt-shift') {
                dirVector = [-camX, -camY, cameraCrossing - cameraZ];
            } else if (this.cmVals.getCameraType() === 'toe-out') {
                dirVector = [camX, -camY, cameraCrossing - cameraZ];
            }  else { // parallel
                dirVector = [0, -camY, cameraCrossing - cameraZ];
            }

            let correction;
            if (this.cmVals.getFocalLengthCorrection() === true) {
                let cZ = cameraCrossing - cameraZ;
                correction = Math.sqrt(camX*camX + camY*camY + cZ*cZ) / cZ;
            } else {
                correction = 1;
            }
            dirVector = vecOpr.vectScale(dirVector, dirLength * correction / vecOpr.vectLength(dirVector));
            upVector = [0, 1, 0];
            if (this.cmVals.getCameraType() === 'toe-in' || this.cmVals.getCameraType() === 'toe-out' ) {
                rightVector = vecOpr.crossProduct(upVector, dirVector);
                rightVector = vecOpr.vectScale(rightVector, 1 / vecOpr.vectLength(rightVector));
            } else {
                rightVector = [1, 0, 0];
            }
            if (this.cmVals.getCameraType() === 'toe-in' || this.cmVals.getCameraType() === 'toe-out' ||
                this.cmVals.getCameraType() === 'parallel') {
                upVector = vecOpr.crossProduct(dirVector, rightVector);
                upVector = vecOpr.vectScale(upVector, 1/vecOpr.vectLength(upVector));
            }
            // set camera color
            let cameraColor = c === 0 ? colorScheme[this.gnrVals.getColorSchemeIdx()][0] : (c === camerasCount-1 ? colorScheme[this.gnrVals.getColorSchemeIdx()][1] : [0.5, 0.5, 0.5]);
            let camera = {
                location: [camX, camY, cameraZ],
                direction: dirVector,
                right: rightVector,
                up: upVector,
                aspect: sensorAspect,
                color: cameraColor
            };
            cameras.push(camera);
        }
        return cameras;
    }
    /**
     * Returns predefined eyes settings used in Viewer view.
     * @private
     * @return {eyesType}
     */
    _getEyesDefinition(): eyesType {
        let head = [this.DAW.getHeadPosition(), 0, -this.DAW.getHeadDistance()];
        let dw = this.DAW.getDisplayWidth();
        let displayAspect = this.DAW.getDisplayAspect();
        // let dh = dw / displayAspect;
        let eyesSeparation = this.DAW.getEyesSeparation();
        return [
            { location:  [head[0]-eyesSeparation/2, head[1], head[2]],
                direction: [-(head[0]-eyesSeparation/2), -head[1], -head[2]],
                right:     [dw / 2, 0, 0],
                up:        [0, dw / 2, 0],
                aspect:	 displayAspect,
                color:     colorScheme[this.gnrVals.getColorSchemeIdx()][0] },
            { location:  [head[0]+eyesSeparation/2, head[1], head[2]],
                direction: [-(head[0]+eyesSeparation/2), -head[1], -head[2]],
                right:     [dw / 2, 0, 0],
                up:        [0, dw / 2, 0],
                aspect:	 displayAspect,
                color:     colorScheme[this.gnrVals.getColorSchemeIdx()][1] }
        ];
    }
    /**
     * Function used to render Viewer view visualization.
     * @public
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    renderViewerVisualization(ctx: CanvasRenderingContext2D, width: number, height: number) {
        DrawingHelper.clearCanvas(ctx, width, height);
        let dw = this.DAW.getDisplayWidth();
        let display = {
            center: [0, 0, 0],
            right:  [dw / 2, 0, 0],
            up: [0, dw / 2 , 0],
            aspect: this.DAW.getDisplayAspect()
        };
        let eyes = this._getEyesDefinition();
        let positions = vecOpr.getRulerPositions(ctx, this.viewerTrns);
        let viewerSideView;
        if (this.viewerSideView) { viewerSideView = 'yz'; } else { viewerSideView = 'xz'; }
        if (this.drawViewerGrid) { DrawingHelper.drawGrid(ctx, this.viewerTrns, viewerSideView, positions); }
        // reconstruct 3D vision
        let imagesVisible = this._calculateVisibleImages(eyes, display, this.images);
        let reconstruction = VisualizationBuilder._calculateReconstruction(eyes, display, imagesVisible);
        drawingHelper.drawVisibilityZones(ctx, this.viewerTrns, viewerSideView, this.cameras);
        DrawingHelper.drawEyes(ctx, this.viewerTrns, viewerSideView, eyes, false, true);
        drawingHelper.drawDisplay(ctx, this.viewerTrns, viewerSideView, display);
        // draw fatigue-free zone
        if (this.statVals.getVergenceDistanceFar()[0] < 100 && this.statVals.getVergenceDistanceFar()[0] > 0)
            DrawingHelper.drawZLine(ctx, this.viewerTrns, this.statVals.getVergenceDistanceFar()[0] - this.DAW.getHeadDistance(), "#ff8080", 'far', 15);
        DrawingHelper.drawZLine(ctx, this.viewerTrns, this.statVals.getVergenceDistanceNear()[0] - this.DAW.getHeadDistance(), "#8080ff", 'near', 5);
        // draw reconstruction. this must be line this
        if (this.drawReconstructionRays) {
            if (this.DAW.getDisplayType() !== 'stereoscopic')
                DrawingHelper.drawReconstruction(ctx, this.viewerTrns, viewerSideView, eyes, display, this.images, reconstruction);
            DrawingHelper.drawReconstruction(ctx, this.viewerTrns, viewerSideView, eyes, display, imagesVisible, reconstruction);
        }
        ctx.fillStyle = "#000000";
        DrawingHelper.drawScene(ctx, this.viewerTrns, viewerSideView, VisualizationBuilder._reconstructScene(
            drawingHelper.createScene(), reconstruction));
        DrawingHelper.drawRulers(ctx, this.viewerTrns, viewerSideView, positions, this.viewerCanvasUnit);
        this.imagesVisible = imagesVisible;
    }
    /**
     * Function used to render Camera view visualization.
     * @public
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    renderCameraVisualization(ctx: CanvasRenderingContext2D, width: number, height: number) {
        DrawingHelper.clearCanvas(ctx, width, height);
        let cameras = this._getCamerasDefinition();
        let positions = vecOpr.getRulerPositions(ctx, this.cameraTrns);
        let cameraSideView;
        if (this.cameraSideView) { cameraSideView = 'yz'; } else { cameraSideView = 'xz'; }
        if (this.drawCameraGrid) { DrawingHelper.drawGrid(ctx, this.cameraTrns, cameraSideView, positions); }

        DrawingHelper.drawCameras(ctx, this.cameraTrns, cameraSideView, cameras, true, true);
        DrawingHelper.drawZLine(ctx, this.cameraTrns, this.cmVals.getCameraCrossing(), "#a0a0a0", 'crossing', 5);
        DrawingHelper.drawZLine(ctx, this.cameraTrns, 0, "#40f040", 'focus', 15);
        DrawingHelper.drawScene(ctx, this.cameraTrns, cameraSideView, this.scene);
        DrawingHelper.drawRulers(ctx, this.cameraTrns, cameraSideView, positions, this.cameraCanvasUnit);
        this.cameras = cameras;
        this.cmVals.setCameras(cameras);
    }
    /**
     * Creates object for visible border in Images view.
     * @private
     * @param {camerasType} cameras
     * @return {imagesType}
     */
    _cameraBorderImages(cameras: camerasType): imagesType {
        let images = [];
        let h = this.cmVals.getSensorHeight() / this.cmVals.getSensorWidth();
        for (let c = 0; c < cameras.length; c++)
            images.push([[[-1, -h], [1, -h], [1, h], [-1, h]]]);
        return images;
    }
    /**
     * Function used to render Images view visualization.
     * @public
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    renderImagesVisualization(ctx: CanvasRenderingContext2D, width: number, height: number) {
        DrawingHelper.clearCanvasWithCustomColor(ctx, width, height, "#808080");
        let corner1, corner2;
        corner1 = vecOpr.transform2d([-1, -1 / this.DAW.getDisplayAspect()], this.imagesTrns, 'xz');
        corner2 = vecOpr.transform2d([1, 1 / this.DAW.getDisplayAspect()], this.imagesTrns, 'xz');
        ctx.fillRect(corner1[0], corner1[1], corner2[0] - corner1[0], corner2[1] - corner1[1]);
        // create and draw frames of the camera sensors
        // create rectangle definitions of sensor size that are going to be
        // drawn in the display preview
        let images = this._cameraBorderImages(this.cameras);
        photoTransformationsHelper.transformImages(images);
        DrawingHelper.drawImages(ctx, this.imagesTrns, this.cameras, images, [DrawingHelper.createDrawableObject(objTypeIdx.square)], 0, 3);
        // calculate and draw actual images
        images = VisualizationBuilder._calculateImages(this.cameras, this.scene);
        photoTransformationsHelper.transformImages(images);
        DrawingHelper.drawImages(ctx, this.imagesTrns, this.cameras, images, this.scene, 3, 1);
        this.images = images;
    }
}

const visualizationBuilder = new VisualizationBuilder();
export default visualizationBuilder;