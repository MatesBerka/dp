// @flow
import { unitIdx} from "../data_collections/UnitsDefinition";
import { objTypeIdx } from "../data_collections/ObjectTypes";
import { sliderTypes, inputTypes } from "../data_collections/ControlsTypes";
import Generic from "./Generic";

/**
 * @classdesc Class representing scene object settings.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends Generic
 */
export default class SceneObject extends Generic {
    // static variables
    static centerXControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static centerYControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static centerZControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,0.1,10,inputTypes.number];
    static objectRotXControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,1,1,inputTypes.number];
    static objectRotYControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,1,1,inputTypes.number];
    static objectRotZControl: [number, number, number, number, number, number] = [-100,100,sliderTypes.lin,1,1,inputTypes.number];
    static widthControl: [number, number, number, number, number, number] = [1,100,sliderTypes.log,1,1,inputTypes.number];
    static depthControl: [number, number, number, number, number, number] = [1,100,sliderTypes.log,1,1,inputTypes.number];
    static aspectControl: [number, number, number, number, number, number] = [0.1,10,sliderTypes.lin,0.1,10,inputTypes.number];
    // instance variables
    objectType: number = objTypeIdx.bust;
    centerX: number = 0;
    centerXUnit: number = unitIdx.cm;
    centerY: number = 0;
    centerYUnit: number = unitIdx.cm;
    centerZ: number = 0;
    centerZUnit: number = unitIdx.cm;
    objectRotX: number = 0;
    objectRotXUnit: number = unitIdx.deg;
    objectRotY: number = 0;
    objectRotYUnit: number = unitIdx.deg;
    objectRotZ: number = 0;
    objectRotZUnit: number = unitIdx.deg;
    width: number = 0.20;
    widthUnit: number = unitIdx.cm;
    depth: number = 0.20;
    depthUnit: number = unitIdx.cm;
    aspect: number = 1;
    /**
     * @override
     */
    getCopy(): SceneObject {
        let copy = new SceneObject();
        copy.objectType = this.objectType;
        copy.centerX = this.centerX;
        copy.centerXUnit = this.centerXUnit;
        copy.centerY = this.centerY;
        copy.centerYUnit = this.centerYUnit;
        copy.centerZ = this.centerZ;
        copy.centerZUnit = this.centerZUnit;
        copy.objectRotX = this.objectRotX;
        copy.objectRotXUnit = this.objectRotXUnit;
        copy.objectRotY = this.objectRotY;
        copy.objectRotYUnit = this.objectRotYUnit;
        copy.objectRotZ = this.objectRotZ;
        copy.objectRotZUnit = this.objectRotZUnit;
        copy.width = this.width;
        copy.widthUnit = this.widthUnit;
        copy.depth = this.depth;
        copy.depthUnit = this.depthUnit;
        copy.aspect = this.aspect;

        return copy;
    }
    /**
     * @description Getters and Setters for entity values.
     */
    static getCenterXControl(val: number): number {
        return SceneObject.centerXControl[val];
    }
    static getCenterYControl(val: number): number {
        return SceneObject.centerYControl[val];
    }
    static getCenterZControl(val: number): number {
        return SceneObject.centerZControl[val];
    }
    static getObjectRotXControl(val: number): number {
        return SceneObject.objectRotXControl[val];
    }
    static getObjectRotYControl(val: number): number {
        return SceneObject.objectRotYControl[val];
    }
    static getObjectRotZControl(val: number): number {
        return SceneObject.objectRotZControl[val];
    }
    static getWidthControl(val: number): number {
        return SceneObject.widthControl[val];
    }
    static getDepthControl(val: number): number {
        return SceneObject.depthControl[val];
    }
    static getAspectControl(val: number): number {
        return SceneObject.aspectControl[val];
    }
    getObjectType(): number {
        return this.objectType;
    }
    getCenterX(): number {
        return this.centerX;
    }
    getCenterXUnit(): number {
        return this.centerXUnit;
    }
    getCenterY(): number {
        return this.centerY;
    }
    getCenterYUnit(): number {
        return this.centerYUnit;
    }
    getCenterZ(): number {
        return this.centerZ;
    }
    getCenterZUnit(): number {
        return this.centerZUnit;
    }
    getObjectRotX(): number {
        return this.objectRotX;
    }
    getObjectRotXUnit(): number {
        return this.objectRotXUnit;
    }
    getObjectRotY(): number {
        return this.objectRotY;
    }
    getObjectRotYUnit(): number {
        return this.objectRotYUnit;
    }
    getObjectRotZ(): number {
        return this.objectRotZ;
    }
    getObjectRotZUnit(): number {
        return this.objectRotZUnit;
    }
    getWidth(): number {
        return this.width;
    }
    getWidthUnit(): number {
        return this.widthUnit;
    }
    getDepth(): number {
        return this.depth;
    }
    getDepthUnit(): number {
        return this.depthUnit;
    }
    getAspect(): number {
        return this.aspect;
    }
    setObjectType(value: number) {
        this.objectType = value;
    }
    setCenterX(value: number) {
        this.centerX = value;
    }
    setCenterXUnit(value: number) {
        this.centerXUnit = value;
    }
    setCenterY(value: number) {
        this.centerY = value;
    }
    setCenterYUnit(value: number) {
        this.centerYUnit = value;
    }
    setCenterZ(value: number) {
        this.centerZ = value;
    }
    setCenterZUnit(value: number) {
        this.centerZUnit = value;
    }
    setObjectRotX(value: number) {
        this.objectRotX = value;
    }
    setObjectRotXUnit(value: number) {
        this.objectRotXUnit = value;
    }
    setObjectRotY(value: number) {
        this.objectRotY = value;
    }
    setObjectRotYUnit(value: number) {
        this.objectRotYUnit = value;
    }
    setObjectRotZ(value: number) {
        this.objectRotZ = value;
    }
    setObjectRotZUnit(value: number) {
        this.objectRotZUnit = value;
    }
    setWidth(value: number) {
        this.width = value;
    }
    setWidthUnit(value: number) {
        this.widthUnit = value;
    }
    setDepth(value: number) {
        this.depth = value;
    }
    setDepthUnit(value: number) {
        this.depthUnit = value;
    }
    setAspect(value: number) {
        this.aspect = value;
    }
}