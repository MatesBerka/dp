// @flow
import Camera from './entities/Camera.js';
import GenericDAO from './GenericDAO.js';
import registry from '../services/RegistryService'
/**
 * @classdesc Class representing Data access object for Camera entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */

class CameraDAO extends GenericDAO {
    /** @override */
    name: string = 'CameraDAO';
    records: Array<Camera>;
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
        this.records.push(new Camera());
    }
    /**
     * @override
     */
    toJSON(): Array<Object> {
        let entities = [];
        for (let instance of this.records) {
            entities.push({
                focalLength: instance.focalLength,
                focalLengthUnit: instance.focalLengthUnit,
                fNumber: instance.fNumber,
                sensorSizeIdx: instance.sensorSizeIdx,
                sensorWidth: instance.sensorWidth,
                sensorHeight: instance.sensorHeight,
                cameraDistance: instance.cameraDistance,
                cameraDistanceUnit: instance.cameraDistanceUnit,
                cameraSeparation: instance.cameraSeparation,
                cameraSeparationUnit: instance.cameraSeparationUnit,
                cameraCrossing: instance.cameraCrossing,
                cameraCrossingUnit: instance.cameraCrossingUnit,
                cameraHeight: instance.cameraHeight,
                cameraHeightUnit: instance.cameraHeightUnit,
                camerasCount: instance.camerasCount,
                cameraType: instance.cameraType,
                focalLengthCorrection: instance.focalLengthCorrection,
            });
        }
        return entities;
    }
    /**
     * @override
     */
    fromJSON(entities: Array<Object>, activeRecordID: number) {
        let instance;
        this.records = [];
        this.setActiveRecord(activeRecordID);

        for (let entity of entities) {
            instance = new Camera();
            instance.focalLength = entity.focalLength;
            instance.focalLengthUnit = entity.focalLengthUnit;
            instance.fNumber = entity.fNumber;
            instance.sensorSizeIdx = entity.sensorSizeIdx;
            instance.sensorWidth = entity.sensorWidth;
            instance.sensorHeight = entity.sensorHeight;
            instance.cameraDistance = entity.cameraDistance;
            instance.cameraDistanceUnit = entity.cameraDistanceUnit;
            instance.cameraSeparation = entity.cameraSeparation;
            instance.cameraSeparationUnit = entity.cameraSeparationUnit;
            instance.cameraCrossing = entity.cameraCrossing;
            instance.cameraCrossingUnit = entity.cameraCrossingUnit;
            instance.cameraHeight = entity.cameraHeight;
            instance.cameraHeightUnit = entity.cameraHeightUnit;
            instance.camerasCount = entity.camerasCount;
            instance.cameraType = entity.cameraType;
            instance.focalLengthCorrection = entity.focalLengthCorrection;

            this.records.push(instance);
        }
    }
}

const cameraDAO = new CameraDAO();
// register
registry.register('cameraDAO', cameraDAO);

export default cameraDAO;