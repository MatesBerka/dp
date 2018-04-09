// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object fine square.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class FineSquare extends DrawableObject {
    vertices: vertices = [[-0.5, -0.5, 0], [-0.5,  0.5, 0]];
    edges: Array<[number, number]> = [[0, 1]];
    /**
     * @override
     */
    constructor() {
        super();
        let i, sub_div = 10;
        for (i = 1; i < sub_div + 1; i++) {
            this.vertices.push([0.5*(i/sub_div*2-1), -0.5, 0]);
            this.vertices.push([0.5*(i/sub_div*2-1),  0.5, 0]);
            this.edges.push([(i-1)*2, i*2]);
            this.edges.push([(i-1)*2+1, i*2+1]);
        }
        this.edges.push([i*2-2, i*2-1]);
    }
}