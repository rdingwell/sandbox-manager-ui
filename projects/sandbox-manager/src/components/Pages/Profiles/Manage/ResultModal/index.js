import React, {Component} from 'react';
import {Dialog, IconButton} from "@material-ui/core";

import './styles.less';

const DATA = {
    "id": "2e0289c0-aa5e-40d8-836a-ac5b4ac222ca",
    "status": false,
    "error": null,
    "resourceSaved": ["SearchParameter - us-core-encounter-date", "SearchParameter - us-core-patient-identifier", "CodeSystem - condition-category", "SearchParameter - us-core-diagnosticreport-status", "SearchParameter - us-core-careteam-status", "SearchParameter - us-core-encounter-class", "SearchParameter - us-core-careplan-status", "ValueSet - us-core-documentreference-type", "SearchParameter - us-core-condition-patient", "SearchParameter - us-core-encounter-id", "ValueSet - us-core-condition-code", "SearchParameter - us-core-device-type", "ValueSet - us-core-observation-smokingstatus", "SearchParameter - us-core-encounter-status", "CodeSystem - us-core-provenance-participant-type", "ValueSet - us-core-careteam-provider-roles", "SearchParameter - us-core-medicationrequest-authoredon", "SearchParameter - us-core-careplan-patient", "SearchParameter - us-core-practitionerrole-practitioner", "SearchParameter - us-core-procedure-status", "SearchParameter - us-core-documentreference-patient", "ValueSet - us-core-provider-role", "ValueSet - us-core-observation-value-codes", "SearchParameter - us-core-encounter-type", "SearchParameter - us-core-organization-address", "ValueSet - us-core-documentreference-category", "SearchParameter - us-core-patient-birthdate", "ValueSet - birthsex", "SearchParameter - us-core-location-name", "ValueSet - us-core-narrative-status", "SearchParameter - us-core-documentreference-date", "SearchParameter - us-core-patient-gender", "SearchParameter - us-core-immunization-date", "SearchParameter - us-core-diagnosticreport-date", "SearchParameter - us-core-immunization-patient", "ValueSet - omb-ethnicity-category", "SearchParameter - us-core-diagnosticreport-category", "SearchParameter - us-core-encounter-patient", "SearchParameter - us-core-documentreference-type", "SearchParameter - us-core-race", "SearchParameter - us-core-location-address-city", "SearchParameter - us-core-medicationrequest-status", "SearchParameter - us-core-immunization-status", "SearchParameter - us-core-documentreference-category", "ValueSet - simple-language", "SearchParameter - us-core-procedure-patient", "SearchParameter - us-core-allergyintolerance-clinical-status", "SearchParameter - us-core-diagnosticreport-code", "SearchParameter - us-core-goal-patient", "CodeSystem - us-core-documentreference-category", "SearchParameter - us-core-practitioner-identifier", "SearchParameter - us-core-observation-patient", "SearchParameter - us-core-encounter-identifier", "SearchParameter - us-core-patient-id", "SearchParameter - us-core-ethnicity", "SearchParameter - us-core-patient-name", "SearchParameter - us-core-medicationrequest-encounter", "ValueSet - us-core-encounter-type", "ValueSet - detailed-ethnicity", "SearchParameter - us-core-patient-given", "ValueSet - us-core-medication-codes", "SearchParameter - us-core-documentreference-id", "SearchParameter - us-core-location-address-postalcode", "ValueSet - detailed-race", "ValueSet - us-core-observation-smoking-status-status", "ValueSet - us-core-smoking-status-observation-codes", "ValueSet - us-core-provider-specialty", "SearchParameter - us-core-observation-code", "ValueSet - us-core-diagnosticreport-category", "SearchParameter - us-core-careteam-patient", "SearchParameter - us-core-procedure-code", "SearchParameter - us-core-goal-target-date", "SearchParameter - us-core-condition-category", "SearchParameter - us-core-procedure-date", "ValueSet - us-core-vaccines-cvx", "SearchParameter - us-core-location-address-state", "CodeSystem - careplan-category", "SearchParameter - us-core-practitionerrole-specialty", "SearchParameter - us-core-goal-lifecycle-status", "ValueSet - us-core-ndc-vaccine-codes", "SearchParameter - us-core-allergyintolerance-patient", "ValueSet - us-core-clinical-note-type", "SearchParameter - us-core-condition-code", "SearchParameter - us-core-documentreference-period", "SearchParameter - us-core-careplan-category", "ValueSet - us-core-procedure-code", "SearchParameter - us-core-device-patient", "SearchParameter - us-core-diagnosticreport-patient", "SearchParameter - us-core-practitioner-name", "SearchParameter - us-core-medicationrequest-patient", "SearchParameter - us-core-location-address", "SearchParameter - us-core-patient-family", "SearchParameter - us-core-careplan-date", "SearchParameter - us-core-observation-date", "SearchParameter - us-core-condition-onset-date", "ValueSet - omb-race-category", "ValueSet - us-core-allergy-substance", "SearchParameter - us-core-organization-name", "ValueSet - us-core-diagnosticreport-report-and-note-codes", "ValueSet - us-core-provenance-participant-type", "SearchParameter - us-core-condition-clinical-status", "CodeSystem - cdcrec", "SearchParameter - us-core-documentreference-status", "ValueSet - us-core-procedure-icd10pcs", "SearchParameter - us-core-medicationrequest-intent", "ValueSet - us-core-diagnosticreport-lab-codes", "ValueSet - us-core-usps-state", "SearchParameter - us-core-observation-status", "SearchParameter - us-core-observation-category"],
    "resourceNotSaved": ["StructureDefinition - us-core-ethnicity - 400 null", "StructureDefinition - pediatric-weight-for-height - 400 null", "StructureDefinition - us-core-practitionerrole - 400 null", "StructureDefinition - us-core-diagnosticreport-lab - 400 null", "StructureDefinition - us-core-allergyintolerance - 400 null", "StructureDefinition - us-core-race - 400 null", "StructureDefinition - us-core-provenance - 400 null", "StructureDefinition - us-core-careplan - 400 null", "StructureDefinition - us-core-birthsex - 400 null", "StructureDefinition - us-core-implantable-device - 400 null", "StructureDefinition - us-core-practitioner - 400 null", "StructureDefinition - us-core-pulse-oximetry - 400 null", "StructureDefinition - us-core-medicationrequest - 400 null", "StructureDefinition - pediatric-bmi-for-age - 400 null", "ValueSet - us-core-condition-category - 500 null", "StructureDefinition - us-core-organization - 400 null", "StructureDefinition - us-core-careteam - 400 null", "StructureDefinition - us-core-encounter - 400 null", "StructureDefinition - us-core-direct - 400 null", "StructureDefinition - us-core-observation-lab - 400 null", "StructureDefinition - us-core-goal - 400 null", "StructureDefinition - us-core-immunization - 400 null", "StructureDefinition - us-core-patient - 400 null", "StructureDefinition - us-core-condition - 400 null", "StructureDefinition - us-core-smokingstatus - 400 null", "StructureDefinition - us-core-medication - 400 null", "StructureDefinition - us-core-location - 400 null", "StructureDefinition - us-core-documentreference - 400 null", "StructureDefinition - us-core-diagnosticreport-note - 400 null", "StructureDefinition - us-core-procedure - 400 null"],
    "totalCount": 139,
    "resourceSavedCount": 109,
    "resourceNotSavedCount": 30
};

class ResultModal extends Component {
    render() {
        let titleStyle = {
            backgroundColor: this.props.theme.p2,
            color: this.props.theme.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <Dialog open={this.props.open} onClose={this.props.onClose} classes={{paper: 'loading-results'}}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button white" onClick={() => this.setState({showConfirmation: false, profileToDelete: undefined})}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h1 style={titleStyle}>Profile loading results</h1>
            </div>
            <div className='profiles-loading-results-wrapper'>
                <p>
                    Items: {DATA.totalCount} &emsp;
                    Items loaded: {DATA.resourceSavedCount} &emsp;
                    Items NOT loaded: <span style={{color: 'red'}}>{DATA.resourceNotSavedCount}</span>
                </p>
                <div>
                    <div>Files loaded:</div>
                    <div>
                        {DATA.resourceSaved.join(', ')}
                    </div>
                </div>
                <div>
                    <div>Files NOT loaded:</div>
                    <div>
                        {DATA.resourceNotSaved.join(', ')}
                    </div>
                </div>
            </div>
        </Dialog>;
    }
}

export default ResultModal;
