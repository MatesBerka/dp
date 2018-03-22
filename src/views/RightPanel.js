// @flow
import * as React from 'react';
import { Icon, Button, Modal, Header} from 'semantic-ui-react'
import FileSaver from 'file-saver'

import postProcessingDAO from "../model/PostProcessingDAO";
import cameraDAO from "../model/CameraDAO";
import displayAndViewerDAO from "../model/DisplayAndViewerDAO";
import generalDAO from "../model/GeneralDAO";
import sceneObjectDAO from "../model/SceneObjectDAO";
import diagnosticsDAO from "../model/DiagnosticsDAO";
import dispatcher from "../services/Dispatcher";

type Props = {
    sidePanelWidth: number
};
type State = {
    aboutOpen: boolean,
    importOpen: boolean,
};

/**
 * @classdesc React component right panel is used to add some extra functionality to the program, like import and export.
 * @extends Component
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class RightPanel extends React.Component<Props, State> {
    /**
     * Component constructor
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            aboutOpen: false,
            importOpen: false,
        };
    }
    /**
     * Function collects all data to be exported and stores them in a file.
     */
    handleSimulationExport = () => {
        let output = [], text;
        output.push(postProcessingDAO.toJSON());
        output.push(cameraDAO.toJSON());
        output.push(displayAndViewerDAO.toJSON());
        output.push(generalDAO.toJSON());
        output.push(sceneObjectDAO.toJSON());
        output.push(diagnosticsDAO.toJSON());
        // ask components if the want to export something
        let extras = {};
        dispatcher.dispatch('exporting', extras);
        output.push(extras); // and store it
        // and store active model ID, NOTE all DAOs have the same active record ID
        output.push(postProcessingDAO.getActiveRecordID());
        try {
            text = JSON.stringify(output);
        } catch(e) {
            console.error(e);
            alert(e);
        }
        // $FlowFixMe
        let file = new File([text], "simulation_export.txt", {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(file);
    };
    /**
     * Function reads imported file and enters imported models into the simulation.
     */
    handleSimulationImport = () => {
        // $FlowFixMe
        let file = document.getElementById('simulation-upload-input').files[0];
        if (file !== null) {
            let reader = new FileReader();
            reader.onload = function(e) {
                try {
                    // NOTE index represents the order in which the entities where store. See handleSimulationExport.
                    // $FlowFixMe
                    let simulation = JSON.parse(reader.result);
                    postProcessingDAO.fromJSON(simulation[0], simulation[7]);
                    cameraDAO.fromJSON(simulation[1], simulation[7]);
                    displayAndViewerDAO.fromJSON(simulation[2], simulation[7]);
                    generalDAO.fromJSON(simulation[3], simulation[7]);
                    sceneObjectDAO.fromJSON(simulation[4], simulation[7]);
                    diagnosticsDAO.fromJSON(simulation[5], simulation[7]);
                    // if components exported some settings then they can load them back
                    dispatcher.dispatch('importing', simulation[6]);
                    // now notify about model change
                    dispatcher.dispatch('modelSwitch', {});
                } catch(e) {
                    console.error(e);
                    alert(e);
                }
            };
            reader.readAsText(file);
        }
        this.setState({ importOpen: false })
    };
    /* Open model window with file input to allow import */
    handleImportOpen = () => this.setState({ importOpen: true });
    /* Closes import window */
    handleImportClose = () => this.setState({ importOpen: false });
    /* Open modal window with basic information about the application */
    handleAboutOpen = () => this.setState({ aboutOpen: true });
    /* Closes modal window with basic information */
    handleAboutClose = () => this.setState({ aboutOpen: false });
    /**
     * Component HTML representation
     * @return {HTMLElement} rendered component
     */
    render() {
        const { sidePanelWidth } = this.props;

        return (
           <div className="side-panel-column" style={{width: sidePanelWidth}}>
               <div className="option-group-line" onClick={this.handleSimulationExport}>
                   <Icon name='download'/><h4>Export Simulation</h4>
               </div>
               <Modal
                   trigger={<div className="option-group-line" onClick={this.handleImportOpen}><Icon name='upload'/><h4>Import Simulation</h4></div>}
                   open={this.state.importOpen} onClose={this.handleImportClose} size='small'>
                   <Modal.Header>Import Simulator</Modal.Header>
                   <Modal.Content>
                       <div className="ui labeled input"><input type="file" id="simulation-upload-input"/></div>
                   </Modal.Content>
                   <Modal.Actions>
                       <Button color='red' onClick={this.handleImportClose}>Close</Button>
                       <Button color='green' onClick={this.handleSimulationImport}>Import</Button>
                   </Modal.Actions>
               </Modal>

               <Modal
                   trigger={<div className="option-group-line" onClick={this.handleAboutOpen}><Icon name='info'/><h4>About Program</h4></div>}
                   open={this.state.aboutOpen} onClose={this.handleAboutClose} size='small'>
                   <Modal.Header>Stereoscopy Simulator</Modal.Header>
                   <Modal.Content>
                       <Header>About program</Header>
                       <p>Stereoscopy Simulator was created for students to help them better understand how stereoscopy works and for experienced photographers to help them with their experiments.</p>
                       <p>© <a href="http://www.kiv.zcu.cz/cz/katedra/osoby-seznam/osoba-detail.html?login=lobaz">Petr Lobaz</a>, University of West Bohemia</p>
                       <p style={{textAlign: 'right'}}>Program version: 1.0.1 (1.4.2018)</p>
                   </Modal.Content>
                   <Modal.Actions>
                       <Button color='red' onClick={this.handleAboutClose}>Thank you</Button>
                   </Modal.Actions>
               </Modal>
           </div>
        )
    }
}