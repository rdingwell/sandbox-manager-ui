import React, { Component } from 'react';
import { app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { getPatientName } from '../../../../../../lib/utils/fhir';
import {
    CircularProgress, Paper, RaisedButton, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, Dialog, Card, TextField,
    FlatButton, IconButton
} from 'material-ui';
import EditIcon from 'material-ui/svg-icons/image/edit';
import PersonaList from '../Persona/PersonaList';
import Apps from '../Apps';

import './styles.less';
import DohMessage from "../../../../../../lib/components/DohMessage";

class LaunchScenarios extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showModal: false,
            descriptionEditing: false,
            selectedScenario: undefined,
            description: ''
        }
    }

    componentDidMount () {
        this.props.app_setScreen('launch');
        this.props.loadLaunchScenarios();
    }

    componentWillReceiveProps (nextProps) {
        ((this.props.creating && !nextProps.creating) || (this.props.deleting && !nextProps.deleting)) && this.props.loadLaunchScenarios();
    }

    render () {
        return <div className='launch-scenarios-wrapper'>
            <Paper className='paper-card'>
                <h3>Launch Scenarios</h3>
                <div className='actions'>
                    <RaisedButton primary label='Build Launch Scenario' onClick={this.toggleModal} />
                </div>
                <div className='paper-body'>
                    {(this.props.scenariosLoading || this.props.creating || this.props.deleting) && <div className='loader-wrapper'>
                        <CircularProgress size={80} thickness={5} />
                    </div>}
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 && this.getScenarios()}
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length === 0 &&
                    <DohMessage message='There are no launch scenarios in this sandbox platform yet.' />}
                </div>
            </Paper>
            {this.getModal()}
        </div>
    }

    launchScenario = () => {
        this.state.selectedScenario && this.props.doLaunch(this.state.selectedScenario.app, this.state.selectedScenario.patient, this.state.selectedScenario.userPersona);
        !this.state.selectedScenario && this.props.doLaunch(this.state.selectedApp, this.state.selectedPatient, this.state.selectedPersona);
    };

    handleRowSelect = (row) => {
        this.setState({ selectedScenario: this.props.scenarios[row] }, this.toggleModal);
    };

    getModal = () => {
        let title = this.state.selectedScenario ? 'Launch Scenario Details' : '';
        let actions = this.state.selectedScenario ? this.getDetailsActions() : this.getBuildActions();
        let content = this.state.selectedScenario ? this.getDetailsContent() : this.getBuildContent();

        return <Dialog open={this.state.showModal} modal={false} onRequestClose={this.toggleModal} contentClassName='launch-scenario-dialog' actions={actions}>
            <IconButton className="close-button" onClick={this.toggleModal}>
                <i className="material-icons">close</i>
            </IconButton>
            {this.state.selectedScenario && <Paper className='paper-card'>
                <h3>{title}</h3>
                <div className='paper-body launch-scenario-modal'>
                    {content}
                </div>
            </Paper>}
            {!this.state.selectedScenario && content}
        </Dialog>
    };

    getBuildActions = () => {
        let actions = [<RaisedButton key={3} label='Cancel' className='launch-scenario-dialog-action' onClick={this.toggleModal} />];
        return this.state.selectedApp && ([<RaisedButton key={1} label='Just Launch' primary className='launch-scenario-dialog-action' onClick={this.launchScenario} />,
            <RaisedButton key={2} label='Save' secondary className='launch-scenario-dialog-action' onClick={this.createScenario} />]).concat(actions);
    };

    createScenario = () => {
        let data = {
            app: this.state.selectedApp,
            description: this.state.description,
            lastLaunchSeconds: Date.now(),
            patient: {
                fhirId: this.state.selectedPatient.id,
                name: getPatientName(this.state.selectedPatient),
                resource: 'Patient'
            },
            sandbox: this.props.sandbox,
            userPersona: this.state.selectedPersona,
            createdBy: this.props.user
        };

        this.props.createScenario(data);
        this.toggleModal();
    };

    getDetailsActions = () => {
        return [
            <RaisedButton key={1} label='Launch' primary className='launch-scenario-dialog-action' onClick={this.launchScenario} />,
            <RaisedButton key={2} label='Delete' secondary className='launch-scenario-dialog-action' onClick={this.deleteScenario} />
        ];
    };

    deleteScenario = () => {
        this.props.deleteScenario(this.state.selectedScenario);
        this.toggleModal();
    };

    getBuildContent = () => {
        if (!this.state.selectedPatient) {
            let type = this.state.selectedPersona ? PersonaList.TYPES.patient : PersonaList.TYPES.persona;
            let title = this.state.selectedPersona ? 'Select a patient' : 'Select a persona';
            let personas = this.state.selectedPersona ? this.props.patients : this.props.personas;
            let pagination = this.state.selectedPersona ? this.props.patientsPagination : this.props.personasPagination;
            let click = this.state.selectedPersona
                ? selectedPatient => this.setState({ selectedPatient })
                : selectedPersona => this.setState({ selectedPersona });
            let actions = this.state.selectedPersona
                ? <RaisedButton primary label='Continue without a Patient' onClick={() => this.setState({ selectedPatient: {} })} />
                : [];

            let props = {
                title, type, click, personas, pagination, actions,
                next: () => this.props.getPersonasPage(type, pagination, 'next'),
                prev: () => this.props.getPersonasPage(type, pagination, 'previous')
            };

            return <PersonaList {...props} />;
        } else if (!this.state.selectedApp) {
            return <Apps title='Select app' noActions onCardClick={selectedApp => this.setState({ selectedApp })} />
        } else {
            return <Paper className='paper-card'>
                <h3>Save Launch Scenario</h3>
                <div className='paper-body'>
                    <TextField floatingLabelText='Description' fullWidth onChange={(_e, description) => this.setState({ description })} />
                    <TextField floatingLabelText='Persona' fullWidth disabled value={this.state.selectedPersona.personaName} />
                    <TextField floatingLabelText='Patient' fullWidth disabled value={this.state.selectedPatient ? getPatientName(this.state.selectedPatient) : 'NONE'} />
                    <TextField floatingLabelText='App' fullWidth disabled value={this.state.selectedApp.authClient.clientName} />
                </div>
            </Paper>
        }
    };

    getDetailsContent = () => {
        let patient = this.state.selectedScenario.patient;
        let label = this.state.selectedScenario.userPersona !== null && this.state.selectedScenario.userPersona.resource === 'Practitioner'
            ? `Launch App as a Practitioner with ${patient.fhirId !== '0' ? '' : 'NO'} Patient Context`
            : 'Launch an App As a Patient';

        return [
            <div key={0}>
                <span>{label}</span>
            </div>,
            <div key={1} className='details-pair smaller-label'>
                <label>Description:</label>
                <span>
                    {this.state.descriptionEditing
                        ? <TextField defaultValue={this.state.selectedScenario.description} id='description' onBlur={this.updateScenario} />
                        : this.state.selectedScenario.description}
                    <FlatButton className='description-edit-button' primary icon={<EditIcon />} onClick={this.toggleDescriptionEdit} />
                </span>
            </div>,
            <div key={2} className='details-pair smaller-label'>
                <label>Launch Embedded: </label>
            </div>,
            <Card key={3} className='launch-scenario-dialog-detail'>
                <h3>Persona</h3>
                <div>
                    <div className='details-pair'>
                        <label>Launch As:</label>
                        <span>{this.state.selectedScenario.userPersona.fhirName}</span>
                    </div>
                    <div className='details-pair'>
                        <label>User Id:</label>
                        <span>{this.state.selectedScenario.userPersona.personaUserId}</span>
                    </div>
                    <div className='details-pair'>
                        <label>FHIR Resource Type:</label>
                        <span>
                            <i className={`fa ${this.state.selectedScenario.userPersona.resource === 'Patient' ? 'fa-bed' : 'fa-user-md'}`} />
                            {this.state.selectedScenario.userPersona.resource}
                        </span>
                    </div>
                </div>
            </Card>,
            <Card key={4} className='launch-scenario-dialog-detail margin'>
                <h3>With Context</h3>
                <div>
                    <div className='details-pair'>
                        <label>Patient:</label>
                        <span>{this.state.selectedScenario.patient.name}</span>
                    </div>
                    <div className='details-pair'>
                        <label>Encounter:</label>
                        <span>None</span>
                    </div>
                    <div className='details-pair'>
                        <label>Location:</label>
                        <span>None</span>
                    </div>
                </div>
            </Card>,
            <Card key={5} className='launch-scenario-dialog-detail full'>
                <h3>App</h3>
                <div>
                    <div className='details-pair smaller-label'>
                        <label>{this.state.selectedScenario.app.authClient.clientName}</label>
                        <span className='center'>
                            <img src={this.state.selectedScenario.app.logoUri
                                ? this.state.selectedScenario.app.logoUri
                                : 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} />
                        </span>
                    </div>
                </div>
            </Card>]
    };

    toggleModal = () => {
        let showModal = !this.state.showModal;
        let selectedScenario = showModal ? this.state.selectedScenario : undefined;
        showModal && !selectedScenario && !this.props.personas && this.props.fetchPersonas(PersonaList.TYPES.persona);
        showModal && !selectedScenario && !this.props.patients.length && this.props.fetchPersonas(PersonaList.TYPES.patient);
        showModal && !selectedScenario && this.state.selectedPersona && this.props.fetchPersonas(PersonaList.TYPES.patient);
        this.setState({ showModal, selectedScenario, selectedPatient: undefined, selectedPersona: undefined, selectedApp: undefined, description: '' });
    };

    toggleDescriptionEdit = () => {
        this.setState({ descriptionEditing: !this.state.descriptionEditing });
    };

    updateScenario = (e) => {
        e.target.value !== this.state.selectedScenario.description && this.props.updateLaunchScenario(this.state.selectedScenario, e.target.value);
        this.toggleDescriptionEdit();
    };

    getScenarios = () => {
        return <Table selectable={false} fixedHeader width='100%' onCellClick={this.handleRowSelect} wrapperClassName='sample'>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>Description</TableHeaderColumn>
                    <TableHeaderColumn>User Persona</TableHeaderColumn>
                    <TableHeaderColumn>Patient Context</TableHeaderColumn>
                    <TableHeaderColumn>App</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows showRowHover>
                {this.props.scenarios.map((sc, index) =>
                    <TableRow key={index} hoverable className='launch-scenario-list-row'>
                        <TableRowColumn>
                            {sc.description}
                        </TableRowColumn>
                        <TableRowColumn>
                            {sc.userPersona && sc.userPersona.personaName}
                        </TableRowColumn>
                        <TableRowColumn>
                            {sc.patient && sc.patient.name}
                        </TableRowColumn>
                        <TableRowColumn>
                            {sc.app.authClient.clientName}
                        </TableRowColumn>
                    </TableRow>
                )}
            </TableBody>
            {this.props.pagination && this.getPagination()}
        </Table>
    };
}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        creating: state.sandbox.launchScenarioCreating,
        deleting: state.sandbox.launchScenarioDeleting,
        scenariosLoading: state.sandbox.launchScenariosLoading,
        scenarios: state.sandbox.launchScenarios,
        personasPagination: state.persona.personasPagination,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        patients: state.persona.patients,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === state.sandbox.selectedSandbox)
    }
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario },
    dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(LaunchScenarios))
