import React, { Component } from 'react';
import { fetchPatientDetails, doLaunch } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import { Paper, Subheader, RaisedButton, IconButton } from 'material-ui';
import LabelValuePair from '../../../UI/LabelValuePair/LabelValuePair';
import NameLabelValuePair from '../../../UI/LabelValuePair/NameLabelValuePair';
import PersonaData from './PersonaData';
import PersonaList from '../List';

import './styles.less';

class Index extends Component {
    componentDidMount () {
        this.props.active && this.props.fetchPatientDetails(this.props.persona);
    }

    componentDidUpdate(prevProps) {
        this.props.active && !prevProps.active && this.props.fetchPatientDetails(this.props.persona);
    }

    render () {
        return <PersonaData
            patient={this.props.persona}
            allergyCount={this.props.allergyCount}
            carePlanCount={this.props.carePlanCount}
            careTeamCount={this.props.careTeamCount}
            conditionCount={this.props.conditionCount}
            diagnosticReportCount={this.props.diagnosticReportCount}
            encounterCount={this.props.encounterCount}
            goalCount={this.props.goalCount}
            immunizationCount={this.props.immunizationCount}
            medicationDispenseCount={this.props.medicationDispenseCount}
            medicationRequestCount={this.props.medicationRequestCount}
            observationCount={this.props.observationCount}
            procedureCount={this.props.procedureCount}
            procedureRequestCount={this.props.procedureRequestCount}
        />
    }

    launch = () => {
        this.props.doLaunch({
            "authClient": {
                "clientName": "Patient Data Manager",
                "clientId": "patient_data_manager",
                "redirectUri": "https://patient-data-manager.hspconsortium.org/index.html"
            },
            "appUri": "https://patient-data-manager.hspconsortium.org/",
            "launchUri": "https://patient-data-manager.hspconsortium.org/launch.html",
            "logoUri": "https://content.hspconsortium.org/images/hspc-patient-data-manager/logo/pdm.png",
            "briefDescription": "The HSPC Patient Data Manager app is a SMART on FHIR application that is used for managing the data of a single patient."
        }, this.props.persona);
    };
}

const mapStateToProps = state => {

    return {
        observationCount: state.patient.details.Observation || 0,
        encounterCount: state.patient.details.Encounter || 0,
        medicationRequestCount: state.patient.details.MedicationRequest || 0,
        medicationDispenseCount: state.patient.details.MedicationDispense || 0,
        allergyCount: state.patient.details.AllergyIntolerance || 0,
        conditionCount: state.patient.details.Condition || 0,
        procedureCount: state.patient.details.Procedure || 0,
        diagnosticReportCount: state.patient.details.DiagnosticReport || 0,
        immunizationCount: state.patient.details.Immunization || 0,
        carePlanCount: state.patient.details.CarePlan || 0,
        careTeamCount: state.patient.details.CareTeam || 0,
        goalCount: state.patient.details.Goal || 0
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ fetchPatientDetails, doLaunch }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index));
