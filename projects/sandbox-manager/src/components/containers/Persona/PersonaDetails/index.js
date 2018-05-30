import React, { Component } from 'react';
import { fetchPatientDetails } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import { Paper, Subheader, IconButton } from 'material-ui';
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
        return <Paper className='paper-card'>
            <h3>{this.props.type} Details</h3>
            <div className='paper-body persona-details-wrapper'>
                {this.props.type !== PersonaList.TYPES.persona && <Paper className='paper-card' zDepth={1}>
                    <Subheader>{this.props.type}</Subheader>
                    <div className='paper-body'>
                        <NameLabelValuePair label={'Name:'} value={this.props.persona.name[0]} />
                        <LabelValuePair label={'FHIR ID:'} value={this.props.persona.id} />
                        <LabelValuePair label={'Gender:'} value={this.props.persona.gender} />
                        <LabelValuePair label={'Birth Date:'} value={this.props.persona.birthDate} />
                    </div>
                </Paper>}
                {this.props.type === PersonaList.TYPES.persona && <Paper className='paper-card' zDepth={1}>
                    <Subheader>{this.props.type}</Subheader>
                    <div className='paper-body'>
                        <LabelValuePair label={'Display name:'} value={this.props.persona.fhirName} />
                        <LabelValuePair label={'User Id:'} value={this.props.persona.personaUserId} />
                        <LabelValuePair label={'Password (not secured):'} value={this.props.persona.password} />
                        <LabelValuePair label={'FHIR Resource Type:'} value={this.props.persona.resource} />
                    </div>
                </Paper>}
                {this.props.type === PersonaList.TYPES.patient && <Paper className='paper-card' zDepth={1}>
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
                </Paper>}
            </div>
        </Paper>
    }

    handleClose = () => {
        debugger
        this.props.onClose();
    }
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

const mapDispatchToProps = dispatch => bindActionCreators({ fetchPatientDetails }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index));
