// @flow
import vecOpr from './VectorOperationsHelper.js'
import { unitDefinition } from '../model/data_collections/UnitsDefinition.js';
import sceneObjectDAO from '../model/SceneObjectDAO.js'

import FineSquare from "../model/drawable_objects/FineSquare.js";
import Point from "../model/drawable_objects/Point.js";
import Square from "../model/drawable_objects/Square.js";
import Cube from "../model/drawable_objects/Cube.js";
import Octahedron from "../model/drawable_objects/Octahedron.js";

import { objTypeIdx } from "../model/data_collections/ObjectTypes.js";
import displayAndViewerDAO from "../model/DisplayAndViewerDAO.js";
import Bust from "../model/drawable_objects/Bust";
import Tree from "../model/drawable_objects/Tree";
import House from "../model/drawable_objects/House";
import Car from "../model/drawable_objects/Car";
import Figure from "../model/drawable_objects/Figure";
import Utils from "../services/ControlsUtils";
import SceneObject from "../model/entities/SceneObject";
import DisplayAndViewer from "../model/entities/DisplayAndViewer";
import type {
    camerasType, displayType, eyesType, imagesType, rulers, ruler, trnsType, vec2, vec3,
    vertices, reconstructionType
} from "../model/data_collections/flowTypes";
import DrawableObject from "../model/drawable_objects/DrawableObject";

