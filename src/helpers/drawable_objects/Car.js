// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../../model/data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object car.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Car extends DrawableObject {
    vertices: vertices = [
        // roof
        [0.8, 0.8, -0.8],
        [0.8, 0.8, 0.8],
        [0.2, 0.8, 0.8],
        [0.2, 0.8, -0.8],
        // engine cover
        [-0.2, 0.2, -0.8],
        [-0.2, 0.2, 0.8],
        [-0.8, 0.2, 0.8],
        [-0.8, 0.2, -0.8],
        // car bottom
        [-0.8, -0.4, -0.8],
        [-0.8, -0.4, 0.8],
        [0.8, -0.4, 0.8],
        [0.8, -0.4, -0.8],
        // first wheel
        [-0.6, -0.4, -0.8],
        [-0.45, -0.7, -0.8],
        [-0.3, -0.4, -0.8],
        // second wheel
        [0.3, -0.4, -0.8],
        [0.45, -0.7, -0.8],
        [0.6, -0.4, -0.8],
        // third wheel
        [-0.6, -0.4, 0.8],
        [-0.45, -0.7, 0.8],
        [-0.3, -0.4, 0.8],
        // fourth wheel
        [0.3, -0.4, 0.8],
        [0.45, -0.7, 0.8],
        [0.6, -0.4, 0.8],
    ];
    edges: Array<[number, number]> = [
        // roof
        [0, 1], [1, 2], [2, 3], [3, 0],
        // engine cover
        [4, 5], [5, 6], [6, 7], [7, 4],
        // roof and cover connection
        [2, 5], [3, 4],
        // bottom
        [8, 9], [9, 10], [10, 11], [11, 8],
        // bottom to top
        [8, 7], [9, 6], [10, 1], [11, 0],
        // wheels
        [12, 13], [13, 14], [15, 16], [16, 17],
        [18, 19], [19, 20], [21, 22], [22, 23]
    ];
}