// @flow
import SceneObject from './entities/SceneObject.js';
import GenericDAO from "./GenericDAO.js";
import registry from "../services/RegistryService";
/**
 * @classdesc Class representing Data access object for SceneObject entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class SceneObjectDAO extends GenericDAO {
    /** @override */
    name: string = 'SceneObjectDAO';
    records: Array<Array<SceneObject>>;
    /**
     * @override
     */
    constructor() {
        super();
        this.addNewRecord();
    }
    /**
     * @override
     */
    addNewRecord() {
        this.records.push([new SceneObject()]);
    }
    /**
     * Adds new object into records
     */
    addNewObject() {
        this.records[this.activeRecordIndex].push(new SceneObject());
        return this.records[this.activeRecordIndex];
    }
    /**
     * Removes object from records
     * @param {number} objectID
     * @return {Array<SceneObject>}
     */
    removeObject(objectID: number): Array<SceneObject> {
        this.records[this.activeRecordIndex].splice(objectID, 1);
        return this.records[this.activeRecordIndex];
    }
    /**
     * @override
     */
    getCopy(): Array<SceneObject> {
        return this.createCopy(this.records[this.activeRecordIndex]);
    }
    /**
     * HelperFunction used to create records copy
     */
    createCopy(objects: Array<SceneObject>) {
        let copies = [];
        for (let i = 0; i < objects.length; i++)
            copies.push(objects[i].getCopy());

        return copies;
    }
    /**
     * @override
     */
    toJSON(): Array<Array<Object>> {
        let entities = [];

        for (let objects of this.records) {
            let entity_objects = [];
            for (let object of objects) {
                entity_objects.push({
                    objectType: object.objectType,
                    centerX: object.centerX,
                    centerXUnit: object.centerXUnit,
                    centerY: object.centerY,
                    centerYUnit: object.centerYUnit,
                    centerZ: object.centerZ,
                    centerZUnit: object.centerZUnit,
                    objectRotX: object.objectRotX,
                    objectRotXUnit: object.objectRotXUnit,
                    objectRotY: object.objectRotY,
                    objectRotYUnit: object.objectRotYUnit,
                    objectRotZ: object.objectRotZ,
                    objectRotZUnit: object.objectRotZUnit,
                    width: object.width,
                    widthUnit: object.widthUnit,
                    depth: object.depth,
                    depthUnit: object.depthUnit,
                    aspect: object.aspect
                });
            }
            entities.push(entity_objects);
        }
        return entities;
    }
    /**
     * @override
     */
    fromJSON(entities: Array<Array<Object>>, activeRecordID: number) {
        let instance, recordObjects;
        this.records = [];
        this.setActiveRecord(activeRecordID);

        for (let objects of entities) {
            recordObjects = [];
            for (let object of objects) {
                instance = new SceneObject();
                instance.objectType = object.objectType;
                instance.centerX = object.centerX;
                instance.centerXUnit = object.centerXUnit;
                instance.centerY = object.centerY;
                instance.centerYUnit = object.centerYUnit;
                instance.centerZ = object.centerZ;
                instance.centerZUnit = object.centerZUnit;
                instance.objectRotX = object.objectRotX;
                instance.objectRotXUnit = object.objectRotXUnit;
                instance.objectRotY = object.objectRotY;
                instance.objectRotYUnit = object.objectRotYUnit;
                instance.objectRotZ = object.objectRotZ;
                instance.objectRotZUnit = object.objectRotZUnit;
                instance.width = object.width;
                instance.widthUnit = object.widthUnit;
                instance.depth = object.depth;
                instance.depthUnit = object.depthUnit;
                instance.aspect = object.aspect;
                recordObjects.push(instance);
            }
            this.records.push(recordObjects);
        }
    }
}

const sceneObjectDAO = new SceneObjectDAO();
// register
registry.register('sceneObjectDAO', sceneObjectDAO);

export default sceneObjectDAO;