/**
 * @classdesc This class contains functions used for drawing primitive objects on canvas.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export class DrawingHelper {
    sceneObjects: SceneObject = sceneObjectDAO.getActiveRecord();
    DAW: DisplayAndViewer = displayAndViewerDAO.getActiveRecord();
    /**
     * Updates used entities according to selected model.
     */
    updateActiveModel() {
        this.sceneObjects = sceneObjectDAO.getActiveRecord();
        this.DAW = displayAndViewerDAO.getActiveRecord();
    }
    /**
     * Create color string representation.
     * @param {[number, number, number]} c
     * @return {string}
     */
    static _calcColor(c: [number, number, number]): string {
        return "rgb(" + Math.round(c[0]*255)  + "," + Math.round(c[1]*255) + "," + Math.round(c[2]*255) + ")";
    }
    /**
     * Draw a 2-D point "p" as a circle of radius "r".
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {vec2} p
     * @param {number} r
     */
    static drawPoint2d(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, p: vec2, r: number) {
        let pt = vecOpr.transform2d(p, trns, view);
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], r, 0, 2*Math.PI);
        ctx.fill();
    }
    /**
     * Draw a 2-D line "ab".
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {vec2} a
     * @param {vec2} b
     */
    static drawLine2d(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, a: vec2, b: vec2) {
        let at = vecOpr.transform2d(a, trns, view);
        let bt = vecOpr.transform2d(b, trns, view);
        ctx.beginPath();
        ctx.moveTo(at[0], at[1]);
        ctx.lineTo(bt[0], bt[1]);
        ctx.stroke();
    }
    /**
     * Draw a 3-D line "al".
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {vec2} a
     * @param {vec2} b
     */
    static drawLine3d(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, a: vec3, b: vec3) {
        let at = vecOpr.transform3d(a, trns, view);
        let bt = vecOpr.transform3d(b, trns, view);
        ctx.beginPath();
        ctx.moveTo(at[0], at[1]);
        ctx.lineTo(bt[0], bt[1]);
        ctx.stroke();
    }
    /**
     * Draw a 3-D point "p" as a circle of radius "r".
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {vec2} p
     * @param {number} r
     */
    static drawPoint3d(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, p: vec3, r: number) {
        let pt = vecOpr.transform3d(p, trns, view);
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], r, 0, 2*Math.PI);
        ctx.fill();
    }
    /**
     * Draw an array of 3-D points.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {vertices} points
     * @param {number} r
     */
    static drawPoints3d(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, points: vertices, r: number) {
        for (let i = 0; i < points.length; i++)
            this.drawPoint3d(ctx, trns, view, points[i], r);
    }
    /**
     * Draw a 3-D quadrilateral.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {[vec3, vec3, vec3, vec3]} quad
     */
    static drawQuad3d(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, quad: [vec3, vec3, vec3, vec3]) {
        let at = vecOpr.transform3d(quad[0], trns, view);
        let bt = vecOpr.transform3d(quad[1], trns, view);
        let ct = vecOpr.transform3d(quad[2], trns, view);
        let dt = vecOpr.transform3d(quad[3], trns, view);
        ctx.beginPath();
        ctx.moveTo(at[0], at[1]);
        ctx.lineTo(bt[0], bt[1]);
        ctx.lineTo(ct[0], ct[1]);
        ctx.lineTo(dt[0], dt[1]);
        ctx.closePath();
        ctx.fill();
    }
    /**
     * Draw a 3-D quadrilateral.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {eyesType} eyes
     * @param {boolean} drawDirections
     * @param {boolean} drawFOV
     */
    static drawEyes(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, eyes: eyesType, drawDirections: boolean, drawFOV: boolean) {
        let clt = [0, 0], headX = 0, headY = 0, eye, cdt, dScale, cldt, crt, tmp, mix = [1, 1, 1];
        ctx.lineWidth = 1;
        let radius = 5;
        let halfScale = 2;
        let scaleX = trns.scaleX / 100 / halfScale;
        let scaleY = trns.scaleY / 100 / halfScale;

        for (let i = eyes.length - 1; i >= 0; i--) {
            eye = eyes[i];
            ctx.fillStyle = DrawingHelper._calcColor(vecOpr.vectLERP(eye.color, mix, 0.85));
            ctx.strokeStyle = DrawingHelper._calcColor(eye.color);
            clt = vecOpr.transform3d(eye.location, trns, view);
            if (i === 0) { // second eye
                headX = clt[0];
                headY -= (headY - clt[1])/2;
            } else {
                headX = clt[0];
                headY = clt[1];
            }
            if (typeof(eye.direction) !== "undefined") {
                // calculate camera vectors
                cdt = vecOpr.transform3dVect(eye.direction, trns, view);
                if (view === 'xz') {
                    crt = vecOpr.transform3dVect(eye.right, trns, view);
                } else {
                    crt = vecOpr.transform3dVect(vecOpr.vectScale(eye.up, 1/eye.aspect), trns, view);
                }
                dScale = (ctx.canvas.width - clt[0]) / cdt[0];
                cdt = vecOpr.vectScale(cdt, dScale);
                crt = vecOpr.vectScale(crt, dScale);
                cldt = (vecOpr.vectAdd(clt, cdt): [number, number]);
                // draw field of view
                if (drawFOV) {
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(clt[0], clt[1]);
                    tmp = (vecOpr.vectAdd(cldt, crt): [number, number]);
                    ctx.lineTo(tmp[0], tmp[1]);
                    tmp = (vecOpr.vectSub(cldt, crt): [number, number]);
                    ctx.lineTo(tmp[0], tmp[1]);
                    ctx.closePath();
                    ctx.fill();
                }
                // draw direction
                if (drawDirections) {
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(clt[0], clt[1]);
                    ctx.lineTo(cldt[0], cldt[1]);
                    ctx.stroke();
                }
            }
            // draw eye
            ctx.beginPath();
            ctx.arc(clt[0], clt[1], radius * scaleX, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(clt[0], clt[1] - radius * scaleY);
            ctx.lineTo(clt[0], clt[1] + radius * scaleY);
            ctx.moveTo(clt[0] - radius * scaleX, clt[1]);
            ctx.lineTo(clt[0] + radius * scaleX, clt[1]);
            ctx.stroke();
            ctx.strokeStyle = "#696969";
            ctx.beginPath();
            ctx.arc(clt[0], clt[1], radius * scaleX, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.strokeStyle = "#696969";
        let headRadius = 4 * radius * scaleX;
        if (view === 'xz') {
            ctx.beginPath();
            ctx.arc(headX - headRadius + radius/4 * scaleX, headY, headRadius, 0, 2 * Math.PI);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.ellipse(headX - headRadius/6, headY + headRadius/2, headRadius/2, headRadius/8, 0, 0, 2 * Math.PI);
            ctx.stroke();
            let alpha = ctx.globalAlpha;
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.ellipse(headX - headRadius/2, headY + headRadius/2, headRadius/2, headRadius, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = "#696969";
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.ellipse(headX - headRadius/2, headY + headRadius/2, headRadius/2, headRadius, 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
    }
    /**
     * Draws cameras/eyes positions
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {camerasType} cameras
     * @param {boolean} drawDirections
     * @param {boolean} drawFOV
     */
    static drawCameras(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, cameras: camerasType,
        drawDirections: boolean, drawFOV: boolean) {
        let i = 0, cycleIndex, c, clt, cdt, crt, dScale, cldt, tmp, mix = [1, 1, 1];
        ctx.lineWidth = 1;
        // draw all cameras in a weird order:
        // numbers 1, 2, 3, ..., last, 0
        // (due to better graphical representation as they use alpha channel)
        cycleIndex = 1;
        while (true) {
            if (cycleIndex < cameras.length) { i = cycleIndex; }
            else if (cycleIndex === cameras.length) { i = 0; }
            else break;
            cycleIndex++;
            ctx.fillStyle = DrawingHelper._calcColor(vecOpr.vectLERP(cameras[i].color, mix, 0.85));
            ctx.strokeStyle = DrawingHelper._calcColor(cameras[i].color);
            c = cameras[i];
            clt = vecOpr.transform3d(c.location, trns, view);
            // eyes do not have direction and other camera vectors
            if (typeof(c.direction) !== "undefined") {
                // calculate camera vectors
                cdt = vecOpr.transform3dVect(c.direction, trns, view);
                if (view === 'xz') {
                    crt = vecOpr.transform3dVect(c.right, trns, view);
                } else {
                    crt = vecOpr.transform3dVect(vecOpr.vectScale(c.up, 1/c.aspect), trns, view);
                }
                dScale = (ctx.canvas.width - clt[0]) / cdt[0];
                cdt = vecOpr.vectScale(cdt, dScale);
                crt = vecOpr.vectScale(crt, dScale);
                cldt = (vecOpr.vectAdd(clt, cdt): [number, number]);
                // draw field of view
                if (drawFOV) {
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(clt[0], clt[1]);
                    tmp = (vecOpr.vectAdd(cldt, crt): [number, number]);
                    ctx.lineTo(tmp[0], tmp[1]);
                    tmp = (vecOpr.vectSub(cldt, crt): [number, number]);
                    ctx.lineTo(tmp[0], tmp[1]);
                    ctx.closePath();
                    ctx.fill();
                }
                // draw direction
                if (drawDirections) {
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(clt[0], clt[1]);
                    ctx.lineTo(cldt[0], cldt[1]);
                    ctx.stroke();
                }
            }

            let scaleX = trns.scaleX / 100;
            let scaleY = trns.scaleY / 100;
            // let ctx.fillStyle
            ctx.fillStyle = "#696969";
            ctx.strokeStyle = "#696969";
            if (view === 'xz') {
                ctx.strokeRect(clt[0] - 7 * scaleX, clt[1] - 5 * scaleY, 5 * scaleX, 10 * scaleY);
                ctx.beginPath();
                ctx.moveTo(clt[0] - 2 * scaleX, clt[1] - 2 * scaleY);
                ctx.lineTo(clt[0] + 5 * scaleX, clt[1] - 3 * scaleY);
                ctx.lineTo(clt[0] + 5 * scaleX, clt[1] + 3 * scaleY);
                ctx.lineTo(clt[0] - 2 * scaleX, clt[1] + 2 * scaleY);
                // small cross
                ctx.moveTo(clt[0] - scaleX, clt[1]);
                ctx.lineTo(clt[0] + scaleX, clt[1]);
                ctx.moveTo(clt[0], clt[1] - scaleY);
                ctx.lineTo(clt[0], clt[1] + scaleY);
                ctx.stroke();
            } else {
                ctx.strokeRect(clt[0] - 7 * scaleX, clt[1] - 3 * scaleY, 5 * scaleX, 6 * scaleY);
                ctx.beginPath();
                ctx.moveTo(clt[0] - 2 * scaleX, clt[1] - 2 * scaleY);
                ctx.lineTo(clt[0] + 4 * scaleX, clt[1] - 3 * scaleY);
                ctx.lineTo(clt[0] + 4 * scaleX, clt[1] + 3 * scaleY);
                ctx.lineTo(clt[0] - 2 * scaleX, clt[1] + 2 * scaleY);
                // small cross
                ctx.moveTo(clt[0] - scaleX, clt[1]);
                ctx.lineTo(clt[0] + scaleX, clt[1]);
                ctx.moveTo(clt[0], clt[1] - scaleY);
                ctx.lineTo(clt[0], clt[1] + scaleY);
                // trigger
                ctx.moveTo(clt[0] - 6 * scaleX, clt[1] - 3 * scaleY);
                ctx.lineTo(clt[0] - 6 * scaleX, clt[1] - 4 * scaleY);
                ctx.lineTo(clt[0] - 4 * scaleX, clt[1] - 4 * scaleY);
                ctx.lineTo(clt[0] - 4 * scaleX, clt[1] - 3 * scaleY);
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1.0;
    }
    /**
     * Draws a line at z=z0 and the cross point.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {number} z0
     * @param {string} color
     * @param {string} description
     * @param {number} descY
     */
    static drawZLine(ctx: CanvasRenderingContext2D, trns: trnsType, z0: number, color: string, description: string, descY: number) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        let tmp = vecOpr.transform3d([0, 0, z0], trns, 'none');
        ctx.beginPath();
        ctx.moveTo(tmp[0], 0);
        ctx.lineTo(tmp[0], ctx.canvas.height);
        ctx.stroke();
        if (description !== '') {
            ctx.font = "10px Arial";
            ctx.textAlign = "left";
            ctx.fillText(description, tmp[0] + 5, ctx.canvas.height - descY);
        }
    }
    /**
     * Draws a line at z=z0 and the cross point.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {camerasType} cameras array of camera definitions, just colors are used
     * @param {imagesType} images array of points coordinates to draw
     * @param {Array<DrawableObject>} scene definition of the scene used to generate "images"; used for line connectivity
     * @param {number} pointR radius of point circles to draw
     * @param {number} lineWidth width of lines to draw
     */
    static drawImages(ctx: CanvasRenderingContext2D, trns: trnsType, cameras: camerasType, images: imagesType,
        scene: Array<DrawableObject>, pointR: number, lineWidth: number) {
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = lineWidth;
        // process images in the order 1, 2, 3, ..., last, 0
        let i, ic = 0, o, origLineWidth = ctx.lineWidth, cycleIndex = 1, edges;
        while (true) {
            if (cycleIndex < cameras.length) { ic = cycleIndex; }
            else if (cycleIndex === cameras.length) { ic = 0; }
            else break;
            cycleIndex++;

            ctx.fillStyle = DrawingHelper._calcColor(cameras[ic].color);
            ctx.strokeStyle = DrawingHelper._calcColor(cameras[ic].color);
            let oimage = images[ic];
            for (o = 0; o < oimage.length; o++) {
                // just for easier array access
                let pimage = oimage[o];
                // draw points
                for (i = 0; i < pimage.length; i++)
                    DrawingHelper.drawPoint2d(ctx, trns, 'yz', pimage[i], pointR);
                // draw lines
                edges = scene[o].getEdges();
                for (i = 0; i < edges.length; i++)
                    DrawingHelper.drawLine2d(ctx, trns, 'yz', pimage[edges[i][0]], pimage[edges[i][1]]);
            }
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = origLineWidth;
    }
    /**
     * Draws a display as a thick line.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {displayType} display
     */
    drawDisplay(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, display: displayType) {
        let displayWidth, displayCenter =  vecOpr.transform3d(display.center, trns, view);

        if (view === 'xz') {
            displayWidth = 2 * display.right[0] * trns.scaleY;
        } else {
            displayWidth = 2 * display.up[1] / display.aspect * trns.scaleY;
        }

        let displayThickness = 6;
        ctx.fillStyle = DrawingHelper._calcColor([0.4, 0.8, 0.4]);
        ctx.fillRect(displayCenter[0] - displayThickness/2, displayCenter[1] - displayWidth/2,
            displayThickness, displayWidth);

        if (view === 'xz') {
            if (this.DAW.getDisplayType() === 'lenticular') {
                let cellWidth = this.DAW.getMechanicalPitch() * trns.scaleY;
                let cellCount = Math.floor(displayWidth / cellWidth);
                let cellCountHalf = Math.floor(cellCount / 2), c;
                ctx.fillStyle = DrawingHelper._calcColor([0.2, 0.4, 0.2]);
                for (c = -cellCountHalf; c < cellCountHalf; c+=2)
                    ctx.fillRect(displayCenter[0] - displayThickness/2, displayCenter[1] - cellWidth/2 + c * cellWidth,
                        displayThickness, cellWidth);
            }
        }
    }
    /**
     * Draws a display as a thick line.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {eyesType} eyes
     * @param {displayType} display
     * @param {imagesType} images
     * @param {reconstructionType} reconstruction
     */
    static drawReconstruction(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, eyes: eyesType, display: displayType,
        images: imagesType, reconstruction: reconstructionType) {
        let i, o, obj, ie;
        let mix = [1, 1, 1];
        let pointR = 3;
        let pd;

        // cycle through all objects
        for (o = 0; o < reconstruction.length; o++) {
            obj = reconstruction[o];
            // cycle through all object's points
            for (i = 0; i < obj.length; i++) {
                if (images.length > 2) {
                    // draw image points for auto stereoscopic display
                    for (ie = 0; ie < images.length; ie++) {
                        ctx.fillStyle = DrawingHelper._calcColor([0.8, 0.8, 0.8]);
                        // calculate point on display position
                        pd = vecOpr.vectAdd(display.center, vecOpr.vectAdd(
                                vecOpr.vectScale(display.right, images[ie][o][i][0]),
                                vecOpr.vectScale(display.up, images[ie][o][i][1])
                            )
                        );
                        // draw point on display
                        DrawingHelper.drawPoint3d(ctx, trns, view, pd, pointR/2);
                    }
                } else {
                    // draw image points + rays for stereoscopic display
                    for (ie = 0; ie < 2; ie++) {
                        ctx.fillStyle = DrawingHelper._calcColor(eyes[ie].color);
                        // calculate point on display position
                        pd =(vecOpr.vectAdd(display.center, vecOpr.vectAdd(
                                vecOpr.vectScale(display.right, images[ie][o][i][0]),
                                vecOpr.vectScale(display.up, images[ie][o][i][1])
                            )
                        ): vec3);
                        // draw reconstruction ray
                        ctx.strokeStyle = DrawingHelper._calcColor(vecOpr.vectLERP(eyes[ie].color, mix, 0.7));
                        if (obj[i][2] > display.center[2]) // reconstructed point behind the display
                            DrawingHelper.drawLine3d(ctx, trns, view, eyes[ie].location, obj[i]);
                        else // reconstructed point in front of display
                            DrawingHelper.drawLine3d(ctx, trns, view, eyes[ie].location, pd);
                        DrawingHelper.drawPoint3d(ctx, trns, view, pd, pointR);  // draw point on display
                    }
                }
            }
        }
    }
    /**
     * Draws vertical grid into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} ticStart
     * @param {number} ticEnd
     */
    static drawVertGrid(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: ruler, ticStart: number, ticEnd: number) {
        let i, p;
        ctx.beginPath();
        for (i = 0; i < positions.length; i++) {
            p = vecOpr.transform2d([positions[i], 0], trns, view);
            ctx.moveTo(p[0], ticStart);
            ctx.lineTo(p[0], ticEnd);
        }
        ctx.stroke();
    }
    /**
     * Draws horizontal grid into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} ticStart
     * @param {number} ticEnd
     */
    static drawHorizGrid(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: ruler, ticStart: number, ticEnd: number) {
        let i, p;
        ctx.beginPath();
        for (i = 0; i < positions.length; i++) {
            p = vecOpr.transform2d([0, positions[i]], trns, view);
            ctx.moveTo(ticStart, p[1]);
            ctx.lineTo(ticEnd, p[1]);
        }
        ctx.stroke();
    }
    /**
     * Draws vertical grid description into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} unitIdx
     */
    static drawVertGridDesc(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: ruler, unitIdx: number) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        let factor = unitDefinition[unitIdx].value;
        let delta = positions[1] - positions[0];
        let iMin, iStep;
        let tmp;
        let p;
        if (vecOpr.getDeltaTrns(delta, trns) < 40) {
            tmp = Math.round(Math.abs(positions[0] / delta));
            if (tmp % 2 === 0) { iMin = 0; } else { iMin = 1; }
            iStep = 2;
        } else {
            iMin = 0;
            iStep = 1;
        }

        for (let i = iMin; i < positions.length; i += iStep) {
            p = vecOpr.transform2d([positions[i], 0], trns, view);
            ctx.fillText(Utils.niceNumber(positions[i]/factor), p[0], 16);
        }
    }
    /**
     * Draws horizontal grid description into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} unitIdx
     */
    static drawHorizGridDesc(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: ruler, unitIdx: number) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.textAlign = "left";
        let factor = unitDefinition[unitIdx].value, p;
        for (let i = 0; i < positions.length; i++) {
            p = vecOpr.transform2d([0, positions[i]], trns, view);
            ctx.fillText(Utils.niceNumber(positions[i]/factor), 10, p[1]+3);
        }
    }
    /**
     * Draws vertical ruler into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} unitIdx
     */
    static drawVertRuler(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: ruler, unitIdx: number) {
        ctx.strokeStyle = "#000000";
        DrawingHelper.drawHorizGrid(ctx, trns, view, positions, 0, 6);
        if (vecOpr.getDeltaTrns((positions[1] - positions[0])/2, trns) >= 40) {
            DrawingHelper.drawHorizGrid(ctx, trns, view, vecOpr.refinePositions(positions, 2), 0, 6);
            DrawingHelper.drawHorizGrid(ctx, trns, view, vecOpr.refinePositions(positions, 10), 0, 3);
        }
        DrawingHelper.drawHorizGridDesc(ctx, trns, view, positions, unitIdx);
    }
    /**
     * Draws horizontal ruler into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} unitIdx
     */
    static drawHorizRuler(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: ruler, unitIdx: number) {
        ctx.strokeStyle = "#000000";
        DrawingHelper.drawVertGrid(ctx, trns, view, positions, 0, 6);
        if (vecOpr.getDeltaTrns((positions[1] - positions[0])/2, trns) >= 40) {
            DrawingHelper.drawVertGrid(ctx, trns, view, vecOpr.refinePositions(positions, 2), 0, 6);
            DrawingHelper.drawVertGrid(ctx, trns, view, vecOpr.refinePositions(positions, 10), 0, 3);
        }
        DrawingHelper.drawVertGridDesc(ctx, trns, view, positions, unitIdx);
    }
    /**
     * Draws grid into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     */
    static drawGrid(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: rulers) {
        let lw = ctx.lineWidth;
        ctx.strokeStyle = "#c0c0c0";
        ctx.lineWidth = 0.5;
        DrawingHelper.drawVertGrid(ctx, trns, view, positions[0], 0, ctx.canvas.height);
        DrawingHelper.drawHorizGrid(ctx, trns, view, positions[1], 0, ctx.canvas.width);
        if (vecOpr.getDeltaTrns((positions[0][1] - positions[0][0])/2, trns) >= 40) {
            DrawingHelper.drawVertGrid(ctx, trns, view, vecOpr.refinePositions(positions[0], 2), 0, ctx.canvas.height);
            DrawingHelper.drawHorizGrid(ctx, trns, view, vecOpr.refinePositions(positions[1], 2), 0, ctx.canvas.width);
        }
        ctx.lineWidth = lw;
    }
    /**
     * Draws rulers into entered context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {ruler} positions
     * @param {number} unitIdx
     */
    static drawRulers(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, positions: rulers, unitIdx: number) {
        DrawingHelper.drawHorizRuler(ctx, trns, view, positions[0], unitIdx);
        DrawingHelper.drawVertRuler(ctx, trns, view, positions[1], unitIdx);
    }
    /**
    * for a lenticular/parallax barrier display of depth d:
    * draw a line from [v1, d] (at the display element)
    *  through [m1, 0] (the pinhole)
    * draw a line from [v2, d] through [m2, 0]
    * calculate intersection of the lines [x, z]
    * derivation:
    * define x1 = m1 - x, x2 = m2 - x
    * (1)=>  x1 - x2 = m1 - m2 (= e.g. display width)
    * moreover,
    * x1 / z = (x1 - m1)/d,
    * x2 / z = (x2 - m2)/d
    * => x1 / (v1 - m1) = x2 / (v2 - m2)
    * after substitution from (1)
    * x2 = (v2 - m2)*(m1 - m2)/(v1 - m1 - v2 + m2)
    * Draws rulers into entered context.
    * @param {number} m1
    * @param {number} v1
    * @param {number} m2
    * @param {number} v2
    * @param {number} d
    * @return {[number, number]}
    */
    static _calculateViewZoneCorner(m1: number, v1: number, m2: number, v2: number, d: number): [number, number] {
        let x2 = (v2 - m2)*(m1 - m2)/(v1 - m1 - v2 + m2);
        let x = m2 - x2;
        let z = /* x2 * d / (v2 - m2); */ d * (m1 - m2)/(v1 - m1 - v2 + m2);
        return [x, -z];
    }
    /**
    * for a lenticular/parallax barrier display of depth d:
    * calculate a zone of visibility of both slices
    * v1 (at a display from v1min to v1max and v2)
    * the result should be a quadrilateral
     * @param {number} m1
     * @param {number} v1min
     * @param {number} v1max
     * @param {number} m2
     * @param {number} v2min
     * @param {number} v2max
     * @param {number} d
     * @return {[[number, number], [number, number], [number, number], [number, number]]}
     */
    static _calculateViewZone(m1: number, v1min: number, v1max: number, m2: number, v2min: number, v2max: number, d: number):
        [[number, number], [number, number], [number, number], [number, number]] {
        let pNear =  DrawingHelper._calculateViewZoneCorner(m1, v1min, m2, v2max, d);
        let pRight = DrawingHelper._calculateViewZoneCorner(m1, v1max, m2, v2max, d);
        let pLeft =  DrawingHelper._calculateViewZoneCorner(m1, v1min, m2, v2min, d);
        let pFar  =  DrawingHelper._calculateViewZoneCorner(m1, v1max, m2, v2min, d);
        return [pRight, pNear, pLeft, pFar];
    }
    /**
     * Draws visibility lines into entered view.
     * @public
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {camerasType} cameras
     */
    drawVisibilityZones(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, cameras: camerasType) {
        if (this.DAW.getDisplayType() === 'lenticular') {
            let mix = [1, 1, 1];
            let camerasCount = cameras.length;
            let cIndex;
            let depth = this.DAW.getDisplayDepth();
            let mechanicalPitch = this.DAW.getMechanicalPitch();
            let visualPitch = this.DAW.getVisualPitch();
            // let slitWidth = visualPitch / camerasCount;
            let lensesCountHalf = Math.round(0.5 * this.DAW.getDisplayWidth() / mechanicalPitch);
            let slitStartFraction, slitEndFraction;

            for (cIndex = 0; cIndex < camerasCount; cIndex++) {
                slitStartFraction = cIndex / camerasCount;
                slitEndFraction = (cIndex + 1) / camerasCount;

                let zone = DrawingHelper._calculateViewZone(-lensesCountHalf*mechanicalPitch,
                    (-lensesCountHalf + slitStartFraction - 0.5)*visualPitch,
                    (-lensesCountHalf + slitEndFraction - 0.5)*visualPitch,
                    lensesCountHalf * mechanicalPitch,
                    (lensesCountHalf + slitStartFraction - 0.5)*visualPitch,
                    (lensesCountHalf + slitEndFraction - 0.5)*visualPitch, depth);
                // images are in reverse order behind the lens
                ctx.fillStyle = DrawingHelper._calcColor((vecOpr.vectLERP(cameras[camerasCount-cIndex-1].color, mix, 0.9): vec3));

                DrawingHelper.drawQuad3d(ctx, trns, view,
                    [[zone[0][0], 0, zone[0][1]],
                        [zone[1][0], 0, zone[1][1]],
                        [zone[2][0], 0, zone[2][1]],
                        [zone[3][0], 0, zone[3][1]]]);
            }
        }
    }
    /**
     * Helper function used to select correct drawable object.
     * @public
     * @param {number} objectType
     * @return {DrawableObject}
     */
    static createDrawableObject(objectType: number): DrawableObject {
        if (objectType === objTypeIdx.point)
            return new Point();
        else if (objectType === objTypeIdx.square)
            return new Square();
        else if (objectType === objTypeIdx.fineSquare)
            return new FineSquare();
        else if (objectType === objTypeIdx.cube)
            return new Cube();
        else if (objectType === objTypeIdx.octahedron)
            return new Octahedron();
        else if (objectType === objTypeIdx.bust)
            return new Bust();
        else if (objectType === objTypeIdx.tree)
            return new Tree();
        else if (objectType === objTypeIdx.house)
            return new House();
        else if (objectType === objTypeIdx.car)
            return new Car();
        else if (objectType === objTypeIdx.figure)
            return new Figure();
        else
            console.error('Missing object creation.');
            return new Point(); // return point as default object
    }
    /**
     * From entered scene entities create array of drawable objects and prepare them for drawing.
     * @public
     */
    createScene() {
        let scene = [], obj, new_obj;
        for (let oi = 0; oi < this.sceneObjects.length; oi++) {
            obj = this.sceneObjects[oi];
            new_obj = DrawingHelper.createDrawableObject(obj.getObjectType());
            new_obj.transformObject(obj);
            scene.push(new_obj);
        }
        return scene;
    }
    /**
     * Draws a scene scene.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @param {string} view
     * @param {Array<DrawableObject>} scene
     */
    static drawScene(ctx: CanvasRenderingContext2D, trns: trnsType, view: string, scene: Array<DrawableObject>) {
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#000000";
        let r = 3, i, vertices, edges, obj;
        for (let oi = 0; oi < scene.length; oi++) {
            obj = scene[oi];
            vertices = obj.getVertices();
            edges = obj.getEdges();
            this.drawPoints3d(ctx, trns, view, vertices, r);
            for (i = 0; i < obj.edges.length; i++)
                this.drawLine3d(ctx, trns, view, vertices[edges[i][0]], vertices[edges[i][1]]);
        }
    }
    /**
     * Clears entered canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    static clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.clearRect(0, 0, width, height);
    }
    /**
     * Clears entered canvas with specified color.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @param {string} color
     */
    static clearCanvasWithCustomColor(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
        // clear screen (grey)
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        // draw the display area (black)
        ctx.fillStyle = "#000000";
    }
}

export const drawingHelper = new DrawingHelper();