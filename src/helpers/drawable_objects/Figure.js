// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../../model/data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object figure.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Figure extends DrawableObject {
    vertices: vertices = [
        // head
        [0.1, 0.8, 0],
        [-0.1, 0.8, 0],
        [0, 0.65, 0],
        // neck
        [0, 0.45, 0],
        // body
        [0, -0.1, 0],
        // arms
        [0.2, 0.1, 0],
        [-0.2, 0.1, 0],
        // legs
        [0.3, -0.6, 0],
        [-0.3, -0.6, 0],
    ];
    edges: Array<[number, number]> = [
        // head
        [0, 1], [1, 2], [2, 0], [2, 3],
        // body
        [3, 4],
        // arms
        [5, 3], [6, 3],
        // legs
        [7, 4], [8, 4],
    ];
}