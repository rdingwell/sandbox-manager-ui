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
                    loadingObservation={this.props.loadingObservation}
                    observation={this.props.observations}
                    observationCount={this.props.observationCount}

                    allergyIntoleranceLoading={this.props.loadingAllergyIntolerance}
                    allergyIntolerance={this.props.allergyIntolerance}
                    allergyCount={this.props.allergyCount}

                    carePlanLoading={this.props.loadingCarePlan}
                    carePlan={this.props.carePlan}
                    carePlanCount={this.props.carePlanCount}

                    loadingCareTeam={this.props.loadingCareTeam}
                    careTeam={this.props.careTeam}
                    careTeamCount={this.props.careTeamCount}

                    loadingCondition={this.props.loadingCondition}
                    condition={this.props.condition}
                    conditionCount={this.props.conditionCount}
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
        allergyIntolerance: state.patientStore.allergyIntolerance,
        loadingAllergyIntolerance: state.patientStore.allergyLoading,
        allergyCount: state.patientStore.allergyCount,

        loadingCarePlan: state.patientStore.loadingCarePlan,
        carePlan: state.patientStore.carePlan,
        carePlanCount: state.patientStore.carePlanCount,

        loadingCareTeam: state.patientStore.loadingCareTeam,
        careTeam: state.patientStore.careTeam,
        careTeamCount: state.patientStore.careTeamCount,

        loadingCondition: state.patientStore.loadingCondition,
        condition: state.patientStore.condition,
        conditionCount: state.patientStore.conditionCount,

        observation : state.patientStore.observation,
        loadingObservation: state.patientStore.loadingObservation,
        observationCount: state.patientStore.observationCount
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetch: (patient, type) => dispatch(actions.fetch(patient, type)),
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( PatientDetails, axios ) );
