// @flow
import General from './entities/General.js';
import GenericDAO from "./GenericDAO";
import registry from "../services/RegistryService";
/**
 * @classdesc Class representing Data access object for General entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */

class GeneralDAO extends GenericDAO {
    /** @override */
    name: string = 'GeneralDAO';
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
// register
registry.register('generalDAO', generalDAO);

export default generalDAO;