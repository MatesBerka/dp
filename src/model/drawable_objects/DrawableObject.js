// @flow
import vecOpr from '../../helpers/VectorOperationsHelper.js'
import SceneObject from "../entities/SceneObject";
import type {vec2, vec3, vertices} from "../data_collections/flowTypes";

/**
 * @classdesc Abstract class representing generic drawable object.
 * @abstract
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class DrawableObject {
    vertices: vertices = [];
    edges: Array<vec2> = [];
    /**
     * Returns object vertices.
     * @return {vec3}
     */
    getVertices(): Array<vec3> {
        return this.vertices;
    }
    /**
     * Sets new object vertices.
     * @param {Array<vec3>} vertices
     */
    setVertices(vertices: Array<vec3>) {
        this.vertices = vertices;
    }
    /**
     * Returns object edges.
     * @return {Array<vec2>}
     */
    getEdges(): Array<vec2> {
        return this.edges;
    }
    /**
     * Transforms object vertices according to entered object settings.
     */
    transformObject(objSettings: SceneObject) {
        let translate = [objSettings.getCenterX(), objSettings.getCenterY(), objSettings.getCenterZ()];
        let scale = [objSettings.getWidth(), objSettings.getWidth() * objSettings.getAspect(), objSettings.getDepth()];
        vecOpr.objectRotateZ(this.vertices, objSettings.getObjectRotZ());
        vecOpr.objectRotateY(this.vertices, objSettings.getObjectRotY());
        vecOpr.objectRotateX(this.vertices, objSettings.getObjectRotX());
        vecOpr.objectScale(this.vertices, scale);
        vecOpr.objectTranslate(this.vertices, translate);
    }
}