import React, { Component } from 'react';
import { app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { getPatientName } from '../../../../../../lib/utils/fhir';
import { CircularProgress, RaisedButton, Card, TextField, Dialog, FlatButton, List, ListItem, IconButton } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/image/edit';
import PersonaList from '../Persona/PersonaList';
import Apps from '../Apps';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import DeleteIcon from "material-ui/svg-icons/action/delete";

import './styles.less';
import DohMessage from "../../../../../../lib/components/DohMessage";
import Filters from './Filters';
import muiThemeable from "material-ui/styles/muiThemeable";

class LaunchScenarios extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showModal: false,
            descriptionEditing: false,
            selectedScenario: undefined,
            willOpen: undefined,
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
            <div>
                <div className='screen-title'>
                    <h1>Launch Scenarios</h1>
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 &&
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedFilters={this.state.appIdFilter} />}
                    <div className='actions'>
                        <RaisedButton primary label='Build Launch Scenario' onClick={this.toggleModal} />
                    </div>
                </div>
                <div className='screen-content'>
                    {(this.props.scenariosLoading || this.props.creating || this.props.deleting) && <div className='loader-wrapper'>
                        <CircularProgress size={80} thickness={5} />
                    </div>}
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 && this.getScenarios()}
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length === 0 &&
                    <DohMessage message='There are no launch scenarios in this sandbox platform yet.' />}
                </div>
            </div>
            {this.getModal()}
        </div>
    }

    onFilter = (appId) => {
        this.setState({ appIdFilter: appId });
    };

    launchScenario = (sc) => {
        this.props.doLaunch(sc.app, sc.patient, sc.userPersona);
        !sc && this.props.doLaunch(this.state.selectedApp, this.state.selectedPatient, this.state.selectedPersona);
    };

    handleRowSelect = (row) => {
        let selection = this.state.selectedScenario !== row ? row : undefined;
        this.setState({ willOpen: selection });
        setTimeout(() => this.setState({ selectedScenario: selection }), 200);
    };

    getModal = () => {
        let actions = this.getBuildActions();
        let content = this.getBuildContent();
        let modalTitle = "";
        if (content.props) {
            modalTitle = content.props.title
        }
        return <Dialog open={this.state.showModal} modal={false} onRequestClose={this.toggleModal} contentClassName='launch-scenario-dialog' actions={actions}>
            {modalTitle !== "Select app" && <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.toggleModal}>
                <i className="material-icons">close</i>
            </IconButton>}
            {content}
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

    deleteScenario = (sc) => {
        this.props.deleteScenario(sc || this.state.selectedScenario);
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
                ? <RaisedButton primary label='skip Patient' onClick={() => this.setState({ selectedPatient: {} })} />
                : [];

            let props = {
                title, type, click, personas, pagination, actions, modal: true,
                theme: this.props.muiTheme.palette,
                next: () => this.props.getPersonasPage(type, pagination, 'next'),
                prev: () => this.props.getPersonasPage(type, pagination, 'previous')
            };

            return <PersonaList {...props} />;
        } else if (!this.state.selectedApp) {
            return <Apps title='Select app' noActions onCardClick={selectedApp => this.setState({ selectedApp })} />
        } else {
            return <div>
                <div className='screen-title'>
                    <h1>Save Launch Scenario</h1>
                </div>
                <div>
                    <TextField floatingLabelText='Description' fullWidth onChange={(_e, description) => this.setState({ description })} />
                    <TextField floatingLabelText='Persona' fullWidth disabled value={this.state.selectedPersona.personaName} />
                    <TextField floatingLabelText='Patient' fullWidth disabled value={this.state.selectedPatient ? getPatientName(this.state.selectedPatient) : 'NONE'} />
                    <TextField floatingLabelText='App' fullWidth disabled value={this.state.selectedApp.authClient.clientName} />
                </div>
            </div>
        }
    };

    getDetailsContent = (selectedScenario) => {
        let patient = selectedScenario.patient;
        let label = selectedScenario.userPersona !== null && selectedScenario.userPersona.resource === 'Practitioner'
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
                        ? <TextField defaultValue={selectedScenario.description} id='description' onBlur={this.updateScenario} />
                        : selectedScenario.description}
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
                        <span>{selectedScenario.userPersona.fhirName}</span>
                    </div>
                    <div className='details-pair'>
                        <label>User Id:</label>
                        <span>{selectedScenario.userPersona.personaUserId}</span>
                    </div>
                    <div className='details-pair'>
                        <label>FHIR Resource Type:</label>
                        <span>
                            <i className={`fa ${selectedScenario.userPersona.resource === 'Patient' ? 'fa-bed' : 'fa-user-md'}`} />
                            {selectedScenario.userPersona.resource}
                        </span>
                    </div>
                </div>
            </Card>,
            <Card key={4} className='launch-scenario-dialog-detail margin'>
                <h3>With Context</h3>
                <div>
                    <div className='details-pair'>
                        <label>Patient:</label>
                        <span>{selectedScenario.patient.name}</span>
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
                        <label>{selectedScenario.app.authClient.clientName}</label>
                        <span className='center'>
                            <img src={selectedScenario.app.logoUri
                                ? selectedScenario.app.logoUri
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
        return <List className='scenarios-list'>
            {this.props.scenarios.map((sc, index) => {
                    let isSelected = this.state.selectedScenario === index;
                    let willOpen = this.state.willOpen === index;
                    let itemStyles = isSelected ? { backgroundColor: this.props.muiTheme.palette.primary5Color } : { backgroundColor: 'transparent' };
                    let nestedStyles = { height: 0, overflow: 'hidden', transition: 'all .5s' };

                    let details = <ListItem key={1} disabled className='expanded-content' style={itemStyles}>
                        {this.getDetailsContent(sc)}
                    </ListItem>;
                    if (!this.state.appIdFilter || this.state.appIdFilter === sc.app.authClient.clientId) {
                        return <ListItem key={index} primaryTogglesNestedList nestedItems={[details]} rightToggle={<span />} style={itemStyles} open={willOpen || isSelected}
                                         hoverColor='whitesmoke' onClick={() => this.handleRowSelect(index)} className={'launch-scenario-list-row' + (isSelected ? ' active' : '')}
                                         nestedListStyle={nestedStyles}
                                         leftIcon={<div className='actions-wrapper'>
                                             <IconButton style={{ color: this.props.muiTheme.palette.primary1Color }} onClick={(e) => {
                                                 e.preventDefault();
                                                 e.stopPropagation();
                                                 this.launchScenario(sc);
                                             }} tooltip='Launch'>
                                                 <LaunchIcon style={{ width: '24px', height: '24px' }} />
                                             </IconButton>
                                             <IconButton style={{ color: this.props.muiTheme.palette.primary1Color }} onClick={(e) => {
                                                 e.preventDefault();
                                                 e.stopPropagation();
                                                 this.deleteScenario(sc);
                                             }} tooltip='Delete'>
                                                 <DeleteIcon style={{ width: '24px', height: '24px' }} />
                                             </IconButton>
                                         </div>}>
                            {sc.description}
                        </ListItem>
                    }
                }
            )}
        </List>
    };
}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        apps: state.apps.apps,
        creating: state.sandbox.launchScenarioCreating,
        deleting: state.sandbox.launchScenarioDeleting,
        scenariosLoading: state.sandbox.launchScenariosLoading,
        scenarios: state.sandbox.launchScenarios,
        personasPagination: state.persona.personasPagination,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        patients: state.persona.patients,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId)
    }
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario },
    dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(LaunchScenarios)))
