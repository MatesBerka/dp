// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../../model/data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object octahedron.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Octahedron extends DrawableObject {
    vertices: vertices = [
        [-0.5, 0,   0],
        [ 0.5, 0,   0],
        [ 0,  -0.5, 0],
        [ 0,   0.5, 0],
        [ 0,   0,  -0.5],
        [ 0,   0,   0.5],
    ];
    edges: Array<[number, number]> = [
        [0, 3], [3, 1], [1, 2], [2, 0],
        [0, 4], [1, 4], [2, 4], [3, 4],
        [0, 5], [1, 5], [2, 5], [3, 5]
    ];
}