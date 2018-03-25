import * as types from "./types";

export function fhir_Reset() {
    return { type: types.FHIR_RESET };
}

export function fhir_SetContext(context) {
    return {
        type: types.FHIR_SET_CONTEXT,
        payload: context,
    };
}

export function fhir_SetMeta(payload) {
    return {
        type: types.FHIR_SET_META,
        payload,
    };
}

export function fhir_SetParsedPatientDemographics(data) {
    return {
        type: types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS,
        payload: data,
    };
}

export function fhir_SetSampleData() {
    return { type: types.FHIR_SET_SAMPLE_DATA };
}

export function fhir_SetSmart(payload) {
    return {
        type: types.FHIR_SET_SMART,
        payload,
    };
}
