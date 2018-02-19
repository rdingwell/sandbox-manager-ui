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
        this.props.onFetchObservations(this.props.patient);
        this.props.onFetchAllergyIntolerance(this.props.patient);
    }


    render(){
        let patientData = null;
        if(!this.props.loadingObservations){
            patientData = (
                <PatientData
                    patient={this.props.patient}
                    observationLoading={this.props.loadingObservations}
                    observations={this.props.observations}
                    allergyIntoleranceLoading={this.props.loadingAllergyIntolerance}
                    allergyIntolerance={this.props.allergyIntolerance}
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
        observations : state.observation.observations,
        loadingObservations: state.observation.loading,
        allergyIntolerance: state.allergyIntolerance.allergyIntolerance,
        loadingAllergyIntolerance: state.allergyIntolerance.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchObservations: (patient) => dispatch( actions.fetchObservations(patient) ),
        onFetchAllergyIntolerance: (patient) => dispatch(actions.fetchAllergyIntolerance(patient))
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( PatientDetails, axios ) );
