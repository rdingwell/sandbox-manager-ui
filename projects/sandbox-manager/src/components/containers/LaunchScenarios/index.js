import React, { Component } from 'react';
import { app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario, lookupPersonasStart } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { getPatientName } from '../../../../../../lib/utils/fhir';
import { CircularProgress, RaisedButton, Card, TextField, Dialog, IconButton, FloatingActionButton, CardMedia } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/image/edit';
import PersonaList from '../Persona/List';
import Apps from '../Apps';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import FilterList from "material-ui/svg-icons/content/filter-list";
import Page from '../../../../../../lib/components/Page';

import './styles.less';
import DohMessage from "../../../../../../lib/components/DohMessage";
import Filters from './Filters';
import muiThemeable from "material-ui/styles/muiThemeable";

const patientIcon = <svg width="100%" height="100%" viewBox="0 0 24 24" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: '1.41421' }}>
    <g transform="matrix(0.2,0,0,0.2,2,1.9999)">
        <circle cx="72.5" cy="45.78" r="9.843"/>
        <path d="M57.313,44.375L16.25,44.375C10.036,44.375 5,48.783 5,54.219C5,58.002 5,61.289 5,62.938C5,63.559 5.503,64.063 6.125,64.063L57.313,64.063C57.936,
                                                        64.063 58.438,63.559 58.438,62.938L58.438,45.5C58.438,44.878 57.936,44.375 57.313,44.375Z" style={{ fillRule: 'nonzero' }}/>
        <path d="M25.813,23.749L34.064,23.749L34.064,32C34.064,32.622 34.567,33.125 35.189,33.125L42.312,33.125C42.934,33.125 43.437,32.622 43.437,32L43.437,
                                                        23.749L51.687,23.749C52.31,23.749 52.812,23.246 52.812,22.624L52.812,15.501C52.812,14.879 52.31,14.376 51.687,14.376L43.437,14.376L43.437,
                                                        6.125C43.437,5.503 42.934,5 42.312,5L35.189,5C34.567,5 34.064,5.503 34.064,6.125L34.064,14.376L25.813,14.376C25.191,14.376 24.688,14.879 24.688,
                                                        15.501L24.688,22.624C24.688,23.246 25.19,23.749 25.813,23.749Z" style={{ fillRule: 'nonzero' }}/>
        <path d="M64.063,64.063L80.938,64.063C82.493,64.063 83.751,62.805 83.751,61.25C83.751,59.695 82.492,58.437 80.938,58.437L64.063,58.437C62.509,58.437 61.25,
                                                        59.695 61.25,61.25C61.25,62.805 62.509,64.063 64.063,64.063Z" style={{ fillRule: 'nonzero' }}/>
        <path d="M86.563,34.25L86.563,66.875L6.125,66.875C5.503,66.875 5,67.378 5,68L5,93.875C5,94.496 5.503,95 6.125,95L12.313,95C12.935,95 13.438,94.496 13.438,
                                                        93.875L13.438,80.938L86.563,80.938L86.563,93.876C86.563,94.497 87.067,95.001 87.688,95.001L93.876,95.001C94.497,95 95,94.496 95,93.875L95,34.25C95,
                                                        33.628 94.497,33.125 93.875,33.125L87.687,33.125C87.064,33.125 86.563,33.628 86.563,34.25Z" style={{ fillRule: 'nonzero' }}/>
    </g>
    <g transform="matrix(0.666667,0,0,0.727273,0,0)">
        <rect x="0" y="0" width="36" height="33" style={{ fill: 'none' }}/>
    </g>
