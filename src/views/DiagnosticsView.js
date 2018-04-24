// @flow
import * as React from 'react';
import { Popup, Checkbox, Accordion, Icon, Label } from 'semantic-ui-react'

import diagnosticsService from '../services/DiagnosticsService.js';
import dispatcher from '../services/Dispatcher'
import Diagnostics from "../model/entities/Diagnostics";
import type {vec4} from "../model/data_collections/flowTypes";

type Props = {
    centerPanelWidth: number,
    updateViewsSize: Function
};
type State = {
    stats: Diagnostics;
    activeModelID: number;
    models: Array<{toggleDiagnostics: boolean}>;
    toggleDiagnosticsOldVal: boolean;
};

/**
 * @classdesc React component diagnostics is used to display extra information about the simulation.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class DiagnosticsView extends React.Component<Props, State> {
    SHOW_DIAGNOSTICS_DEFAULT: boolean = true;
    modelSwitchListener: Function;
    diagnosticsUpdateListener: Function;
    getCenterPanelSettingsListener: Function;
    modelDeleteListener: Function;
    pasteListener: Function;
    exportListener: Function;
    importListener: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            this.SHOW_DIAGNOSTICS_DEFAULT = false;
        this.state = {
            activeModelID: 0,
            models: [{toggleDiagnostics: this.SHOW_DIAGNOSTICS_DEFAULT}],
            toggleDiagnosticsOldVal: false,
            stats: diagnosticsService.getActiveRecord(),
        };
    }
    /**
     * After the component is added the DOM register event listeners and call diagnostics service to compute diag. values.
     */
    componentDidMount() {
        diagnosticsService.updateDiagnostics();
        // register event listeners
        this.modelSwitchListener = function(payload) {
            if (payload.modelID === this.state.models.length) { // new model
                this.state.models.push({
                    toggleDiagnostics: this.SHOW_DIAGNOSTICS_DEFAULT
                });
            }

            diagnosticsService.switchModel();
            this.setState({ activeModelID: payload.modelID, stats: diagnosticsService.getActiveRecord() });
        }.bind(this);

        this.modelDeleteListener = function(payload) {
            this.state.models.splice(payload.modelIDToRemove, 1);
        }.bind(this);

        this.diagnosticsUpdateListener = function(payload) {
            this.forceUpdate();
        }.bind(this);

        this.exportListener = function(payload) {
            payload['diagnosticsView'] = [this.state.models, this.state.activeModelID, this.state.stats.isGlobalActive()]
        }.bind(this);

        this.importListener = function(payload) {
            this.state.stats.setIsGlobal(payload['diagnosticsView'][2]);
            this.setState({
                activeModelID:  payload['diagnosticsView'][1],
                models:  payload['diagnosticsView'][0],
            });
        }.bind(this);

        this.getCenterPanelSettingsListener = function(payload) {
            payload['diagnosticsViewC'] = [Object.assign({}, this.state.models[this.state.activeModelID]), this.state.stats.isGlobalActive()];
        }.bind(this);

        this.pasteListener = function(payload) {
            let models = this.state.models;
            if (payload.hasOwnProperty('diagnosticsViewC')) {
                models[this.state.activeModelID] = Object.assign({}, payload['diagnosticsViewC'][0]);
                this.state.stats.setIsGlobal(payload['diagnosticsViewC'][1]);
            }
            this.forceUpdate();
        }.bind(this);

        dispatcher.register('getCenterPanelSettings', this.getCenterPanelSettingsListener);
        dispatcher.register('paste', this.pasteListener);
        dispatcher.register('exporting', this.exportListener);
        dispatcher.register('importing', this.importListener);
        dispatcher.register('modelDelete', this.modelDeleteListener);
        dispatcher.register('modelSwitch', this.modelSwitchListener);
        dispatcher.register('configurationUpdate', this.diagnosticsUpdateListener);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('getCenterPanelSettings', this.getCenterPanelSettingsListener);
        dispatcher.unregister('paste', this.pasteListener);
        dispatcher.unregister('exporting', this.exportListener);
        dispatcher.unregister('importing', this.importListener);
        dispatcher.unregister('modelDelete', this.modelDeleteListener);
        dispatcher.unregister('modelSwitch', this.modelSwitchListener);
        dispatcher.unregister('configurationUpdate', this.diagnosticsUpdateListener);
    };
    /**
     * Calls callback to update views size if diagnostics sections was closed/opened.
     */
    componentDidUpdate() {
        if (this.state.models[this.state.activeModelID].toggleDiagnostics !== this.state.toggleDiagnosticsOldVal) {
            this.setState((prevState) => {
                return {toggleDiagnosticsOldVal: !prevState.toggleDiagnosticsOldVal}
            });
            this.props.updateViewsSize(this.state.activeModelID);
        }
    };
    /**
     * Toggles global state for diagnostics service.
     */
    handleToggleGlobalStat = (e: SyntheticEvent<>) => {
        this.state.stats.toggleIsGlobal();
        diagnosticsService.updateDiagnostics();
        this.forceUpdate();
        e.stopPropagation();
    };
    /**
     * Function opens or closes diagnostics view.
     */
    handleToggleDiagnosticsView = () => {
        let activeModel = this.state.models[this.state.activeModelID];
        activeModel.toggleDiagnostics = !activeModel.toggleDiagnostics;
        this.forceUpdate();
    };
    /**
     * Helper function used to convert diagnostics values to displayed output and alert in case of out of range values.
     * @param {string | vec4} value diagnostics entity value
     */
    _convert = (value: string | vec4) => {
        if (typeof value === 'string')
            return value;
        if (value[0] < -1e5 || value[0] > 1e5)
            return (<Label color="red" className="warning-label"><Icon name='warning'/>HUGE</Label>);

        let val = (Number(value[0].toPrecision(value[1]))).toString(), sgnLength;
        if (value[0] < 0) sgnLength = 1; else sgnLength = 0;
        if (val.length > value[1] + 2 + sgnLength && value[0] < 1 && value[0] > -1) // cut
            val = val.slice(0, value[1] + 2 + sgnLength);
        if (value[2] !== value[3] && (value[0] < value[2] || value[0] > value[3])) // if out of range
            return (<Label color="orange" className="warning-label"><Icon name='warning'/>{val}</Label>);
        return val;
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { centerPanelWidth } = this.props;
        const { stats } = this.state;
        const activeModel = this.state.models[this.state.activeModelID];

        return (
            <footer id="diagnostics" style={{width: centerPanelWidth}}>
                <Accordion fluid>
                    <Accordion.Title active={activeModel.toggleDiagnostics} onClick={this.handleToggleDiagnosticsView} id="diagnostics-header">
                        <Icon name='dropdown' /><h4>Diagnostics</h4>
                    </Accordion.Title>
                    <Accordion.Content active={activeModel.toggleDiagnostics}  id="diagnostics-body">
                        <div className="diagnostics-block">
                            <h3>Viewer view</h3><br/>
                            <Popup trigger={<Checkbox label='Compute globally' onChange={this.handleToggleGlobalStat} checked={stats.isGlobalActive()}/>}
                                content='In case of multiple cameras diagnostic is computed from the first and last camera.' inverted />
                            {/*<div className="diagnostics-line">*/}
                                {/*<label><strong>Vergence Range:</strong></label>*/}
                            {/*</div>*/}
                            <div className="diagnostics-line">
                                <label><strong>Vergence rel. to display: </strong></label><span>{this._convert(stats.getVergenceMinRel())}
                                cm to {this._convert(stats.getVergenceMaxRel())} cm ({this._convert(stats.getVergenceMinRelD())}
                                to {this._convert(stats.getVergenceMaxRelD())} D)</span>
                            </div>
                            {/*<div className="diagnostics-line">*/}
                                {/*<label><strong>Absolute: </strong></label><span>{this._convert(stats.getVergenceMinAbs())}*/}
                                {/*cm to {this._convert(stats.getVergenceMaxAbs())} cm</span>*/}
                            {/*</div>*/}
                            <div className="diagnostics-line">
                                <label><strong>horizontal on-screen disparity </strong></label>
                                <span>(negative: behind the screen; positive: in front)</span>:
                            </div>
                            <div className="diagnostics-line">
                                <span>min: {this._convert(stats.getDisparityXMinMM())} mm ({this._convert(stats.getDisparityXMinPct())} %,
                                {this._convert(stats.getDisparityXMinPx())} px, )  ~  conv. {this._convert(stats.getDisparityXMinConv())}°
                                (parallax {this._convert(stats.getDisparityXMinParallax())}°)</span>
                            </div>
                            <div className="diagnostics-line">
                                <span>max: {this._convert(stats.getDisparityXMaxMM())} mm ({this._convert(stats.getDisparityXMaxPct())} %,
                                {this._convert(stats.getDisparityXMaxPx())} px, )  ~  conv. {this._convert(stats.getDisparityXMaxConv())}°
                                (parallax {this._convert(stats.getDisparityXMaxParallax())}°)</span>
                            </div>
                            <div className="diagnostics-line">
                                <label><strong>vertical on-screen disparity:</strong></label>
                            </div>
                            <div className="diagnostics-line">
                                <span>max: {this._convert(stats.getDisparityYMaxMM())} mm ({this._convert(stats.getDisparityYMaxPct())} %,
                                {this._convert(stats.getDisparityYMaxPx())} px, )  ~  (parallax {this._convert(stats.getDisparityYMaxParallax())}')</span>
                            </div>
                        </div>
                        <div className="diagnostics-block">
                            <h3>Cameras view</h3>
                            <div className="diagnostics-line">
                                <Popup trigger={<label><strong>Depth of field: </strong></label>}
                                    content='Values are measured from the cameras to the focus point.' inverted />
                                <br/>
                                <span>Near: {stats.getCamerasZNear().toPrecision(4)} m</span><br/>
                                <span>Far: {stats.getCamerasZFar().toPrecision(4)} m</span>
                            </div>
                        </div>
                    </Accordion.Content>
                </Accordion>
            </footer>
        )
    }
}