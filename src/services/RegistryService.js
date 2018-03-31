// @flow
import GenericDAO from "../model/GenericDAO";

/**
 * @classdesc Dispatcher class used as communication channel between components.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class RegistryService {
    DAOs: Map<string, GenericDAO> = new Map();
    /**
     * Registers new DAO into set.
     * @param {string} keyword
     * @param {GenericDAO} dao
     * @public
     */
    register(keyword: string, dao: GenericDAO) {
        this.DAOs.set(keyword, dao);
    }
    /**
     * Returns DAO instance.
     * @param {string} keyword
     * @public
     */
    lookup(keyword: string) {
        if (this.DAOs.has(keyword))
            return this.DAOs.get(keyword);
        return null;
    }
    /**
     * Returns all registered DAOs.
     * @return {Map<string, GenericDAO>} collection
     */
    getAll(): Map<string, GenericDAO> {
        return this.DAOs;
    }
}

export default new RegistryService();