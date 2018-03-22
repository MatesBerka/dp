import {unitDefinition} from "../data_collections/UnitsDefinition";

/**
 * @classdesc Class representing generic settings.
 * @abstract
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class Generic {
    /**
     * Generic function used to get value for view controls. Returns converted value.
     * @param {string} varName variable name
     * @return {any}
     */
    getValueForControl(varName) {
        if (typeof this[varName + 'Unit'] !== 'undefined') {
            return this[varName] / unitDefinition[this[varName + 'Unit']].value;
        } else {
            return this[varName];
        }
    }
    /**
     * Generic function used to store value back into corresponding record. Converts value back into default unit.
     * @param {string} varName variable name
     * @param {any} value
     */
    setValueForControl(varName, value) {
        if (typeof this[varName + 'Unit'] !== 'undefined') {
            this[varName] = value * unitDefinition[this[varName + 'Unit']].value;
        } else {
            this[varName] = value;
        }
    }
    /**
     * Function used to create record/entity copy
     * @return {Generic}
     */
    getCopy(): Generic {
        console.error('Not implemented');
    }
}