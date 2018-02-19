import React, { Component } from 'react';
import * as  actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios';
import PatientList from "./PatientList/PatientList";
import PatientDetails from "./PatientDetails/PatientDetails";



class Patients extends Component {

    state = {
        patient : null
    };
    
    componentDidMount () {
        this.props.onFetchPatients();
    }

    selectPersonHandler = (person) => {
        this.setState({patient : person});
    };

    getPatientListStyle = () => {
        let style = {};
        if(this.state.patient){
            style.float = 'left';
            style.width = '50%';
        }
        return style;
    };
    
    getPatientDetailStyle = () => {
        let style = {};
        if(this.state.patient){
            style.float = 'right';
            style.width = '50%';
        }
        return style;
    };

    render() {

        let patientList = null;
        if(!this.props.loading){
            patientList = (
                <PatientList
                    patients={this.props.patients}
                    click={this.selectPersonHandler}
                />);
        }
        let patientDetails = null;
        if(this.state.patient){
            patientDetails = (
                <PatientDetails
                    patient={this.state.patient}
                />);
        }
        return(
            <div>
                <div style={this.getPatientListStyle()}>
                    {patientList}
                </div>
                <div style={this.getPatientDetailStyle()}>
                    {patientDetails}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {

    return {
        patients : state.patient.patients,
        loading: state.patient.lookingForPatients
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchPatients: () => dispatch( actions.fetchPatients() )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Patients, axios ) );
