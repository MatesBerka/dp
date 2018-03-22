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
    toggleDiagnosticsOldVal: boolean;
    toggleDiagnostics: boolean;
};

/**
 * @classdesc React component diagnostics is used to display extra information about the simulation.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class DiagnosticsView extends React.Component<Props, State> {
    modelSwitchListener: Function;
    diagnosticsUpdate: Function;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            stats: diagnosticsService.getActiveRecord(),
            toggleDiagnosticsOldVal: false,
            toggleDiagnostics: false
        };
    }
    /**
     * After the component is added the DOM register event listeners and call diagnostics service to compute diag. values.
     */
    componentDidMount() {
        diagnosticsService.updateDiagnostics();
        // register event listeners
        this.modelSwitchListener = function(payload) {
            diagnosticsService.switchModel();
            this.setState({ stats: diagnosticsService.getActiveRecord() });
        }.bind(this);
        dispatcher.register('modelSwitch', this.modelSwitchListener);
        this.diagnosticsUpdate = function(payload) {
            diagnosticsService.updateDiagnostics();
            this.forceUpdate();
        }.bind(this);
        dispatcher.register('configurationUpdate', this.diagnosticsUpdate);
    }
    /**
     * After the component is removed from the DOM unregister listeners
     */
    componentWillUnmount() {
        dispatcher.unregister('modelSwitch', this.modelSwitchListener);
        dispatcher.unregister('configurationUpdate', this.diagnosticsUpdate);
    };
    /**
     * Calls callback to update views size if diagnostics sections was closed/opened.
     */
    componentDidUpdate() {
        if (this.state.toggleDiagnostics !== this.state.toggleDiagnosticsOldVal) {
            this.setState((prevState) => {
                return {toggleDiagnosticsOldVal: !prevState.toggleDiagnosticsOldVal}
            });
            this.props.updateViewsSize();
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
        this.setState((prevState) => {
            return {toggleDiagnostics: !prevState.toggleDiagnostics}
        });
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
        const { stats, toggleDiagnostics } = this.state;

        return (
            <footer id="diagnostics" style={{width: centerPanelWidth}}>
                <Accordion fluid>
                    <Accordion.Title active={toggleDiagnostics} onClick={this.handleToggleDiagnosticsView} id="diagnostics-header">
                        <Icon name='dropdown' /><h4>Diagnostics</h4>
                        <Popup trigger={<Checkbox label='Global' onChange={this.handleToggleGlobalStat} checked={stats.isGlobalActive()}
                            style={{float: 'right', padding: '5px'}} />} content='In case of multiple cameras diagnostic is computed from the first and last camera.' inverted />
                    </Accordion.Title>
                    <Accordion.Content active={toggleDiagnostics}  id="diagnostics-body">
                        <div className="diagnostics-line">
                            <Popup trigger={<label><strong>Vergence Range:</strong></label>} content='Hello. This is an inverted popup' inverted />
                        </div>
                        <div className="diagnostics-line">
                            <label><strong>Rel. to display: </strong></label><span>{this._convert(stats.getVergenceMinRel())}
                            cm to {this._convert(stats.getVergenceMaxRel())} cm ({this._convert(stats.getVergenceMinRelD())}
                            to {this._convert(stats.getVergenceMaxRelD())} D)</span>
                        </div>
                        <div className="diagnostics-line">
                            <label><strong>Absolute: </strong></label><span>{this._convert(stats.getVergenceMinAbs())}
                            cm to {this._convert(stats.getVergenceMaxAbs())} cm</span>
                        </div>
                        <div className="diagnostics-line">
                            <Popup trigger={<label><strong>horizontal on-screen disparity </strong></label>} content='Hello. This is an inverted popup' inverted />
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
                            <Popup trigger={<label><strong>vertical on-screen disparity:</strong></label>} content='jkl' inverted />
                        </div>
                        <div className="diagnostics-line">
                            <span>max: {this._convert(stats.getDisparityYMaxMM())} mm ({this._convert(stats.getDisparityYMaxPct())} %,
                            {this._convert(stats.getDisparityYMaxPx())} px, )  ~  (parallax {this._convert(stats.getDisparityYMaxParallax())}')</span>
                        </div>
                    </Accordion.Content>
                </Accordion>
            </footer>
        )
    }
}