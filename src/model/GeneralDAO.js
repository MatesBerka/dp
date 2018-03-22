// @flow
import General from './entities/General.js';
import GenericDAO from "./GenericDAO";
/**
 * @classdesc Class representing Data access object for General entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */

class GeneralDAO extends GenericDAO {
    records: Array<General>;
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
        this.records.push(new General());
    }
    /**
     * @override
     */
    toJSON(): Array<Object> {
        let entities = [];
        for (let instance of this.records) {
            entities.push({
                colorSchemeIdx: instance.colorSchemeIdx,
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
            instance = new General();
            instance.colorSchemeIdx = entity.colorSchemeIdx;

            this.records.push(instance);
        }
    }
}

const generalDAO = new GeneralDAO();

export default generalDAO;