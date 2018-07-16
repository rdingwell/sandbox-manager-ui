import * as actionTypes from "./types";

const DETAILS = [
    { resourceType: "Observation", patientSearch: "subject" },
    { resourceType: "Encounter", patientSearch: "patient" },
    { resourceType: "MedicationRequest", patientSearch: "patient" },
    { resourceType: "MedicationDispense", patientSearch: "patient" },
    { resourceType: "AllergyIntolerance", patientSearch: "patient" },
    { resourceType: "Condition", patientSearch: "subject" },
    { resourceType: "Procedure", patientSearch: "subject" },
    { resourceType: "DiagnosticReport", patientSearch: "subject" },
    { resourceType: "Immunization", patientSearch: "patient" },
    { resourceType: "CarePlan", patientSearch: "subject" },
    { resourceType: "CareTeam", patientSearch: "subject" },
    { resourceType: "Goal", patientSearch: "subject" }
];

export function patientDetailsFetchStarted () {
    return {
        type: actionTypes.PATIENT_DETAILS_FETCH_STARTED
    }
}

export function patientDetailsFetchSuccess () {
    return {
        type: actionTypes.PATIENT_DETAILS_FETCH_SUCCESS
    }
}

export function patientDetailsFetchError (error) {
    return {
        type: actionTypes.PATIENT_DETAILS_FETCH_ERROR,
        payload: { error }
    }
}

export function fetchingPatient (fetching) {
    return {
        type: actionTypes.FETCHING_SINGLE_PATIENT,
        payload: { fetching }
    }
}

export function setSinglePatientFetched (patient) {
    return {
        type: actionTypes.SINGLE_PATIENT_DATA,
        payload: { patient }
    }
}

export function setFetchingSinglePatientFailed (error) {
    return {
        type: actionTypes.SINGLE_PATIENT_FETCH_FAILED,
        payload: { error }
    }
}

export function setPatientDetails(details) {
    return {
        type: actionTypes.SET_PATIENT_DETAILS,
        payload: {details}
    }
}

export function fetchPatientDetails (patient, type) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(patientDetailsFetchStarted());
            let promises = [];

            DETAILS.map(d => {
                let query = {};
                query[d.patientSearch] = `Patient/${patient.id}`;
                let params = { type: d.resourceType, count: 1, query };

                promises.push(window.fhirClient.api.search(params));
            });

            Promise.all(promises)
                .then(data => {
                    let details = {};
                    data.map(d => {
                        details[d.config.type] = d.data ? d.data.total : 0;
                    });
                    dispatch(setPatientDetails(details));
                    dispatch(patientDetailsFetchSuccess());
                })
                .catch(error => dispatch(patientDetailsFetchError(error)));
        }
    }
}

export function fetchPatient (id) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(fetchingPatient(true));
            window.fhirClient.api.read({type: 'Patient', id})
                .done(patient => {
                    dispatch(setSinglePatientFetched(patient.data));
                    dispatch(fetchingPatient(false));
                })
                .fail(e => {
                    dispatch(setFetchingSinglePatientFailed(e));
                    dispatch(fetchingPatient(false));
                });
        }
    }
}
