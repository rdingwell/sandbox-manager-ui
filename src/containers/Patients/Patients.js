import React, { Component } from 'react';
import * as  actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axiox';
import PatientList from "./PatientList/PatientList";



class Patients extends Component {

    componentDidMount () {
        this.props.onFetchPatients();
    }



    render() {
        let patientList = null;
        if(!this.props.loading){
            patientList = (<PatientList patients={this.props.patients}/>);
        }
        return(
            <div>
                {patientList}
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
