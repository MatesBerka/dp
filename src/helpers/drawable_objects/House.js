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
        [0.45, -0.5, -0.45],
        [0.45, -0.5, 0.45],
        [-0.45, -0.5, 0.45],
        [-0.45, -0.5, -0.45],
        // top
        [0.45, 0.4, -0.45],
        [0.45, 0.4, 0.45],
        [-0.45, 0.4, 0.45],
        [-0.45, 0.4, -0.45],
        // roof top
        [0, 0.7, 0],
        // window
        [0.15, -0.2, -0.45],
        [0.35, -0.2, -0.45],
        [0.35, 0.1, -0.45],
        [0.15, 0.1, -0.45],
        // window horizontal stripe
        [0.15, -0.1, -0.45],
        [0.35, -0.1, -0.45],
        // window vertical stripe
        [0.25, -0.2, -0.45],
        [0.25, 0.1, -0.45],
        // window 2
        [0.45, -0.2, -0.35],
        [0.45, -0.2, -0.15],
        [0.45, 0.1, -0.15],
        [0.45, 0.1, -0.35],
        // window 2 horizontal stripe
        [0.45, -0.1, -0.35],
        [0.45, -0.1, -0.15],
        // window 2 vertical stripe
        [0.45, -0.1, -0.25],
        [0.45, 0.1, -0.25],
        // door
        [-0.3, -0.5, -0.45],
        [-0.1, -0.5, -0.45],
        [-0.1, 0.15, -0.45],
        [-0.3, 0.15, -0.45],
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