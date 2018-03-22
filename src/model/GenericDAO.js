import Generic from "./entities/Generic";

/**
 * @classdesc Abstract class representing generic data access object. Should not be used to create instances.
 * @abstract
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class GenericDAO {
    activeRecordIndex: number = 0;
    records: Array<Generic> = [];
    /**
     * Changes active model.
     * @param {number} recordID.
     */
    setActiveRecord(recordID: number) {
        this.activeRecordIndex = recordID;
    }
    /**
    * Returns active model ID record.
    * @return Generic
    */
    getActiveRecord(): Generic {
        return this.records[this.activeRecordIndex];
    }
    /**
     * Returns active model ID.
     * @return {number}
     */
    getActiveRecordID(): number {
        return this.activeRecordIndex;
    }
    /**
     * Remove entity with entered ID from records.
     * @param {number} recordID
     */
    removeRecord(recordID: number) {
        if (this.activeRecordIndex > recordID)
            this.activeRecordIndex--;
        this.records.splice(recordID, 1);
    }
    /**
    * Creates new entity and adds it into records array.
    */
    addNewRecord() {
        console.error('Not implemented.');
    }
    /**
    * Exports stored records in JSON format.
    * @return {Array<Object> | Array<Array<Object>>}
    */
    toJSON(): Array<Object> | Array<Array<Object>> {
        console.error('Not implemented.');
    }
    /**
    * Replaces existing records with records extracted from JSON input.
    * @param {Array<Object> | Array<Array<Object>>} entities
    * @param {number} activeRecordID
    */
    fromJSON(entities: Array<Object> | Array<Array<Object>>, activeRecordID: number) {
        console.error('Not implemented.');
    }
    /**
    * Copies entity from selected model into currently active model.
    * @param {number} from
    */
    copyRecord(from: number) {
        this.records[this.activeRecordIndex] = this.records[from].getCopy();
    }
}