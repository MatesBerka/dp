// @flow
import DrawableObject from './DrawableObject.js';
import type {vertices} from "../data_collections/flowTypes";

/**
 * @classdesc Class representing drawable object point.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends DrawableObject
 */
export default class Point extends DrawableObject {
    vertices: vertices = [ [0, 0, 0] ];
}