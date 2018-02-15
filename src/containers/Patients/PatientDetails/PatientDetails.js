import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import PatientFullName from '../../../components/Patient/PatientFullName';
import LabelValuePair from '../../../UI/LabelValuePair/LabelValuePair';



class PatientDetails extends Component {

    render(){

        return (
            <Paper className="PaperCard">
                <h3>Patient Details</h3>
                <div className="PaperBody">
{/*
                    <div style={labelStyle}>
                        Name:
                    </div>
                    <div style={valueStyle}>
                        <PatientFullName name={this.props.patient.name[0]}/>
                    </div>
*/}
                    <LabelValuePair label={"FHIR ID:"} value={this.props.patient.id}/>
                    <LabelValuePair label={"Gender:"} value={this.props.patient.gender}/>
                    <LabelValuePair label={"Birth Date:"} value={this.props.patient.birthDate}/>
                </div>
                <div style={{clear: 'both'}}></div>
            </Paper>
        );
    }
}

export default PatientDetails;