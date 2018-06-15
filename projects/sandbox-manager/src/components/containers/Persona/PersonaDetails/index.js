import React, { Component } from 'react';
import { fetchPatientDetails, doLaunch } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import { Paper, Subheader, RaisedButton, IconButton } from 'material-ui';
import LabelValuePair from '../../../UI/LabelValuePair/LabelValuePair';
import NameLabelValuePair from '../../../UI/LabelValuePair/NameLabelValuePair';
import PersonaData from './PersonaData';
import PersonaList from '../PersonaList';

import './styles.less';

class Index extends Component {
    componentDidMount () {
        this.props.fetchPatientDetails(this.props.persona);
    }

    render () {
        return <div>
            <Paper className='paper-card'>
                <IconButton style={{ color: this.props.theme.primary5Color }} className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>{this.props.type} Details</h3>
                <div className='persona-details-wrapper paper-body'>
                    {this.props.type !== PersonaList.TYPES.persona &&
                    <div>
                        <div>
                            <RaisedButton className='dm-launch-button' primary label='Open in DM' onClick={this.launch} />
                            <NameLabelValuePair label={'Name:'} value={this.props.persona.name[0] || this.props.persona.name} />
                            <LabelValuePair label={'FHIR ID:'} value={this.props.persona.id} />
                            <LabelValuePair label={'Gender:'} value={this.props.persona.gender} />
                            <LabelValuePair label={'Birth Date:'} value={this.props.persona.birthDate} />
                        </div>
                    </div>}
                    {this.props.type === PersonaList.TYPES.persona && <div>
                        <div>
                            <LabelValuePair large label={'Display name:'} value={this.props.persona.fhirName} />
                            <LabelValuePair large label={'User Id:'} value={this.props.persona.personaUserId} />
                            <LabelValuePair large label={'Password:'} value={this.props.persona.password} />
                            <LabelValuePair large label={'Resource Type:'} value={this.props.persona.resource} />
                        </div>
                    </div>}
                    {this.props.type === PersonaList.TYPES.patient && <div>
                        <Subheader>Data summary</Subheader>
                        <PersonaData
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
                    </div>}
                </div>
            </Paper>
        </div>
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

    handleClose = () => {
        this.props.onClose();
    };
}

const mapStateToProps = state => {

    return {
        observationCount: state.patient.details.Observation,
        encounterCount: state.patient.details.Encounter,
        medicationRequestCount: state.patient.details.MedicationRequest,
        medicationDispenseCount: state.patient.details.MedicationDispense,
        allergyCount: state.patient.details.AllergyIntolerance,
        conditionCount: state.patient.details.Condition,
        procedureCount: state.patient.details.Procedure,
        diagnosticReportCount: state.patient.details.DiagnosticReport,
        immunizationCount: state.patient.details.Immunization,
        carePlanCount: state.patient.details.CarePlan,
        careTeamCount: state.patient.details.CareTeam,
        goalCount: state.patient.details.Goal
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ fetchPatientDetails, doLaunch }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index));
