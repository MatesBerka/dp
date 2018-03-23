// @flow
import { displayTypes } from '../data_collections/DisplayTypes.js';
import { unitIdx } from '../data_collections/UnitsDefinition.js';
import {inputTypes, sliderTypes} from "../data_collections/ControlsTypes";
import Generic from "./Generic";

/**
 * @classdesc Class representing display and viewer settings.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends Generic
 */
export default class DisplayAndViewer extends Generic {
    // static variables
    static viewingComfortControl: [number, number, number, number, number, number] = [0,10,sliderTypes.lin,1,1,inputTypes.number];
    static displayStereoPPLControl: [number, number, number, number, number, number] = [2,100000,sliderTypes.lin,1,1,inputTypes.number];
    static displayCameraLeftControl: [number, number, number, number, number, number] = [1,100,sliderTypes.lin,1,1,inputTypes.number];
    static displayCameraOffsetControl: [number, number, number, number, number, number] = [1,100,sliderTypes.lin,1,1,inputTypes.number];
    static displayLPIControl: [number, number, number, number, number, number] = [1,200,sliderTypes.lin,0.1,10,inputTypes.number];
    static displayDPIControl: [number, number, number, number, number, number] = [1,10000,sliderTypes.lin,0.1,10,inputTypes.number];
    static displayViewAngleControl: [number, number, number, number, number, number] = [1,100,sliderTypes.lin,1,1,inputTypes.number];
    static headOptimalDistanceControl: [number, number, number, number, number, number] = [1,100,sliderTypes.log,1,1,inputTypes.number];
    static displayWidthControl: [number, number, number, number, number, number] = [1,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static displayAspectControl: [number, number, number, number, number, number] = [0.1,10,sliderTypes.log,0.01,100,inputTypes.number];
    static headDistanceControl: [number, number, number, number, number, number] = [0.1,10,sliderTypes.log,0.01,100,inputTypes.number];
    static headPositionControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    // instance variables
    displayType: string = displayTypes.stereoscopic;
    // stereoscopic display options
    displayStereoPPL: number = 1920; // pixels per line
    displayCameraLeft: number = 1; // camera (image) number for the left eye (numbered from 1)
    displayCameraOffset: number = 1; // for the right eye: displayCameraLeft + displayCameraOffset
    // lenticular display options
    displayLPI: number = 40;
    displayDPI: number = 720;
    displayViewAngle: number = 49;
    displayViewAngleUnit: number = unitIdx.deg;
    headOptimalDistance: number = 0.4;
    headOptimalDistanceUnit: number = unitIdx.cm;
    // computed
    displayPPL: number = 1920;
    // general
    viewingComfort: number = 5;
    displayWidth: number = 0.30;
    displayWidthUnit: number = unitIdx.cm;
    displayAspect: number = 1.5;
    headDistance: number = 0.5;
    headDistanceUnit: number = unitIdx.m;
    headPosition: number = 0;
    headPositionUnit: number = unitIdx.cm;
    // these are currently unchangeable
    eyesSeparation: number = 0.063;
    eyesSeparationUnit: number = unitIdx.mm;
    mechanicalPitch: number = 0.0254 / this.displayLPI;
    mechanicalPitchUnit: number = unitIdx.m;
    displayDepth: number = this.mechanicalPitch  / (2 * Math.tan(this.displayViewAngle * Math.PI / 360));
    displayDepthUnit: number = unitIdx.m;
    visualPitch: number = this.mechanicalPitch * (1 + this.displayDepth / this.headOptimalDistance);
    visualPitchUnit: number = unitIdx.m;
    /**
     * @override
     */
    getCopy(): DisplayAndViewer {
        let copy = new DisplayAndViewer();
        copy.displayType = this.displayType;
        copy.viewingComfort = this.viewingComfort;
        // stereoscopic display options
        copy.displayStereoPPL = this.displayStereoPPL;
        copy.displayCameraLeft = this.displayCameraLeft;
        copy.displayCameraOffset = this.displayCameraOffset;
        // lenticular display options
        copy.displayLPI = this.displayLPI;
        copy.displayDPI = this.displayDPI;
        copy.displayViewAngle = this.displayViewAngle;
        copy.displayViewAngleUnit = this.displayViewAngleUnit;
        copy.headOptimalDistance = this.headOptimalDistance;
        copy.headOptimalDistanceUnit = this.headOptimalDistanceUnit;
        // general
        copy.displayPPL = this.displayPPL;
        copy.displayWidth = this.displayWidth;
        copy.displayWidthUnit = this.displayWidthUnit;
        copy.displayAspect = this.displayAspect;
        copy.headDistance = this.headDistance;
        copy.headDistanceUnit = this.headDistanceUnit;
        copy.headPosition = this.headPosition;
        copy.headPositionUnit = this.headPositionUnit;
        // these are currently unchangeable
        copy.eyesSeparation = this.eyesSeparation;
        copy.eyesSeparationUnit = this.eyesSeparationUnit;
        copy.mechanicalPitch = this.mechanicalPitch;
        copy.mechanicalPitchUnit = this.mechanicalPitchUnit;
        copy.displayDepth = this.displayDepth;
        copy.displayDepthUnit = this.displayDepthUnit;
        copy.visualPitch = this.visualPitch;
        copy.visualPitchUnit = this.visualPitchUnit;

        return copy;
    }
    /**
     * @description Getters and Setters for entity values.
     */
    static getViewingComfortControl(val: number): number {
        return DisplayAndViewer.viewingComfortControl[val];
    }
    static getDisplayStereoPPLControl(val: number): number {
        return DisplayAndViewer.displayStereoPPLControl[val];
    }
    static getDisplayCameraLeftControl(val: number): number {
        return DisplayAndViewer.displayCameraLeftControl[val];
    }
    static getDisplayCameraOffsetControl(val: number): number {
        return DisplayAndViewer.displayCameraOffsetControl[val];
    }
    static getDisplayLPIControl(val: number): number {
        return DisplayAndViewer.displayLPIControl[val];
    }
    static getDisplayDPIControl(val: number): number {
        return DisplayAndViewer.displayDPIControl[val];
    }
    static getDisplayViewAngleControl(val: number): number {
        return DisplayAndViewer.displayViewAngleControl[val];
    }
    static getHeadOptimalDistanceControl(val: number): number {
        return DisplayAndViewer.headOptimalDistanceControl[val];
    }
    static getDisplayWidthControl(val: number): number {
        return DisplayAndViewer.displayWidthControl[val];
    }
    static getDisplayAspectControl(val: number): number {
        return DisplayAndViewer.displayAspectControl[val];
    }
    static getHeadDistanceControl(val: number): number {
        return DisplayAndViewer.headDistanceControl[val];
    }
    static getHeadPositionControl(val: number): number {
        return DisplayAndViewer.headPositionControl[val];
    }
    getDisplayType(): string {
        return this.displayType;
    }
    getViewingComfort(): number {
        return this.viewingComfort;
    }
    getDisplayStereoPPL(): number {
        return this.displayStereoPPL;
    }
    getDisplayCameraLeft(): number {
        return this.displayCameraLeft;
    }
    getDisplayCameraOffset(): number {
        return this.displayCameraOffset;
    }
    getDisplayLPI(): number {
        return this.displayLPI;
    }
    getDisplayDPI(): number {
        return this.displayDPI;
    }
    getDisplayViewAngle(): number {
        return this.displayViewAngle;
    }
    getHeadOptimalDistance(): number {
        return this.headOptimalDistance;
    }
    getDisplayPPL(): number {
        return this.displayPPL;
    }
    getDisplayWidth(): number {
        return this.displayWidth;
    }
    getDisplayAspect(): number {
        return this.displayAspect;
    }
    getHeadDistance(): number {
        return this.headDistance;
    }
    getHeadPosition(): number {
        return this.headPosition;
    }
    getEyesSeparation(): number {
        return this.eyesSeparation;
    }
    getMechanicalPitch(): number {
        return this.mechanicalPitch;
    }
    getDisplayDepth(): number {
        return this.displayDepth;
    }
    getVisualPitch(): number {
        return this.visualPitch;
    }
    getDisplayViewAngleUnit(): number {
        return this.displayViewAngleUnit;
    }
    getHeadOptimalDistanceUnit(): number {
        return this.headOptimalDistanceUnit;
    }
    getDisplayWidthUnit(): number {
        return this.displayWidthUnit;
    }
    getHeadDistanceUnit(): number {
        return this.headDistanceUnit;
    }
    getHeadPositionUnit(): number {
        return this.headPositionUnit;
    }
    getEyesSeparationUnit(): number {
        return this.eyesSeparationUnit;
    }
    getMechanicalPitchUnit(): number {
        return this.mechanicalPitchUnit;
    }
    getDisplayDepthUnit(): number {
        return this.displayDepthUnit;
    }
    getVisualPitchUnit(): number {
        return this.visualPitchUnit;
    }
    getDisplayPPI(): [number, number, number, number] {
        return [(this.displayPPL / (this.displayWidth * 100 / 2.54)), 3, 0, 0];
    }
    _getViewerAngle(): number {
        return  2 * Math.atan(this.displayWidth / (2 * this.headDistance)) * 180 / Math.PI;
    }
    getDisplayPPDeg(): [number, number, number, number] {
        return [(this.displayPPL / this._getViewerAngle()), 3, 15, 120];
    }
    getViewerAngle(): [number, number, number, number] {
        return [this._getViewerAngle(), 4, 0, 0];
    }
    getIdealDisplayDistance(): string {
        return (this.displayWidth * Math.sqrt(1 + 1/(this.displayAspect*this.displayAspect))  * 1.3 + 0.25).toPrecision(3);
    }
    setDisplayType(value: string) {
        this.displayType = value;
        if (this.displayType === displayTypes.stereoscopic) {
            this.displayPPL = this.displayStereoPPL;
        } else if (this.displayType === displayTypes.lenticular) {
            this.displayPPL = this.displayWidth / 0.0254 * this.displayDPI;
        }
    }
    setViewingComfort(value: number) {
        this.viewingComfort = value;
    }
    setDisplayStereoPPL(value: number) {
        this.displayStereoPPL = value;
        if (this.displayType === displayTypes.stereoscopic)
            this.displayPPL = value;
    }

    _setDisplayCameraLeftOffset(left: number, offset: number, cameras: number) {
        // left should be between 1 and cameras
        if (left < 1) { left  = 1; } else if (left > cameras) { left = cameras; }
        if (offset > cameras - 1) { offset = cameras - 1; }  else if (offset < 1 - cameras) { offset = 1 - cameras; }
        if (left + offset > cameras) {
            // left is positive and <= cameras, i.e. offset must be positive
            left = cameras - offset;
            if (left < 1) { left = 1;  offset = cameras - 1; }
        }
        if (left + offset < 1) {
            // left is positive => offset must be negative
            left = 1 - offset;
            if (left > cameras) {
                left = cameras;
                offset = cameras - 1;
            }
        }
        this.displayCameraOffset = offset;
        this.displayCameraLeft = left;
    }

    setDisplayCameraLeft(value: number, camerasCount: number) {
        this._setDisplayCameraLeftOffset(value, this.displayCameraOffset, camerasCount);
    }
    importDisplayCameraLeft(value: number) {
        this.displayCameraLeft = value;
    }
    setDisplayCameraOffset(value: number, camerasCount: number) {
        this._setDisplayCameraLeftOffset(this.displayCameraLeft, value, camerasCount);
    }
    importDisplayCameraOffset(value: number) {
        this.displayCameraOffset = value;
    }
    setDisplayLPI(value: number) {
        this.displayLPI = value;
        this.mechanicalPitch = 0.0254 / this.displayLPI;
        this.displayDepth = this.mechanicalPitch  / (2 * Math.tan(this.displayViewAngle * Math.PI / 360));
        this.visualPitch = this.mechanicalPitch * (1 + this.displayDepth / this.headOptimalDistance);
    }
    setDisplayDPI(value: number) {
        this.displayDPI = value;
        if (this.displayType === displayTypes.lenticular)
            this.displayPPL = this.displayWidth / 0.0254 * value;
    }
    setDisplayViewAngle(value: number) {
        this.displayViewAngle = value;
        this.displayDepth = this.mechanicalPitch  / (2 * Math.tan(this.displayViewAngle * Math.PI / 360));
        this.visualPitch = this.mechanicalPitch * (1 + this.displayDepth / this.headOptimalDistance);
    }
    setHeadOptimalDistance(value: number) {
        this.headOptimalDistance = value;
        this.visualPitch = this.mechanicalPitch * (1 + this.displayDepth / this.headOptimalDistance);
    }
    setDisplayWidth(value: number) {
        this.displayWidth = value;
        if (this.displayType === displayTypes.lenticular)
            this.displayPPL = value / 0.0254 * this.displayDPI;
    }
    setDisplayAspect(value: number) {
        this.displayAspect = value;
    }
    setHeadDistance(value: number) {
        this.headDistance = value;
    }
    setHeadPosition(value: number) {
        this.headPosition = value;
    }
    setEyesSeparation(value: number) {
        this.eyesSeparation = value;
    }
    setDisplayDepth(value: number) {
        this.displayDepth = value;
    }
    setVisualPitch(value: number) {
        this.visualPitch = value;
    }
    setDisplayViewAngleUnit(value: number) {
        this.displayViewAngleUnit = value;
    }
    setHeadOptimalDistanceUnit(value: number) {
        this.headOptimalDistanceUnit = value;
    }
    setDisplayWidthUnit(value: number) {
        this.displayWidthUnit = value;
    }
    setHeadDistanceUnit(value: number) {
        this.headDistanceUnit = value;
    }
    setMechanicalPitch(value: number) {
        this.mechanicalPitch = value;
    }
    setMechanicalPitchUnit(value: number) {
        this.mechanicalPitchUnit = value;
    }
    setHeadPositionUnit(value: number) {
        this.headPositionUnit = value;
    }
    setEyesSeparationUnit(value: number) {
        this.eyesSeparationUnit = value;
    }
    setDisplayDepthUnit(value: number) {
        this.displayDepthUnit = value;
    }
    setVisualPitchUnit(value: number) {
        this.visualPitchUnit = value;
    }
}