import React, { Component } from 'react';
import { createResource, getPersonasPage, fetchPersonas, deletePersona, app_setScreen, createPersona } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import PersonaList from './PersonaList';
import PersonaDetails from './PersonaDetails';
import PersonaInputs from './PersonaInputs';
import { RaisedButton, Dialog, FlatButton, IconButton } from 'material-ui';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

class Persona extends Component {

    constructor (props) {
        super(props);

        let type = getType(props);

        this.state = {
            selectedPersona: null,
            createPersona: false,
            selectPractitioner: false,
            selectPatient: false,
            type
        }
    }

    componentDidMount () {
        let type = this.state.type;
        this.props.fetchPersonas(type);
        this.props.app_setScreen(type === PersonaList.TYPES.patient ? 'patients' : type === PersonaList.TYPES.practitioner ? 'practitioners' : 'personas');
    }

    componentWillReceiveProps (nextProps) {
        let type = getType(nextProps);
        type !== this.state.type && this.setState({ type, createPersona: false });
        (type !== this.state.type || (this.props.creatingPersona && !nextProps.creatingPersona)) && this.props.fetchPersonas(type);
    }

    render () {
        let props = {
            key: this.state.type,
            type: this.state.type,
            personas: this.props.currentPersonas,
            pagination: this.props.currentPagination,
            click: this.selectPersonHandler,
            search: this.props.fetchPersonas,
            loading: this.props.loading,
            theme: this.props.muiTheme.palette,
            create: this.props.createResource,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.currentPagination),
            prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.currentPagination)
        };

        this.state.type === PersonaList.TYPES.persona && (props.actions = [<h4 key={0} className='actions-label'>Create persona for: </h4>,
            <RaisedButton key={1} labelPosition='after' primary icon={<i className='fa fa-user-md fa-2x fa-inverse' />} label='Practitioner' className='custom-button'
                          onClick={() => {
                              this.props.fetchPersonas(PersonaList.TYPES.practitioner);
                              this.setState({ selectPractitioner: true })
                          }} />,
            <RaisedButton key={2} labelPosition='after' primary icon={<i className='fa fa-user fa-2x fa-inverse' />} label='Patient' className='custom-button'
                          onClick={() => {
                              this.props.fetchPersonas(PersonaList.TYPES.patient);
                              this.setState({ selectPatient: true })
                          }} />]);

        let personaList = <PersonaList {...props} />;
        let personaDetails = null;
        if (!this.props.doLaunch && this.state.selectedPersona) {
            personaDetails = <PersonaDetails type={this.state.type} persona={this.state.selectedPersona} />;
        }
        let creationType = this.state.selectPractitioner ? PersonaList.TYPES.practitioner : this.state.selectPatient ? PersonaList.TYPES.patient : null;

        return <div className='patients-wrapper'>
            <div>
                {creationType && this.getSelectionDialog(creationType)}
                {this.getDetailsWindow()}
                {personaList}
                {personaDetails}
            </div>
        </div>;
    }

    getDetailsWindow = () => {
        let actions = [
            <FlatButton key={2} label='Close' secondary onClick={this.closeDialog} />
        ];
        this.state.type === PersonaList.TYPES.persona &&
        actions.unshift(<RaisedButton key={1} label='DELETE' secondary onClick={() => {
            this.props.deletePersona(this.state.viewPersona);
            this.closeDialog();
        }} />);

        return <Dialog open={!!this.state.viewPersona} modal={false} onRequestClose={this.closeDialog} contentClassName='persona-info-dialog' actions={actions}>
            <IconButton className="close-button" onClick={this.closeDialog}>
                <i className="material-icons">close</i>
            </IconButton>
            {!this.state.selectedForCreation && <PersonaDetails type={this.state.type} persona={this.state.viewPersona} />}
        </Dialog>
    };

    getSelectionDialog = (creationType) => {
        let actions = [
            <FlatButton key={1} label='Save' primary onClick={this.createPersona} />,
            <FlatButton key={2} label='Cancel' secondary onClick={this.closeDialog} />
        ];
        let personas = creationType === PersonaList.TYPES.practitioner ? this.props.practitioners : this.props.patients;
        let pagination = creationType === PersonaList.TYPES.practitioner ? this.props.practitionersPagination : this.props.patientsPagination;

        return <Dialog open={!!creationType} modal={false} onRequestClose={this.closeDialog} contentClassName='persona-info-dialog' actions={actions}>
            <IconButton className="close-button" onClick={this.closeDialog}>
                <i className="material-icons">close</i>
            </IconButton>
            {!this.state.selectedForCreation &&
            <PersonaList type={creationType} key={creationType} personas={personas} click={selectedForCreation => this.setState({ selectedForCreation })}
                         pagination={pagination} next={() => this.props.getNextPersonasPage(creationType, pagination)}
                         prev={() => this.props.getPrevPersonasPage(creationType, pagination)} modal theme={this.props.muiTheme.palette} />}
            {this.state.selectedForCreation && <div className='persona-inputs'>
                <PersonaInputs persona={this.state.selectedForCreation} sandbox={sessionStorage.sandboxId}
                               onChange={(username, password) => this.setState({ username, password })} />
            </div>}
        </Dialog>
    };

    closeDialog = () => {
        this.setState({ selectPractitioner: false, selectPatient: false, selectedForCreation: undefined, username: undefined, password: undefined, viewPersona: undefined });
    };

    createPersona = () => {
        let persona = Object.assign({}, this.state.selectedForCreation);
        let type = this.state.selectPractitioner ? PersonaList.TYPES.practitioner : PersonaList.TYPES.patient;
        persona.userId = this.state.username;
        persona.password = this.state.password;

        this.props.createPersona(type, persona);
        this.closeDialog();
    };

    selectPersonHandler = (persona) => {
        this.props.doLaunch && this.props.doLaunch(persona);
        this.props.doLaunch && this.closeDialog();
        !this.props.doLaunch && this.setState({ viewPersona: persona });
    };
}

function getType (props) {
    return (props.location && props.location.pathname.indexOf('/patients') >= 0) || (props.type === 'Patient')
        ? PersonaList.TYPES.patient
        : (props.location && props.location.pathname.indexOf('/practitioners') >= 0) || (props.type === 'Practitioner')
            ? PersonaList.TYPES.practitioner
            : PersonaList.TYPES.persona;
}

function mapStateToProps (state, ownProps) {
    let type = getType(ownProps);

    let currentPersonas = type === PersonaList.TYPES.patient ? state.persona.patients
        : type === PersonaList.TYPES.practitioner ? state.persona.practitioners
            : state.persona.personas;
    let currentPagination = type === PersonaList.TYPES.patient ? state.persona.patientsPagination
        : type === PersonaList.TYPES.practitioner ? state.persona.practitionersPagination
            : state.persona.personasPagination;

    return {
        currentPersonas,
        currentPagination,
        practitionersPagination: state.persona.practitionersPagination,
        patientsPagination: state.persona.patientsPagination,
        patients: state.persona.patients,
        practitioners: state.persona.practitioners,
        loading: state.persona.loading,
        creatingPersona: state.persona.createing
    };
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchPersonas, deletePersona, app_setScreen, createPersona, createResource,
    getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
    getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
}, dispatch);


export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Persona)));
