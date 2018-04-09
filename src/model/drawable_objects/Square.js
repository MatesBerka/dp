// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object square.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Square extends DrawableObject {
    vertices: vertices = [
        [-0.5, -0.5, 0],
        [ 0.5, -0.5, 0],
        [ 0.5,  0.5, 0],
        [-0.5,  0.5, 0]
    ];
    edges: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 0]];
}