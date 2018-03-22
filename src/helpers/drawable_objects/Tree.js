// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../../model/data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object tree.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Tree extends DrawableObject {
    vertices: vertices = [
        // core
        [0, -1, 0],
        [0, -0.5, 0],
        [0, -0.1, 0],
        [0, 0.3, 0],
        [0, 0.7, 0],
        [0, 1, 0],
        // branches
        [0.3, -0.7, 0],
        [-0.3, -0.7, 0],
        [0, -0.7, 0.3],
        [0, -0.7, -0.3],
        [0.3, -0.3, 0],
        [-0.3, -0.3, 0],
        [0, -0.3, 0.3],
        [0, -0.3, -0.3],
        [0.3, 0.1, 0],
        [-0.3, 0.1, 0],
        [0, 0.1, 0.3],
        [0, 0.1, -0.3],
        [0.3, 0.5, 0],
        [-0.3, 0.5, 0],
        [0, 0.5, 0.3],
        [0, 0.5, -0.3],
        [0.3, 0.8, 0],
        [-0.3, 0.8, 0],
        [0, 0.8, 0.3],
        [0, 0.8, -0.3],
    ];
    edges: Array<[number, number]> = [
        // roof
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
        [6, 1], [7, 1], [8, 1], [9, 1],
        [10, 2], [11, 2], [12, 2], [13, 2],
        [14, 3], [15, 3], [16, 3], [17, 3],
        [18, 4], [19, 4], [20, 4], [21, 4],
        [22, 5], [23, 5], [24, 5], [25, 5],
    ];
}