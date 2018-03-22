import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';
import Simulator from './views/Simulator';

/**
 * @description Program starting point.
 * @author Matej Berka <matejb@students.zcu.cz>
 */

// This code detects if passive event listeners are available
window.passiveEventListener = true;
try {
    let options = Object.defineProperty({}, "passive", {
        get: function() {
            window.passiveEventListener = { passive: true };
        }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
} catch(err) {
    window.passiveEventListener = true;
}

if (document.body !== null) {
    // React start point
    ReactDOM.render(<Simulator />, document.getElementById('simulation-wrapper'));

    registerServiceWorker();
}
