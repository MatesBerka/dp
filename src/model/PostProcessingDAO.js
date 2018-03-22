// @flow
import PostProcessing from './entities/PostProcessing.js';
import GenericDAO from "./GenericDAO.js";
/**
 * @classdesc Class representing Data access object for PostProcessing entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class PostProcessingDAO extends GenericDAO {
    records: Array<PostProcessing>;
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
        this.records.push(new PostProcessing());
    }
    /**
     * @override
     */
    toJSON(): Array<Object> {
        let entities = [];
        for (let instance of this.records) {
            entities.push({
                imagesShift: instance.imagesShift,
                imagesShiftUnit: instance.imagesShiftUnit,
                imagesKeystone: instance.imagesKeystone,
                imagesKeystoneUnit: instance.imagesKeystoneUnit,
                imagesStretch: instance.imagesStretch,
                imagesStretchUnit: instance.imagesStretchUnit,
                imagesZoom: instance.imagesZoom,
                imagesZoomUnit: instance.imagesZoomUnit,
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
            instance = new PostProcessing();
            instance.imagesShift = entity.imagesShift;
            instance.imagesShiftUnit = entity.imagesShiftUnit;
            instance.imagesKeystone = entity.imagesKeystone;
            instance.imagesKeystoneUnit = entity.imagesKeystoneUnit;
            instance.imagesStretch = entity.imagesStretch;
            instance.imagesStretchUnit = entity.imagesStretchUnit;
            instance.imagesZoom = entity.imagesZoom;
            instance.imagesZoomUnit = entity.imagesZoomUnit;

            this.records.push(instance);
        }
    }
}

const postProcessingDAO = new PostProcessingDAO();

export default postProcessingDAO;