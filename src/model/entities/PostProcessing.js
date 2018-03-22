// @flow
import { unitIdx } from '../data_collections/UnitsDefinition.js'
import { sliderTypes, inputTypes } from "../data_collections/ControlsTypes";
import Generic from "./Generic";

/**
 * @classdesc Class representing image post processing settings.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends Generic
 */
export default class PostProcessing  extends Generic {
    // static variables
    static imagesShiftControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static imagesKeystoneControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static imagesStretchControl: [number, number, number, number, number, number] = [25,400,sliderTypes.lin,0.1,10,inputTypes.number];
    static imagesZoomControl: [number, number, number, number, number, number] = [50,250,sliderTypes.lin,0.1,10,inputTypes.number];
    // instance variables
    imagesShift: number = 0;
    imagesShiftUnit: number = unitIdx.pct;
    imagesKeystone: number = 0;
    imagesKeystoneUnit: number = unitIdx.pct;
    imagesStretch: number = 1;
    imagesStretchUnit: number = unitIdx.pct;
    imagesZoom: number = 1;
    imagesZoomUnit: number = unitIdx.pct;
    /**
     * @override
     */
    getCopy(): PostProcessing {
        let copy = new PostProcessing();
        copy.imagesShift = this.imagesShift;
        copy.imagesShiftUnit = this.imagesShiftUnit;
        copy.imagesKeystone = this.imagesKeystone;
        copy.imagesKeystoneUnit = this.imagesKeystoneUnit;
        copy.imagesStretch = this.imagesStretch;
        copy.imagesStretchUnit = this.imagesStretchUnit;
        copy.imagesZoom = this.imagesZoom;
        copy.imagesZoomUnit = this.imagesZoomUnit;

        return copy;
    }
    /**
     * @description Getters and Setters for entity values.
     */
    static getImagesShiftControl(val: number): number {
        return PostProcessing.imagesShiftControl[val];
    }
    static getImagesKeystoneControl(val: number): number {
        return PostProcessing.imagesKeystoneControl[val];
    }
    static getImagesStretchControl(val: number): number {
        return PostProcessing.imagesStretchControl[val];
    }
    static getImagesZoomControl(val: number): number {
        return PostProcessing.imagesZoomControl[val];
    }
    getImagesShift(): number {
        return this.imagesShift;
    }
    getImagesKeystone(): number {
        return this.imagesKeystone;
    }
    getImagesStretch(): number {
        return this.imagesStretch;
    }
    getImagesZoom(): number {
        return this.imagesZoom;
    }
    getImagesShiftUnit(): number {
        return this.imagesShiftUnit;
    }
    getImagesKeystoneUnit(): number {
        return this.imagesKeystoneUnit;
    }
    getImagesStretchUnit(): number {
        return this.imagesStretchUnit;
    }
    getImagesZoomUnit(): number {
        return this.imagesZoomUnit;
    }
    setImagesShift(value: number) {
        this.imagesShift = value;
    }
    setImagesKeystone(value: number) {
        this.imagesKeystone = value;
    }
    setImagesStretch(value: number) {
        this.imagesStretch = value;
    }
    setImagesZoom(value: number) {
        this.imagesZoom = value;
    }
    setImagesShiftUnit(value: number) {
        this.imagesShiftUnit = value;
    }
    setImagesKeystoneUnit(value: number) {
        this.imagesKeystoneUnit = value;
    }
    setImagesStretchUnit(value: number) {
        this.imagesStretchUnit = value;
    }
    setImagesZoomUnit(value: number) {
        this.imagesZoomUnit = value;
    }
}