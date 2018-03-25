// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../../model/data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object bust.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Bust extends DrawableObject {
    vertices: vertices = [
        // base bottom
        [0.4, -0.5, -0.4],
        [0.4, -0.5, 0.4],
        [-0.4, -0.5, 0.4],
        [-0.4, -0.5, -0.4],
        // base top
        [0.4, 0, -0.4],
        [0.4, 0, 0.4],
        [-0.4, 0, 0.4],
        [-0.4, 0, -0.4],
        // body bottom
        [0.2, 0, -0.2],
        [0.2, 0, 0.2],
        [-0.2, 0, 0.2],
        [-0.2, 0, -0.2],
        // body top
        [0.45, 0.3, -0.45],
        [0.45, 0.3, 0.45],
        [-0.45, 0.3, 0.45],
        [-0.45, 0.3, -0.45],
        // head
        [0, 0.3, 0],
        [0.35, 0.5, -0.35],
        [0.35, 0.5, 0.35],
        [-0.35, 0.5, 0.35],
        [-0.35, 0.5, -0.35],
    ];
    edges: Array<[number, number]> = [
        // base bottom
        [0, 1], [1, 2], [2, 3], [3, 0],
        // base top
        [4, 5], [5, 6], [6, 7], [7, 4],
        // bottom to top
        [0, 4], [1, 5], [2, 6], [3, 7],
        // body bottom
        [8, 9], [9, 10], [10, 11], [11, 8],
        // body top
        [12, 13], [13, 14], [14, 15], [15, 12],
        // bottom to top
        [8, 12], [9, 13], [10, 14], [11, 15],
        // head
        [16, 17], [16, 18], [16, 19], [16, 20],
        [17, 18], [18, 19], [19, 20], [20, 17],
    ];
}