// @flow
import {colorSchemeIdx} from "../data_collections/ColorSchemes";
import Generic from "./Generic";

/**
 * @classdesc Class representing general settings.
 * @author Matej Berka <matejb@students.zcu.cz>
 * @extends Generic
 */
export default class General extends Generic {
    // instance variables
    colorSchemeIdx: number = colorSchemeIdx.redCyan;
    /**
     * @override
     */
    getCopy(): General {
        let copy = new General();
        copy.colorSchemeIdx = this.colorSchemeIdx;

        return copy;
    }
    /**
     * @description Getters and Setters for entity values.
     */
    getColorSchemeIdx(): number {
        return this.colorSchemeIdx;
    }
    setColorSchemeIdx(value: number) {
        this.colorSchemeIdx = value;
    }
}