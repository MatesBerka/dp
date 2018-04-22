// @flow
import Generic from "./Generic";
import type {vec4} from "../data_collections/flowTypes";

/**
 * @classdesc Class representing diagnostics settings.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends Generic
 */
export default class Diagnostics  extends Generic {
    // instance variables
    // first is value, then precision, range start and range end
    isGlobal: boolean = false;
    disparityXMinMM: vec4 = [0,1,0,0];
    disparityXMaxMM: vec4 = [0,1,0,0];
    disparityYMaxMM: vec4 = [0,1,0,0];
    disparityXMinPx: vec4 = [0,1,0,0];
    disparityXMaxPx: vec4 = [0,1,0,0];
    disparityYMaxPx: vec4 = [0,1,0,0];
    disparityXMinPct: vec4 = [0,1,0,0];
    disparityXMaxPct: vec4 = [0,1,0,0];
    disparityYMaxPct: vec4 = [0,1,0,0];
    disparityXMinConv: vec4 = [0,1,0,0];
    disparityXMaxConv: vec4 = [0,1,0,0];
    disparityXMinParallax: vec4 = [0,1,0,0];
    disparityXMaxParallax: vec4 = [0,1,0,0];
    disparityYMaxParallax: vec4 = [0,1,0,0];
    vergenceMinAbs: vec4 = [0,1,0,0];
    vergenceMinRel: vec4 = [0,1,0,0];
    vergenceMaxRelD: vec4 = [0,1,0,0];
    vergenceMinRelD: vec4 = [0,1,0,0];
    vergenceMaxAbs: vec4 | string = [0,1,0,0];
    vergenceMaxRel: vec4 | string = [0,1,0,0];
    vergenceDistanceNear: vec4 = [0,1,0,0];
    vergenceDistanceFar: vec4 = [0,1,0,0];
    camerasZNear: number = 0;
    camerasZFar: number = 0;
    /**
     * @description Getters and Setters for entity values.
     */
    isGlobalActive(): boolean {
        return this.isGlobal;
    }
    getDisparityXMinMM(): vec4 {
        return this.disparityXMinMM;
    }
    getDisparityXMaxMM(): vec4 {
        return this.disparityXMaxMM;
    }
    getDisparityYMaxMM(): vec4 {
        return this.disparityYMaxMM;
    }
    getDisparityXMinPx(): vec4 {
        return this.disparityXMinPx;
    }
    getDisparityXMaxPx(): vec4 {
        return this.disparityXMaxPx;
    }
    getDisparityYMaxPx(): vec4 {
        return this.disparityYMaxPx;
    }
    getDisparityXMinPct(): vec4 {
        return this.disparityXMinPct;
    }
    getDisparityXMaxPct(): vec4 {
        return this.disparityXMaxPct;
    }
    getDisparityYMaxPct(): vec4 {
        return this.disparityYMaxPct;
    }
    getDisparityXMinConv(): vec4 {
        return this.disparityXMinConv;
    }
    getDisparityXMaxConv(): vec4 {
        return this.disparityXMaxConv;
    }
    getDisparityXMinParallax(): vec4 {
        return this.disparityXMinParallax;
    }
    getDisparityXMaxParallax(): vec4 {
        return this.disparityXMaxParallax;
    }
    getDisparityYMaxParallax(): vec4 {
        return this.disparityYMaxParallax;
    }
    getVergenceMinAbs(): vec4 {
        return this.vergenceMinAbs;
    }
    getVergenceMinRel(): vec4 {
        return this.vergenceMinRel;
    }
    getVergenceMaxRelD(): vec4 {
        return this.vergenceMaxRelD;
    }
    getVergenceMinRelD(): vec4 {
        return this.vergenceMinRelD;
    }
    getVergenceMaxAbs(): vec4 | string {
        return this.vergenceMaxAbs;
    }
    getVergenceMaxRel(): vec4 | string {
        return this.vergenceMaxRel;
    }
    toggleIsGlobal() {
        this.isGlobal = !this.isGlobal;
    }
    setIsGlobal(global: boolean) {
        this.isGlobal = global;
    }
    getVergenceDistanceNear(): vec4 {
        return this.vergenceDistanceNear;
    }
    getVergenceDistanceFar(): vec4 {
        return this.vergenceDistanceFar;
    }
    getCamerasZNear(): number {
        return this.camerasZNear;
    }
    getCamerasZFar(): number {
        return this.camerasZFar;
    }
    setVergenceDistanceNear(val: vec4) {
        this.vergenceDistanceNear = val;
    }
    setVergenceDistanceFar(val: vec4) {
        this.vergenceDistanceFar = val;
    }
    setDisparityXMinMM(val: vec4) {
        this.disparityXMinMM = val;
    }
    setDisparityXMaxMM(val: vec4) {
        this.disparityXMaxMM = val;
    }
    setDisparityYMaxMM(val: vec4) {
        this.disparityYMaxMM = val;
    }
    setDisparityXMinPx(val: vec4) {
        this.disparityXMinPx = val;
    }
    setDisparityXMaxPx(val: vec4) {
        this.disparityXMaxPx = val;
    }
    setDisparityYMaxPx(val: vec4) {
        this.disparityYMaxPx = val;
    }
    setDisparityXMinPct(val: vec4) {
        this.disparityXMinPct = val;
    }
    setDisparityXMaxPct(val: vec4) {
        this.disparityXMaxPct = val;
    }
    setDisparityYMaxPct(val: vec4) {
        this.disparityYMaxPct = val;
    }
    setDisparityXMinConv(val: vec4) {
        this.disparityXMinConv = val;
    }
    setDisparityXMaxConv(val: vec4) {
        this.disparityXMaxConv = val;
    }
    setDisparityXMinParallax(val: vec4) {
        this.disparityXMinParallax = val;
    }
    setDisparityXMaxParallax(val: vec4) {
        this.disparityXMaxParallax = val;
    }
    setDisparityYMaxParallax(val: vec4) {
        this.disparityYMaxParallax = val;
    }
    setVergenceMinAbs(val: vec4) {
        this.vergenceMinAbs = val;
    }
    setVergenceMinRel(val: vec4) {
        this.vergenceMinRel = val;
    }
    setVergenceMaxRelD(val: vec4) {
        this.vergenceMaxRelD = val;
    }
    setVergenceMinRelD(val: vec4) {
        this.vergenceMinRelD = val;
    }
    setVergenceMaxAbs(val: vec4 | string) {
        this.vergenceMaxAbs = val;
    }
    setVergenceMaxRel(val: vec4 | string) {
        this.vergenceMaxRel = val;
    }
    setCamerasZNear(near: number) {
        this.camerasZNear = near;
    }
    setCamerasZFar(far: number) {
        this.camerasZFar = far;
    }
}