</svg>;

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
        return <Page title='Launch Scenarios'>
            <div className='launch-scenarios-wrapper'>
                <div className='filter-wrapper'>
                    <FilterList color={this.props.muiTheme.palette.primary3Color}/>
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 &&
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter} appliedIdFilter={this.state.appIdFilter}/>}
                    <div className='actions'>
                        <FloatingActionButton onClick={this.toggleModal}>
                            <ContentAdd/>
                        </FloatingActionButton>
                    </div>
                </div>
                <div>
                    {(this.props.scenariosLoading || this.props.creating || this.props.deleting) && <div className='loader-wrapper'>
                        <CircularProgress size={80} thickness={5}/>
                    </div>}
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 && this.getScenarios()}
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length === 0 &&
                    <DohMessage message='No launch scenarios in sandbox.' topMargin/>}
                </div>
                {this.getModal()}
            </div>
        </Page>
    }

    onFilter = (type, appId) => {
        let state = {};
        state[type] = appId;
        this.setState(state);
    };

    launchScenario = (sc) => {
        sc.app && this.props.doLaunch(sc.app, sc.patient, sc.userPersona);
        !sc.app && this.props.doLaunch(this.state.selectedApp, this.state.selectedPatient, this.state.selectedPersona);
    };

    handleRowSelect = (row) => {
        let selection = this.state.selectedScenario !== row ? row : undefined;
        this.setState({ selectedScenario: selection });
    };

    getModal = () => {
        let actions = this.getBuildActions();
        let content = this.getBuildContent();

        return <Dialog open={this.state.showModal} modal={false} onRequestClose={this.toggleModal} contentClassName='launch-scenario-dialog' actions={actions}>
            <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.toggleModal}>
                <i className="material-icons">close</i>
            </IconButton>
            {content}
        </Dialog>
    };

    getBuildActions = () => {
        let actions = [<RaisedButton key={3} label='Cancel' className='launch-scenario-dialog-action' onClick={this.toggleModal}/>];
        return this.state.selectedApp && ([<RaisedButton key={2} label='Save' secondary className='launch-scenario-dialog-action' onClick={this.createScenario}/>]).concat(actions);
    };

    createScenario = () => {
        if (this.state.description.length > 2) {
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
        } else {
            this.setState({ descriptionError: 'You need to provide description longer than 2 characters!' });
        }
    };

    deleteScenario = (sc) => {
        this.props.deleteScenario(sc || this.state.selectedScenario);
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
                ? <RaisedButton primary label='skip Patient' onClick={() => this.setState({ selectedPatient: {} })}/>
                : [];

            let props = {
                title, type, click, personas, pagination, actions, modal: true,
                theme: this.props.muiTheme.palette,
                lookupPersonasStart: this.props.lookupPersonasStart,
                search: this.props.fetchPersonas,
                loading: this.props.personaLoading,
                next: () => this.props.getPersonasPage(type, pagination, 'next'),
                prev: () => this.props.getPersonasPage(type, pagination, 'previous')
            };

            return <PersonaList {...props} additionalPadding/>;
        } else if (!this.state.selectedApp) {
            return <Apps title='Select app' modal onCardClick={selectedApp => this.setState({ selectedApp })}/>
        } else {
            let titleStyle = {
                backgroundColor: this.props.muiTheme.palette.primary2Color,
                color: this.props.muiTheme.palette.alternateTextColor
            };

            return <div>
                <div className='screen-title' style={titleStyle}>
                    <h1 style={titleStyle}>Save Launch Scenario</h1>
                </div>
                <div className='inputs'>
                    <div className='label-value'>
                        <span>Persona: </span>
                        <span>{this.state.selectedPersona.personaName}</span>
                    </div>
                    <div className='label-value'>
                        <span>Patient: </span>
                        <span>{this.state.selectedPatient ? getPatientName(this.state.selectedPatient) : 'NONE'}</span>
                    </div>
                    <div className='label-value'>
                        <span>App: </span>
                        <span>{this.state.selectedApp.authClient.clientName}</span>
                    </div>
                    <TextField floatingLabelText='Description' fullWidth onChange={(_e, description) => this.setState({ description })}
                               errorText={this.state.descriptionError}/>
                </div>
            </div>
        }
    };

    toggleModal = () => {
        this.props.fetchPersonas(PersonaList.TYPES.patient);
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

    getScenarios = () => {
        return <div className='scenarios-list'>
            {this.props.scenarios.map((sc, index) => {
                    let isSelected = this.state.selectedScenario === index;
                    let itemStyles = { backgroundColor: this.props.muiTheme.palette.canvasColor };
                    let contentStyles = isSelected ? { borderTop: '1px solid ' + this.props.muiTheme.palette.primary7Color } : {};
                    let isPatient = sc.userPersona.resource !== 'Practitioner';
                    let iconStyle = isPatient
                        ? {
                            backgroundColor: this.props.muiTheme.palette.accent1Color,
                            color: this.props.muiTheme.palette.primary5Color
                        }
                        : {
                            backgroundColor: this.props.muiTheme.palette.primary5Color,
                            color: this.props.muiTheme.palette.accent1Color
                        };

                    let details = <div key={1} className='expanded-content'>
                        {this.getDetailsContent(sc)}
                    </div>;
                    let filter = (!this.state.appIdFilter || this.state.appIdFilter === sc.app.authClient.clientId) &&
                        (!this.state.typeFilter || this.state.typeFilter === sc.userPersona.resource);
                    if (filter) {
                        return <div key={index} style={itemStyles} onClick={() => this.handleRowSelect(index)} className={'scenarios-list-row' + (isSelected ? ' active' : '')}>
                            <div className='left-icon-wrapper' style={iconStyle}>
                                <span className='left-icon'>
                                    {isPatient
                                        ? <i>{patientIcon}</i>
                                        : <i className='fa fa-user-md fa-lg'/>}
                                </span>
                            </div>
                            <div className='title-wrapper'>
                                <span className='launch-scenario-title'>{sc.description}</span>
                                <span className='launch-scenario-app-name'>{sc.app.authClient.clientName}</span>
                            </div>
                            <div className='actions-wrapper'>
                                <IconButton onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.launchScenario(sc);
                                }} tooltip='Launch'>
                                    <LaunchIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                <IconButton className='visible-button'>
                                    <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                <IconButton className='hidden-button' style={{ color: this.props.muiTheme.palette.primary3Color }} onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.deleteScenario(sc);
                                }} tooltip='Edit'>
                                    <EditIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                <IconButton className='hidden-button' style={{ color: this.props.muiTheme.palette.primary3Color }} onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.deleteScenario(sc);
                                }} tooltip='Delete'>
                                    <DeleteIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                <IconButton className='expanded-toggle'>
                                    <DownIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                            </div>
                            <div className='content' style={contentStyles} onClick={e => e.stopPropagation()}>
                                {details}
                            </div>
                        </div>
                    }
                }
            )}
        </div>
    };

    getDetailsContent = (selectedScenario) => {
        let patient = selectedScenario.patient;
        let label = selectedScenario.userPersona !== null && selectedScenario.userPersona.resource === 'Practitioner'
            ? `Launch App as a Practitioner with ${patient.fhirId !== '0' ? '' : 'NO'} Patient Context`
            : 'Launch an App As a Patient';
        let lightColor = { color: this.props.muiTheme.palette.primary3Color };
        let darkColor = { color: this.props.muiTheme.palette.primary6Color };

        return <div className='launch-scenario-wrapper'>
            <div className='persona-wrapper'>
                <span className='section-title' style={lightColor}>Persona</span>
                <span className='persona-name' style={darkColor}>{selectedScenario.userPersona.fhirName}</span>
                <span className='persona-id' style={lightColor}>{selectedScenario.userPersona.personaUserId}</span>
            </div>
            <div className='context-wrapper'>
                <span className='section-title' style={lightColor}>Context</span>
                <div>
                    <label className='section-label' style={lightColor}>Patient: </label>
                    <span className='section-value' style={darkColor}>{selectedScenario.patient.name ? selectedScenario.patient.name : '-'}</span>
                </div>
                <div>
                    <label className='section-label' style={lightColor}>Encounter: </label>
                    <span className='section-value' style={darkColor}>-</span>
                </div>
                <div>
                    <label className='section-label' style={lightColor}>Location: </label>
                    <span className='section-value' style={darkColor}>-</span>
                </div>
            </div>
            <div className='app-wrapper'>
                <span className='section-title' style={lightColor}>App</span>
                <Card className='app-card small'>
                    <CardMedia className='media-wrapper'>
                        <img style={{ height: '100%' }} src={selectedScenario.app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                    </CardMedia>
                    <div className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                        <span className='app-name'>{selectedScenario.app.authClient.clientName}</span>
                    </div>
                </Card>
            </div>
        </div>
    };

    updateScenario = (e) => {
        e.target.value !== this.state.selectedScenario.description && this.props.updateLaunchScenario(this.state.selectedScenario, e.target.value);
        this.toggleDescriptionEdit();
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
        personaLoading: state.persona.loading,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId)
    }
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario, lookupPersonasStart },
    dispatch
);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(LaunchScenarios)))
