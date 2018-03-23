// @flow
import * as React from 'react';
import {Button, Icon } from 'semantic-ui-react'
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';

import '../css/Simulator.css'
import dispatcher from '../services/Dispatcher'

type Props = {};
type State = {
    leftPanelWidth: number,
    rightPanelWidth: number,
    centerPanelWidth: number,
    centerPanelHeight: number
};

/**
 * @classdesc React component simulation is the top most component and should be used to store same basic
 * functionality shred across all children.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class Simulator extends React.Component<Props, State> {
    // component constant
    SIDE_PANEL_WIDTH: number = 310;
    // component variables
    handleResizeAction: Function;
    firstVisible: boolean = true;
    secondVisible: boolean = false;
    firstDoubleSize: boolean = false;
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            leftPanelWidth: this.SIDE_PANEL_WIDTH,
            rightPanelWidth: 0,
            centerPanelWidth: Simulator.getAvailableWidth() - this.SIDE_PANEL_WIDTH,
            centerPanelHeight: Simulator.getAvailableHeight()
        };
    }
    /**
     * Helper function to get correct available width.
     * NOTE: Edge has rounding problem thus the -1
     * @return {number} width
     */
    static getAvailableWidth(): number {
        // $FlowFixMe clientWidth can be null
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 1;
    }
    /**
     * Helper function to get correct available height.
     * @return {number} height
     */
    static getAvailableHeight(): number {
        // $FlowFixMe clientHeight can be null
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    /**
     * After screen size is changed this function is triggered to update simulation size.
     */
    updatePanelsSize() {
        let newCenterPanelWidth = Simulator.getAvailableWidth(),
            newCenterPanelHeight = Simulator.getAvailableHeight(),
            newLeftPanelWidth = 0,
            newRightPanelWidth = 0;

        // first update left panel width
        if (this.firstVisible) {
            if (this.firstDoubleSize) {
                newLeftPanelWidth = 2 * this.SIDE_PANEL_WIDTH;
                newCenterPanelWidth -= 2 * this.SIDE_PANEL_WIDTH;
            } else {
                newLeftPanelWidth = this.SIDE_PANEL_WIDTH;
                newCenterPanelWidth -= this.SIDE_PANEL_WIDTH;
            }
        }
        // and now right panel width
        if (this.secondVisible) {
            newRightPanelWidth = this.SIDE_PANEL_WIDTH;
            newCenterPanelWidth -= this.SIDE_PANEL_WIDTH;
        }

        this.setState(() => ({
            centerPanelWidth: newCenterPanelWidth,
            centerPanelHeight: newCenterPanelHeight,
            rightPanelWidth: newRightPanelWidth,
            leftPanelWidth: newLeftPanelWidth,
        }));
    }
    /**
     * After the component is mounted register event listeners.
     */
    componentDidMount() {
        this.handleResizeAction = function() {
            this.updatePanelsSize();
            dispatcher.dispatch('resize', {});
        }.bind(this);
        window.addEventListener("resize", this.handleResizeAction);
    }
    /**
     * After the component is removed from the DOM unregister listeners.
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResizeAction);
    }
    /**
     * Used as a callback function in left panel component to allow children to update application size.
     */
    updateLeftPanelSize = (isDouble: boolean) => {
        this.firstDoubleSize = isDouble;
        this.updatePanelsSize();
    };
    /**
     * Used to show and hide left panel component.
     */
    handleShowConfiguration = (e: Event) => {
        e.preventDefault();
        this.firstVisible = !this.firstVisible;
        this.updatePanelsSize();
    };
    /**
     * Used to show and hide right panel component.
     */
    handleShowSettings = (e: Event) => {
        e.preventDefault();
        this.secondVisible = !this.secondVisible;
        this.updatePanelsSize();
    };
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { centerPanelWidth, centerPanelHeight, leftPanelWidth, rightPanelWidth } = this.state;
        const panelWidth = this.SIDE_PANEL_WIDTH;

        return (
            <section id="stereoscopy-simulator">
                <section id="simulator-configuration" className="side-panel" style={{width: leftPanelWidth}}>
                    <LeftPanel leftPanelWidth={leftPanelWidth} sidePanelWidth={panelWidth} isDouble={this.firstDoubleSize} updateCallback={this.updateLeftPanelSize}/>
                </section>
                <section id="simulator-simulation" style={{width: centerPanelWidth}}>
                    <header id="simulation-header">
                        <Button id="simulator-configuration-btn" onClick={this.handleShowConfiguration}><Icon name='sidebar' style={{margin: 0}}/></Button>
                        <h1>Stereoscopy Simulator</h1>
                        <Button id="simulator-settings-btn" onClick={this.handleShowSettings}><Icon name='settings' style={{margin: 0}}/></Button>
                    </header>
                    <CenterPanel centerPanelWidth={centerPanelWidth -2} centerPanelHeight={centerPanelHeight}/>
                </section>
                <section id="simulator-settings" className="side-panel" style={{width: rightPanelWidth}}>
                    <RightPanel sidePanelWidth={panelWidth} />
                </section>
            </section>
        )
    }
}

export default Simulator