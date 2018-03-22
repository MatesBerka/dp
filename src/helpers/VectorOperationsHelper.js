// @flow
import type {trnsType, vec3, vec2, det3x3, vertices, vecN, rulers} from '../model/data_collections/flowTypes'
/**
 * @classdesc Helper class used for various vector related operations.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class VecOperationsHelper {
    /**
     * Transform 2-D vector
     * @param {vec2} v
     * @param {trnsType} trns
     * @param {string} view
     * @return {vec2}
     */
    static transform2d(v: vec2, trns: trnsType, view: string): vec2 {
        let y;
        if (view === 'xz') { y = v[1]; } else { y = -v[1]; }
        return [v[0]*trns.scaleX + trns.translateX, y*trns.scaleY + trns.translateY];
    }
    /**
     * Scale 2-D vector
     * @param {vec2} v
     * @param {trnsType} trns
     * @param {string} view
     * @return {vec2}
     */
    static transform2dVect(v: vec2, trns: trnsType, view: string): vec2 {
        let y;
        if (view === 'xz') {  y = v[1]; } else {  y = -v[1]; }
        return [v[0]*trns.scaleX, y*trns.scaleY];
    }
    /**
     *  Inverse 2-D transformation
     * @param {vec2} v
     * @param {trnsType} trns
     * @return {vec2}
     */
    static transform2dInv(v: vec2, trns: trnsType): vec2 {
        return [(v[0] - trns.translateX) / trns.scaleX, (v[1] - trns.translateY) / trns.scaleY];
    }
    /**
     * 3-D transformation.
     * @param {vec2} v
     * @param {trnsType} trns
     * @param {string} view
     * @return {vec2}
     */
    static transform3d(v: vec3, trns: trnsType, view: string): vec2 {
        let v2d;
        if (view === 'xz') { v2d = [v[2], v[0]]; } else { v2d = [v[2], -v[1]]; }
        return [v2d[0]*trns.scaleX + trns.translateX, v2d[1]*trns.scaleY + trns.translateY];
    }
    /**
     * Apply 3-D scale.
     * @param {vec2} v
     * @param {trnsType} trns
     * @param {string} view
     * @return {vec2}
     */
    static transform3dVect(v: vec3, trns: trnsType, view: string): vec2 {
        let v2d;
        if (view === 'xz') {  v2d = [v[2], v[0]]; } else {  v2d = [v[2], -v[1]]; }
        return [v2d[0]*trns.scaleX, v2d[1]*trns.scaleY];
    }
    /**
     * Apply inverse transformation.
     * @param {vec2} v
     * @param {trnsType} trns
     * @return {vec2}
     */
    static transform3dInv(v: vec3, trns: trnsType): vec3 {
        return [(v[1] - trns.translateY) / trns.scaleY, 0, (v[0] - trns.translateX) / trns.scaleX];
    }
    /**
     * Adds two vectors and returns the result.
     * @param {vecN} a
     * @param {vecN} b
     * @return {vecN}
     */
    // $FlowFixMe
    static vectAdd(a: vecN, b: vecN): vecN {
        let res = [], i;
        // $FlowFixMe
        for (i = 0; i < a.length; i++) { res.push(a[i] + b[i]); }
        return res;
    }
    /**
    * Subs two vectors (a - b) and returns the result.
    * @param {vecN} a
    * @param {vecN} b
    * @return {vecN}
    */
    // $FlowFixMe
    static vectSub(a: vecN, b: vecN): vecN {
        let res = [], i;
        // $FlowFixMe
        for (i = 0; i < a.length; i++) { res.push(a[i] - b[i]); }
        return res;
    }
    /**
     * Returns vector length.
     * @param {vecN} a
     * @return {number}
     */
    static vectLength(a: vecN): number {
        let res = 0, i;
        // $FlowFixMe
        for (i = 0; i < a.length; i++) { res += a[i] * a[i]; }
        return Math.sqrt(res);
    }
    /**
    * Scales vector
    * @param {vecN} v
    * @param {number} k
    * @return {vecN}
    */
    // $FlowFixMe
    static vectScale(v: vecN, k: number): vecN {
        let res = [], i;
        // $FlowFixMe
        for (i = 0; i < v.length; i++) { res.push(v[i] * k); }
        return res;
    }
    /**
     * Linear interpolation
     * https://slimdx.org/docs/html/M_SlimDX_Vector3_Lerp.htm
     * @param {vecN} a
     * @param {vecN} b
     * @param {number} k
     * @return {vecN}
     */
    // $FlowFixMe
    static vectLERP(a: vecN, b: vecN, k: number): vecN {
        let res = [], i;
        // $FlowFixMe
        for (i = 0; i < a.length; i++) { res.push(a[i] + (b[i] - a[i])*k); }
        return res;
    }
    /**
    * Cross product of 3d vectors a, b.
    * a[1] a[2] a[0] a[1]
    * b[1] b[2] b[0] b[1]
    * @param {vecN} a
    * @param {vecN} b
    * @return {vec3}
    */
    static crossProduct(a: vec3, b: vec3): vec3 {
        return [a[1] * b[2] - b[1] * a[2], a[2] * b[0] - b[2] * a[0], a[0] * b[1] - b[0] * a[1]];
    }
    /**
     * Computes 3x3 det.
     * @param {det3x3} a
     * @return {number}
     */
    static det3x3(a: det3x3): number {
        return a[0][0] * a[1][1] * a[2][2] +
            a[0][1] * a[1][2] * a[2][0] +
            a[0][2] * a[1][0] * a[2][1] -
            a[2][0] * a[1][1] * a[0][2] -
            a[2][1] * a[1][2] * a[0][0] -
            a[2][2] * a[1][0] * a[0][1];
    }
    /**
     * Orientation of a 2D triangle abc.
     * equals to det
     * | ax-cx  ay-cy |
     * | bx-cx  by-cy |
     * @param {vec2} a
     * @param {vec2} b
     * @param {vec2} c
     * @return {number}
     */
    static triangleOrientation(a: vec2, b: vec2, c: vec2): number {
        return (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]);
    }
    /**
     * calculate intersection of lines AB and CD
     * first, intersection Q based on xz coordinates only is calculated as
     *   Q = (A x B) x (C x D)
     * then, y coordinate is estimated
     * @param {vec3} a
     * @param {vec3} b
     * @param {vec3} c
     * @param {vec3} d
     * @return {vec3}
     */
    static calculateIntersectionXZ(a: vec3, b: vec3, c: vec3, d: vec3): vec3 {
        let qh = VecOperationsHelper.crossProduct(VecOperationsHelper.crossProduct([a[0], a[2], 1], [b[0], b[2], 1]),VecOperationsHelper.crossProduct([c[0], c[2], 1], [d[0], d[2], 1]));
        // Convert from homogenous to cartesian
        let q = [qh[0]/qh[2], 0, qh[1]/qh[2]];
        // Estimate y coordinate:
        // we have points A, B and Q located on the same line, i.e.
        //   Q = A + t*(B-A)
        // hence
        //   t = (Q - A) / (B - A)
        // i.e.
        //   tz1 = (Qz - Az) / (Bz - Az)
        // For the line CD we can calculate
        //   tz2 = (Qz - Cz) / (Dz - Cz)
        // For both tz1 and tz2 it is possible to calculate Y value;
        // let us average them.
        let tz1 = (q[2] - a[2]) / (b[2] - a[2]);
        let tz2 = (q[2] - c[2]) / (d[2] - c[2]);
        q[1] = 0.5 * (a[1] + tz1*(b[1] - a[1])) + 0.5 * (c[1] + tz2*(d[1] - c[1]));
        return q;
    }
    /**
     * Find ruler tic positions for a context/transform.
     * @param {CanvasRenderingContext2D} ctx
     * @param {trnsType} trns
     * @return {rulers}
     */
    static getRulerPositions(ctx: CanvasRenderingContext2D , trns: trnsType): rulers {
        let pMin = [0, 0], pMax = [ctx.canvas.width, ctx.canvas.height], deltaX, deltaY, delta;

        pMin = VecOperationsHelper.transform2dInv(pMin, trns);
        pMax = VecOperationsHelper.transform2dInv(pMax, trns);
        deltaX = VecOperationsHelper.findDelta(pMin[0], pMax[0]);
        deltaY = VecOperationsHelper.findDelta(pMin[1], pMax[1]);
        delta = deltaX < deltaY ? deltaX : deltaY;
        return [VecOperationsHelper.adjustRulerPositions(pMin[0], pMax[0], delta), VecOperationsHelper.adjustRulerPositions(pMin[1], pMax[1], delta)];
    }
    /**
     * Find a delta value that is a power of 10.
     * @param {number} minP
     * @param {number} maxP
     * @return {number}
     */
    static findDelta(minP: number, maxP: number): number {
        let deltaOrig = (maxP - minP), delta = 1;
        // adjust delta to be a power of 10
        if (delta > deltaOrig) {
            while (delta > deltaOrig) { delta = delta / 10; }
        } else if (delta * 10 < deltaOrig) {
            while (delta * 10 < deltaOrig) { delta = delta * 10; }
        }
        return delta;
    }
    /**
     * Updates ruler position according to user movement.
     * @param {number} minP
     * @param {number} maxP
     * @param {number} delta
     * @return {Array<number>}
     */
    static adjustRulerPositions(minP: number, maxP: number, delta: number): Array<number> {
        let positions = [], p;
        // set minP to be a intereg multiple of delta
        minP = Math.floor(minP / delta) * delta;
        for (p = minP; p <= maxP + delta; p += delta) { positions.push(p); }
        return positions;
    }
    /**
     * Create nice looking positions from min to max.
     * @param {Array<number>} positionsOrig
     * @param {number} refine
     * @return {Array<number>}
     */
    static refinePositions(positionsOrig: Array<number>, refine: number): Array<number> {
        let positionsNew = [], i, j, delta;
        for (i = 0; i < positionsOrig.length - 1; i++) {
            positionsNew.push(positionsOrig[i]);
            delta = positionsOrig[i + 1] - positionsOrig[i];
            for (j = 1; j < refine; j++)
                positionsNew.push(positionsOrig[i] + delta * j / refine);
        }
        return positionsNew;
    }
    /**
     * Returns computed delta.
     * @param {number} delta
     * @param {trnsType} trns
     * @return {number}
     */
    static getDeltaTrns(delta: number, trns: trnsType): number {
        let deltaTrns = VecOperationsHelper.transform2dVect([delta, 0], trns, 'none');
        return deltaTrns[0];
    }
    /**
     * Rotates object vertices in around Y.
     * @param {vertices} vertices
     * @param {number} angleDeg
     */
    static objectRotateY(vertices: vertices, angleDeg: number) {
        let angle = angleDeg * Math.PI / 180;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let i, x, z;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            z = vertices[i][2];
            vertices[i][0] =  x * c + z * s;
            vertices[i][2] = -x * s + z * c;
        }
    }
    /**
     * Rotates object vertices in around X.
     * @param {vertices} vertices
     * @param {number} angleDeg
     */
    static objectRotateX(vertices: vertices, angleDeg: number) {
        let angle = angleDeg * Math.PI / 180;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let i, y, z;
        for (i = 0; i < vertices.length; i++) {
            y = vertices[i][1];
            z = vertices[i][2];
            vertices[i][1] =  y * c - z * s;
            vertices[i][2] =  y * s + z * c;
        }
    }
    /**
     * Rotates object vertices in around Z.
     * @param {vertices} vertices
     * @param {number} angleDeg
     */
    static objectRotateZ(vertices: vertices, angleDeg: number) {
        let angle = angleDeg * Math.PI / 180;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let i, x, y;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            y = vertices[i][1];
            vertices[i][0] =  x * c - y * s;
            vertices[i][1] =  x * s + y * c;
        }
    }
    /**
     * Translates object vertices.
     * @param {vertices} vertices
     * @param {vec3} trans
     */
    static objectTranslate(vertices: vertices, trans: vec3) {
        let i, x, y, z;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            y = vertices[i][1];
            z = vertices[i][2];
            vertices[i][0] = x + trans[0];
            vertices[i][1] = y + trans[1];
            vertices[i][2] = z + trans[2];
        }
    }
    /**
     * Scales object vertices.
     * @param {vertices} vertices
     * @param {vec3} scale
     */
    static objectScale(vertices: vertices, scale: vec3) {
        let i, x, y, z;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            y = vertices[i][1];
            z = vertices[i][2];
            vertices[i][0] = x * scale[0];
            vertices[i][1] = y * scale[1];
            vertices[i][2] = z * scale[2];
        }
    }
    /**
     * Applies inverse Y rotation on object vertices.
     * @param {vertices} vertices
     * @param {number} angleDeg
     */
    static reverseObjectRotateY(vertices: vertices, angleDeg: number) {
        let angle = angleDeg * Math.PI / 180;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let i, x, z;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            z = vertices[i][2];
            vertices[i][0] = x * c - z * s;
            vertices[i][2] = x * s + z * c;
        }
    }
    /**
     * Applies inverse X rotation on object vertices.
     * @param {vertices} vertices
     * @param {number} angleDeg
     */
    static reverseObjectRotateX(vertices: vertices, angleDeg: number) {
        let angle = angleDeg * Math.PI / 180;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let i, y, z;
        for (i = 0; i < vertices.length; i++) {
            y = vertices[i][1];
            z = vertices[i][2];
            vertices[i][1] =  y * c + z * s;
            vertices[i][2] =  -y * s + z * c;
        }
    }
    /**
     * Applies inverse Z rotation on object vertices.
     * @param {vertices} vertices
     * @param {number} angleDeg
     */
    static reverseObjectRotateZ(vertices: vertices, angleDeg: number) {
        let angle = angleDeg * Math.PI / 180;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        let i, x, y;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            y = vertices[i][1];
            vertices[i][0] =  x * c + y * s;
            vertices[i][1] =  -x * s + y * c;
        }
    }
    /**
     * Applies inverse translation on object vertices.
     * @param {vertices} vertices
     * @param {vec3} trans
     */
    static reverseObjectTranslate(vertices: vertices, trans: vec3) {
        for (let i = 0; i < vertices.length; i++) {
            vertices[i][0] -= trans[0];
            vertices[i][1] -= trans[1];
            vertices[i][2] -= trans[2];
        }
    }
    /**
     * Applies inverse scale on object vertices.
     * @param {vertices} vertices
     * @param {vec3} scale
     */
    static reverseObjectScale(vertices: vertices, scale: vec3) {
        let i, x, y, z;
        for (i = 0; i < vertices.length; i++) {
            x = vertices[i][0];
            y = vertices[i][1];
            z = vertices[i][2];
            vertices[i][0] = x  / scale[0];
            vertices[i][1] = y  / scale[1];
            vertices[i][2] = z  / scale[2];
        }
    }
}