// @flow
/**
 * @classdesc Dispatcher class used as communication channel between components.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class Dispatcher {
    actions: Map<string, Set<Function>> = new Map();
    /**
     * Registers new event listener for selected action.
     * @param {string} action
     * @param {Function} callback
     * @public
     */
    register(action: string, callback: Function) {
        if (this.actions.has(action)) {
            let callbacks = this.actions.get(action);
            if (typeof callbacks !== 'undefined')
                callbacks.add(callback);
        } else {
            this.actions.set(action, new Set([callback]));
        }
    }
    /**
     * Removes event listener from dispatcher set.
     * @param {string} action
     * @param {Function} callback
     * @public
     */
    unregister(action: string, callback: Function) {
        let callbacks = this.actions.get(action);
        if (typeof callbacks !== 'undefined')
            if (callbacks.has(callback))
                callbacks.delete(callback);
    }
    /**
     * Distributes event payload to registered callbacks.
     * @param {string} action
     * @param {Object} payload
     */
    dispatch(action: string, payload: Object) {
        let callbacks = this.actions.get(action);
        if (typeof callbacks !== 'undefined')
            for (let callback of callbacks)
                callback(payload);
    }
}

export default new Dispatcher();