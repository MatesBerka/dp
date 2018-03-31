// @flow
import DisplayAndViewer from './entities/DisplayAndViewer.js';
import GenericDAO from './GenericDAO.js';
import registry from "../services/RegistryService";
/**
 * @classdesc Class representing Data access object for DisplayAndViewer entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class DisplayAndViewerDAO extends GenericDAO {
    records: Array<DisplayAndViewer>;
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
        this.records.push(new DisplayAndViewer());
    }
    /**
     * @override
     */
    toJSON(): Array<Object> {
        let entities = [];
        for (let instance of this.records) {
            entities.push({
                displayType: instance.displayType,
                viewingComfort: instance.viewingComfort,
                displayStereoPPL: instance.displayStereoPPL,
                displayCameraLeft: instance.displayCameraLeft,
                displayCameraOffset: instance.displayCameraOffset,
                displayLPI: instance.displayLPI,
                displayDPI: instance.displayDPI,
                displayViewAngle: instance.displayViewAngle,
                displayViewAngleUnit: instance.displayViewAngleUnit,
                headOptimalDistance: instance.headOptimalDistance,
                headOptimalDistanceUnit: instance.headOptimalDistanceUnit,
                displayPPL: instance.displayPPL,
                displayWidth: instance.displayWidth,
                displayWidthUnit: instance.displayWidthUnit,
                displayAspect: instance.displayAspect,
                headDistance: instance.headDistance,
                headDistanceUnit: instance.headDistanceUnit,
                headPosition: instance.headPosition,
                headPositionUnit: instance.headPositionUnit,
                eyesSeparation: instance.eyesSeparation,
                eyesSeparationUnit: instance.eyesSeparationUnit,
                mechanicalPitch: instance.mechanicalPitch,
                mechanicalPitchUnit: instance.mechanicalPitchUnit,
                displayDepth: instance.displayDepth,
                displayDepthUnit: instance.displayDepthUnit,
                visualPitch: instance.visualPitch,
                visualPitchUnit: instance.visualPitchUnit,
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
            instance = new DisplayAndViewer();

            instance.displayType = entity.displayType;
            instance.viewingComfort = entity.viewingComfort;
            instance.displayStereoPPL = entity.displayStereoPPL;
            instance.displayCameraLeft = entity.displayCameraLeft;
            instance.displayCameraOffset = entity.displayCameraOffset;
            instance.displayLPI = entity.displayLPI;
            instance.displayDPI = entity.displayDPI;
            instance.displayViewAngle = entity.displayViewAngle;
            instance.displayViewAngleUnit = entity.displayViewAngleUnit;
            instance.headOptimalDistance = entity.headOptimalDistance;
            instance.headOptimalDistanceUnit = entity.headOptimalDistanceUnit;
            instance.displayPPL = entity.displayPPL;
            instance.displayWidth = entity.displayWidth;
            instance.displayWidthUnit = entity.displayWidthUnit;
            instance.displayAspect = entity.displayAspect;
            instance.headDistance = entity.headDistance;
            instance.headDistanceUnit = entity.headDistanceUnit;
            instance.headPosition = entity.headPosition;
            instance.headPositionUnit = entity.headPositionUnit;
            instance.eyesSeparation = entity.eyesSeparation;
            instance.eyesSeparationUnit = entity.eyesSeparationUnit;
            instance.mechanicalPitch = entity.mechanicalPitch;
            instance.mechanicalPitchUnit = entity.mechanicalPitchUnit;
            instance.displayDepth = entity.displayDepth;
            instance.displayDepthUnit = entity.displayDepthUnit;
            instance.visualPitch = entity.visualPitch;
            instance.visualPitchUnit = entity.visualPitchUnit;

            this.records.push(instance);
        }
    }
}

const displayAndViewerDAO = new DisplayAndViewerDAO();
// register
registry.register('displayAndViewerDAO', displayAndViewerDAO);

export default displayAndViewerDAO;