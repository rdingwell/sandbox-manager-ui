import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import PersonaList from "./PersonaList";
import PersonaDetails from "./PersonaDetails";
import PersonaInputs from "./PersonaInputs";
import { RaisedButton, Dialog, FlatButton } from "material-ui";

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
            click: this.selectPersonHandler,
            pagination: this.props.currentPagination,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.currentPagination),
            prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.currentPagination)
        };

        this.state.type === PersonaList.TYPES.persona && (props.actions = [<h4 key={0} className='actions-label'>Create persona for: </h4>,
            <RaisedButton key={1} labelPosition="before" primary icon={<i className="fa fa-user-md fa-2x fa-inverse" />}
                          onClick={() => {
                              this.props.fetchPersonas(PersonaList.TYPES.practitioner);
                              this.setState({ selectPractitioner: true })
                          }} />,
            <RaisedButton key={2} labelPosition="before" primary icon={<i className="fa fa-user fa-2x fa-inverse" />}
                          onClick={() => {
                              this.props.fetchPersonas(PersonaList.TYPES.patient);
                              this.setState({ selectPatient: true })
                          }} />]);

        let personaList = <PersonaList {...props} />;
        let personaDetails = null;
        if (!this.props.doLaunch && this.state.selectedPersona) {
            personaDetails = <PersonaDetails persona={this.state.selectedPersona} />;
        }
        let creationType = this.state.selectPractitioner ? PersonaList.TYPES.practitioner : this.state.selectPatient ? PersonaList.TYPES.patient : null;

        return <div className="patients-wrapper">
            <div>
                {creationType && this.getDialog(creationType)}
                {personaList}
                {personaDetails}
            </div>
        </div>;
    }

    getDialog (creationType) {
        let actions = [
            <FlatButton key={1} label='Save' primary onClick={this.createPersona.bind(this)} />,
            <FlatButton key={2} label='Cancel' secondary onClick={this.closeDialog.bind(this)} />
        ];
        let personas = creationType === PersonaList.TYPES.practitioner ? this.props.practitioners : this.props.patients;
        let pagination = creationType === PersonaList.TYPES.practitioner ? this.props.practitionersPagination : this.props.patientsPagination;

        return <Dialog open={!!creationType} modal={false} onRequestClose={this.closeDialog.bind(this)} contentClassName='persona-info-dialog' actions={actions}>
            {!this.state.selectedForCreation &&
            <PersonaList type={creationType} key={creationType} personas={personas} click={selectedForCreation => this.setState({ selectedForCreation })}
                         pagination={pagination} next={() => this.props.getNextPersonasPage(creationType, pagination)}
                         prev={() => this.props.getPrevPersonasPage(creationType, pagination)} />}
            {this.state.selectedForCreation && <div className='persona-inputs'>
                <PersonaInputs persona={this.state.selectedForCreation} sandbox={this.props.selectedSandbox} onChange={this.updateInputs.bind(this)} />
            </div>}
        </Dialog>
    }

    updateInputs (username, password) {
        this.setState({ username, password })
    }

    closeDialog () {
        this.setState({ selectPractitioner: false, selectPatient: false, selectedForCreation: undefined, username: undefined, password: undefined });
    }

    createPersona () {
        let persona = Object.assign({}, this.state.selectedForCreation);
        let type = this.state.selectPractitioner ? PersonaList.TYPES.practitioner : PersonaList.TYPES.patient;
        persona.userId = this.state.username;
        persona.password = this.state.password;

        this.props.createPersona(type, persona);
        this.closeDialog();
    };
}

function getType (props) {
    return (props.location && props.location.pathname === "/patients") || (props.type === "Patient")
        ? PersonaList.TYPES.patient
        : (props.location && props.location.pathname === "/practitioners") || (props.type === "Practitioner")
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
        creatingPersona: state.persona.createing,
        selectedSandbox: state.sandbox.selectedSandbox
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonas: (type) => dispatch(actions.fetchPersonas(type)),
        getNextPersonasPage: (type, pagination) => dispatch(actions.getPersonasPage(type, pagination, "next")),
        getPrevPersonasPage: (type, pagination) => dispatch(actions.getPersonasPage(type, pagination, "previous")),
        app_setScreen: (screen) => dispatch(actions.app_setScreen(screen)),
        createPersona: (type, persona) => dispatch(actions.createPersona(type, persona))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Persona));
