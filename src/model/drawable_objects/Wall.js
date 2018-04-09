// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object wall.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Wall extends DrawableObject {
    vertices: vertices = [
        // front side
        [0.475, 0.475, 0.05],
        [-0.475, 0.475, 0.05],
        [-0.475, -0.475, 0.05],
        [0.475, -0.475, 0.05],
        // back side
        [0.475, 0.475, -0.05],
        [-0.475, 0.475, -0.05],
        [-0.475, -0.475, -0.05],
        [0.475, -0.475, -0.05],
    ];
    edges: Array<[number, number]> = [
        // front side
        [0, 1], [1, 2], [2, 3], [3, 0],
        // back side
        [4, 5], [5, 6], [6, 7], [7, 4],
        // side connection
        [0, 4], [1, 5], [2, 6], [3, 7],
    ];
}