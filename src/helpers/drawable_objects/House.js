// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../../model/data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object house.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class House extends DrawableObject {
    vertices: vertices = [
        // bottom
        [0.9, -1, -0.9],
        [0.9, -1, 0.9],
        [-0.9, -1, 0.9],
        [-0.9, -1, -0.9],
        // top
        [0.9, 0.8, -0.9],
        [0.9, 0.8, 0.9],
        [-0.9, 0.8, 0.9],
        [-0.9, 0.8, -0.9],
        // roof top
        [0, 1.4, 0],
        // window
        [0.3, -0.4, -0.9],
        [0.7, -0.4, -0.9],
        [0.7, 0.2, -0.9],
        [0.3, 0.2, -0.9],
        // window horizontal stripe
        [0.3, -0.2, -0.9],
        [0.7, -0.2, -0.9],
        // window vertical stripe
        [0.5, -0.4, -0.9],
        [0.5, 0.2, -0.9],
        // window 2
        [0.9, -0.4, -0.7],
        [0.9, -0.4, -0.3],
        [0.9, 0.2, -0.3],
        [0.9, 0.2, -0.7],
        // window 2 horizontal stripe
        [0.9, -0.2, -0.7],
        [0.9, -0.2, -0.3],
        // window 2 vertical stripe
        [0.9, -0.4, -0.5],
        [0.9, 0.2, -0.5],
        // door
        [-0.6, -1, -0.9],
        [-0.2, -1, -0.9],
        [-0.2, 0.3, -0.9],
        [-0.6, 0.3, -0.9],
    ];
    edges: Array<[number, number]> = [
        // roof
        [0, 1], [1, 2], [2, 3], [3, 0],
        // engine cover
        [4, 5], [5, 6], [6, 7], [7, 4],
        // bottom to top
        [0, 4], [1, 5], [2, 6], [3, 7],
        // roof
        [4, 8], [5, 8], [6, 8], [7, 8],
        // window 1
        [9, 10], [10, 11], [11, 12], [12, 9],
        [13, 14], [15, 16],
        // window 2
        [17, 18], [18, 19], [19, 20], [20, 17],
        [21, 22], [23, 24],
        // door
        [25, 26], [26, 27], [27, 28], [28, 25]
    ];
}