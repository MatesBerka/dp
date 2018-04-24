// @flow
import { unitIdx } from '../data_collections/UnitsDefinition.js';
import { sliderTypes, inputTypes } from "../data_collections/ControlsTypes";
import type {cameraType} from "../data_collections/flowTypes";
import vecOpr from '../../helpers/VectorOperationsHelper.js'
import Generic from "./Generic";

/**
 * @classdesc Class representing camera settings.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends Generic
 */
export default class Camera  extends Generic {
    // instance variables
    focalLength: number = 0.025;
    focalLengthUnit: number = unitIdx.mm;
    fNumber: number = 8;
    sensorSizeIdx: string = 'APS-CCanon';
    sensorWidth: number = 22.3e-3;
    sensorWidthUnit: number = unitIdx.mm;
    sensorHeight: number = 14.9e-3;
    sensorHeightUnit: number = unitIdx.mm;
    cameraDistance: number = 1;
    cameraDistanceUnit: number = unitIdx.m;
    cameraSeparation: number = 0.063;
    keepCamerasAngle: boolean = false;
    keepCamerasAngleRatio: number = 0;
    keepObjectSize: boolean = false;
    keepObjectSizeRatio: number = 0;
    cameraSeparationUnit: number = unitIdx.mm;
    cameraCrossing: number = 0;
    cameraCrossingUnit: number = unitIdx.mm;
    cameraHeight: number = 0;
    cameraHeightUnit: number = unitIdx.mm;
    camerasCount: number = 2;
    cameraType: string = 'toe-in';
    focalLengthCorrection: boolean = false;
    acuityAngle: number = (2 / 60) * Math.PI / 180; // static value for this version
    sensorPixelWidth: number = 5e-6; // static value for this version
    // this value is computed in VisualizationBuilder
    cameras: Array<cameraType> | null = null;
    // static variables
    static focalLengthControl: [number, number, number, number, number, number] = [5,1000,sliderTypes.log,1,1,inputTypes.number];
    static fNumberControl: [number, number, number, number, number, number] = [1,64,sliderTypes.log,0.1,10,inputTypes.number];
    static sensorWidthControl: [number, number, number, number, number, number] = [1,101,sliderTypes.lin,0.1,10,inputTypes.number];
    static sensorHeightControl: [number, number, number, number, number, number] = [1,101,sliderTypes.lin,0.1,10,inputTypes.number];
    static cameraDistanceControl: [number, number, number, number, number, number] = [0.1,10,sliderTypes.log,0.1,10,inputTypes.number];
    static cameraSeparationControl: [number, number, number, number, number, number] = [1,200,sliderTypes.log,1,1,inputTypes.number];
    static cameraCrossingControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static cameraHeightControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static camerasCountControl: [number, number, number, number, number, number] = [2,100,sliderTypes.lin,1,1,inputTypes.number];
    /**
     * @override
     */
    getCopy(): Camera {
        let copy = new Camera();
        copy.focalLength = this.focalLength;
        copy.focalLengthUnit = this.focalLengthUnit;
        copy.fNumber = this.fNumber;
        copy.sensorSizeIdx = this.sensorSizeIdx;
        copy.sensorWidth = this.sensorWidth;
        copy.sensorWidthUnit = this.sensorWidthUnit;
        copy.sensorHeight = this.sensorHeight;
        copy.sensorHeightUnit = this.sensorHeightUnit;
        copy.cameraDistance = this.cameraDistance;
        copy.cameraDistanceUnit = this.cameraDistanceUnit;
        copy.cameraSeparation = this.cameraSeparation;
        copy.cameraSeparationUnit = this.cameraSeparationUnit;
        copy.cameraCrossing = this.cameraCrossing;
        copy.cameraCrossingUnit = this.cameraCrossingUnit;
        copy.cameraHeight = this.cameraHeight;
        copy.cameraHeightUnit = this.cameraHeightUnit;
        copy.camerasCount = this.camerasCount;
        copy.cameraType = this.cameraType;
        copy.focalLengthCorrection = this.focalLengthCorrection;
        copy.cameras = this.cameras;
        copy.keepCamerasAngle = this.keepCamerasAngle;
        copy.keepCamerasAngleRatio = this.keepCamerasAngleRatio;
        copy.keepObjectSize = this.keepObjectSize;
        copy.keepObjectSizeRatio = this.keepObjectSizeRatio;

        return copy;
    }
    /**
     * @description Getters and Setters for entity values.
     */
    static getFocalLengthControl(val: number): number {
        return Camera.focalLengthControl[val];
    }
    static getFNumberControl(val: number): number {
        return Camera.fNumberControl[val];
    }
    static getSensorWidthControl(val: number): number {
        return Camera.sensorWidthControl[val];
    }
    static getSensorHeightControl(val: number): number {
        return Camera.sensorHeightControl[val];
    }
    static getCameraDistanceControl(val: number): number {
        return Camera.cameraDistanceControl[val];
    }
    static getCameraSeparationControl(val: number): number {
        return Camera.cameraSeparationControl[val];
    }
    static getCameraCrossingControl(val: number): number {
        return Camera.cameraCrossingControl[val];
    }
    static getCameraHeightControl(val: number): number {
        return Camera.cameraHeightControl[val];
    }
    static getCamerasCountControl(val: number): number {
        return Camera.camerasCountControl[val];
    }
    getSensorSizeIdx(): string {
        return this.sensorSizeIdx;
    }
    getFocalLength(): number {
        return this.focalLength;
    }
    getFocalLengthUnit(): number {
        return this.focalLengthUnit;
    }
    getFNumber(): number {
        return this.fNumber;
    }
    getSensorWidth(): number {
        return this.sensorWidth;
    }
    getSensorWidthUnit(): number {
        return this.sensorWidthUnit
    }
    getSensorHeightUnit(): number {
        return this.sensorHeightUnit
    }
    getSensorHeight(): number {
        return this.sensorHeight;
    }
    getCameraDistance(): number {
        return this.cameraDistance;
    }
    getCameraDistanceUnit(): number {
        return this.cameraDistanceUnit;
    }
    getCameraSeparation(): number {
        return this.cameraSeparation;
    }
    getCameraSeparationUnit(): number {
        return this.cameraSeparationUnit;
    }
    getCameraCrossing(): number {
        return this.cameraCrossing;
    }
    getCameraCrossingUnit(): number {
        return this.cameraCrossingUnit;
    }
    getCameraHeight(): number {
        return this.cameraHeight;
    }
    getCameraHeightUnit(): number {
        return this.cameraHeightUnit;
    }
    getCamerasCount(): number {
        return this.camerasCount;
    }
    getCameraType(): string {
        return this.cameraType;
    }
    getFocalLengthCorrection(): boolean {
        return this.focalLengthCorrection;
    }
    getCameraAngle(): string {
        //  Use the commented definition of the camera FOV if focusing is not taken into account.
        //	var cameraAngle = 2 * Math.atan(cameraDefinition.sensorWidth.value
        //		/ (2 * cameraDefinition.focalLength.value)) * 180 / Math.PI;
        if (this.cameras !== null) {
            if (vecOpr.vectLength(this.cameras[0].direction) > 0) {
                // $FlowFixMe
                let cameraAngle = 2 * Math.atan(vecOpr.vectLength(this.cameras[0].right) / vecOpr.vectLength(this.cameras[0].direction)) * 180 / Math.PI;
                return cameraAngle.toFixed(4) + '°';
            } else {
                return 'Unable to focus!';
            }
        } else { // value will be computed
            return '';
        }
    }
    getAcuityAngle(): number {
        return this.acuityAngle;
    }
    getSensorPixelWidth(): number {
        return this.sensorPixelWidth;
    }
    setCameras(cameras: Array<cameraType>) {
        this.cameras = cameras;
    }
    setSensorSizeIdx(value: string) {
        let w = 0, h = 0;
        switch (value) {
            case '35mm':        w = 36.0e-3; h = 24.0e-3; break;
            case 'APS-HCanon':  w = 27.9e-3; h = 18.6e-3; break;
            case 'APS-CNikon':  w = 23.6e-3; h = 15.6e-3; break;
            case 'APS-CCanon':  w = 22.3e-3; h = 14.9e-3; break;
            case '4/3':         w = 17.3e-3; h = 13.0e-3; break;
            case '1/3':         w =  4.8e-3; h =  3.6e-3; break;
            case '--':          w = this.sensorWidth; h = this.sensorHeight; break; // keep old values
            default: console.error('Unknown sensor');
        }
        this.sensorHeight = h;
        this.sensorWidth = w;
        this.sensorSizeIdx = value;
    }
    setFocalLength(value: number) {
        this.focalLength = value;
        if (this.keepObjectSize)
            this.cameraDistance = this.focalLength / this.keepObjectSizeRatio;
    }
    setFocalLengthUnit(value: number) {
        this.focalLengthUnit = value;
    }
    setFNumber(value: number) {
        this.fNumber = value;
    }
    setSensorWidth(value: number) {
        this.sensorSizeIdx = '--';
        this.sensorWidth = value;
    }
    setSensorHeight(value: number) {
        this.sensorSizeIdx = '--';
        this.sensorHeight = value;
    }
    setCameraDistance(value: number) {
        this.cameraDistance = value;
        if (this.keepCamerasAngle)
            this.cameraSeparation = (this.cameraDistance + this.cameraCrossing) * this.keepCamerasAngleRatio;
        if (this.keepObjectSize)
            this.focalLength = this.keepObjectSizeRatio * this.cameraDistance;
    }
    setKeepCamerasAngle(value: boolean) {
        this.keepCamerasAngle = value;
        if (this.keepCamerasAngle)
            this.keepCamerasAngleRatio = this.cameraSeparation / (this.cameraDistance + this.cameraCrossing);
    }
    setKeepObjectSize(value: boolean) {
        this.keepObjectSize = value;
        if (this.keepObjectSize)
            this.keepObjectSizeRatio = this.focalLength / this.cameraDistance;
    }
    getKeepCamerasAngle(): boolean {
        return this.keepCamerasAngle;
    }
    getKeepObjectSize(): boolean {
        return this.keepObjectSize;
    }
    setCameraDistanceUnit(value: number) {
        this.cameraDistanceUnit = value;
    }
    setCameraSeparation(value: number) {
        this.cameraSeparation = value;
        if (this.keepCamerasAngle)
            this.cameraDistance = this.cameraSeparation / this.keepCamerasAngleRatio;
    }
    setCameraSeparationUnit(value: number) {
        this.cameraSeparationUnit = value;
    }
    setCameraCrossing(value: number) {
        this.cameraCrossing = value;
        if (this.keepCamerasAngle)
            this.cameraSeparation = (this.cameraDistance + this.cameraCrossing) * this.keepCamerasAngleRatio;
    }
    setCameraCrossingUnit(value: number) {
        this.cameraCrossingUnit = value;
    }
    setCameraHeight(value: number) {
        this.cameraHeight = value;
    }
    setCameraHeightUnit(value: number) {
        this.cameraHeightUnit = value;
    }
    setCamerasCount(value: number) {
        this.camerasCount = value;
    }
    setCameraType(value: string) {
        this.cameraType = value;
    }
    setFocalLengthCorrection(value: boolean) {
        this.focalLengthCorrection = value;
    }
}
