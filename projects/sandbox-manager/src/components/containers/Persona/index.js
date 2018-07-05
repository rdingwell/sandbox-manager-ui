import React, {Component} from 'react';
import {createResource, getPersonasPage, fetchPersonas, deletePersona, app_setScreen, createPersona, lookupPersonasStart} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import PersonaList from './List';
import {RaisedButton} from 'material-ui';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

class Persona extends Component {

    constructor(props) {
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

    componentDidMount() {
        let type = this.state.type;
        this.props.fetchPersonas(type);
        this.props.app_setScreen(type === PersonaList.TYPES.patient ? 'patients' : type === PersonaList.TYPES.practitioner ? 'practitioners' : 'personas');
    }

    componentWillReceiveProps(nextProps) {
        let type = getType(nextProps);
        type !== this.state.type && this.setState({type, createPersona: false});
        (type !== this.state.type || (this.props.creatingPersona && !nextProps.creatingPersona)) && this.props.fetchPersonas(type);
    }

    render() {
        let props = {
            key: this.state.type,
            type: this.state.type,
            personaList: this.props.currentPersonas,
            pagination: this.props.currentPagination,
            click: this.selectPersonHandler,
            search: this.props.fetchPersonas,
            loading: this.props.loading,
            theme: this.props.muiTheme.palette,
            create: this.props.createResource,
            modal: this.props.modal,
            title: this.props.title,
            fetchPersonas: this.props.fetchPersonas,
            lookupPersonasStart: this.props.lookupPersonasStart,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.currentPagination),
            prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.currentPagination)
        };

        return <PersonaList {...props} />;
    }

    closeDialog = () => {
        this.setState({selectPractitioner: false, selectPatient: false, selectedForCreation: undefined, username: undefined, password: undefined, viewPersona: undefined});
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
        !this.props.doLaunch && this.setState({viewPersona: persona});
    };
}

function getType(props) {
    return (props.location && props.location.pathname.indexOf('/patients') >= 0) || (props.type === 'Patient')
        ? PersonaList.TYPES.patient
        : (props.location && props.location.pathname.indexOf('/practitioners') >= 0) || (props.type === 'Practitioner')
            ? PersonaList.TYPES.practitioner
            : PersonaList.TYPES.persona;
}

function mapStateToProps(state, ownProps) {
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
    fetchPersonas, deletePersona, app_setScreen, createPersona, createResource, lookupPersonasStart,
    getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
    getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
}, dispatch);


export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Persona)));
