import React, { Component } from 'react';
import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../axios';
import Paper from 'material-ui/Paper';
import LabelValuePair from '../../../UI/LabelValuePair/LabelValuePair';
import NameLabelValuePair from '../../../UI/LabelValuePair/NameLabelValuePair';
import PatientData from "./PatientData/PatientData";



class PatientDetails extends Component {
    componentWillMount() {
        for (const resource of JSON.parse(localStorage.getItem('resources'))) {
            this.props.onFetch(this.props.patient, resource.resourceType);
        }
    }

    render(){
        let patientData = null;
        if(!this.props.loadingObservations){
            patientData = (
                <PatientData
                    patient={this.props.patient}
                    allergyIntoleranceLoading={this.props.loadingAllergyIntolerance}
                    allergyCount={this.props.allergyCount}
                    carePlanLoading={this.props.loadingCarePlan}
                    carePlanCount={this.props.carePlanCount}
                    loadingCareTeam={this.props.loadingCareTeam}
                    careTeamCount={this.props.careTeamCount}
                    loadingCondition={this.props.loadingCondition}
                    conditionCount={this.props.conditionCount}
                    loadingDiagnosticReport= {this.props.loadingDiagnosticReport}
                    diagnosticReportCount={this.props.diagnosticReportCount}
                    loadingEncounter={this.props.loadingEncounter}
                    encounterCount={this.props.encounterCount}
                    loadingGoal={this.props.loadingGoal}
                    goalCount={this.props.goalCount}
                    immunizationCount={this.props.immunizationCount}
                    loadingImmunization={this.props.loadingImmunization}
                    medicationDispenseCount={this.props.medicationDispenseCount}
                    loadingMedicationDispense={this.props.loadingMedicationDispense}
                    medicationRequestCount={this.props.medicationRequestCount}
                    loadingMedicationRequest={this.props.loadingMedicationRequest}
                    loadingObservation={this.props.loadingObservation}
                    observationCount={this.props.observationCount}
                    procedureCount={this.props.procedureCount}
                    loadingProcedure={this.props.loadingProcedure}
                    procedureRequestCount={this.props.procedureRequestCount}
                    loadingProcedureRequest={this.props.loadingProcedureRequest}

        />
            );
        }

        return (
            <Paper className="PaperCard">
                <h3>Patient Details</h3>
                <div className="PaperBody">
                    <NameLabelValuePair label={"Name:"} value={this.props.patient.name[0]}/>
                    <LabelValuePair label={"FHIR ID:"} value={this.props.patient.id}/>
                    <LabelValuePair label={"Gender:"} value={this.props.patient.gender}/>
                    <LabelValuePair label={"Birth Date:"} value={this.props.patient.birthDate}/>
                </div>
                <div style={{clear: 'both'}}></div>
                {patientData}
            </Paper>
        );
    }
}

const mapStateToProps = state => {

    return {
        loadingAllergyIntolerance: state.patientStore.allergyLoading,
        allergyCount: state.patientStore.allergyCount,
        loadingCarePlan: state.patientStore.loadingCarePlan,
        carePlanCount: state.patientStore.carePlanCount,
        loadingCareTeam: state.patientStore.loadingCareTeam,
        careTeamCount: state.patientStore.careTeamCount,
        loadingCondition: state.patientStore.loadingCondition,
        conditionCount: state.patientStore.conditionCount,
        loadingDiagnosticReport: state.patientStore.loadingDiagnosticReport,
        diagnosticReportCount: state.patientStore.diagnosticReportCount,
        loadingEncounter: state.patientStore.loadingEncounter,
        encounterCount: state.patientStore.encounterCount,
        loadingGoal: state.patientStore.loadingGoal,
        goalCount: state.patientStore.goalCount,
        immunizationCount: state.patientStore.immunizationCount,
        loadingImmunization: state.patientStore.loadingImmunization,
        medicationDispenseCount: state.patientStore.medicationDispenseCount,
        loadingMedicationDispense: state.patientStore.loadingMedicationDispense,
        medicationRequestCount: state.patientStore.medicationRequestCount,
        loadingMedicationRequest: state.patientStore.loadingMedicationRequest,
        loadingObservation: state.patientStore.loadingObservation,
        observationCount: state.patientStore.observationCount,
        procedureCount: state.patientStore.procedureCount,
        loadingProcedure: state.patientStore.loadingProcedure,
        procedureRequestCount: state.patientStore.procedureRequestCount,
        loadingProcedureRequest:state.patientStore.loadingProcedureRequest
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetch: (patient, type) => dispatch(actions.fetch(patient, type)),
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( PatientDetails, axios ) );
