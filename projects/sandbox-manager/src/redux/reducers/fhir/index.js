import * as types from "../../action-creators/types";
import initialState from "./init";
import sampleData from "./sample-data";

export default function (state = initialState, action) {
    switch (action.type) {
        case types.FHIR_RESET:
            return Object.assign({}, initialState);

        case types.FHIR_SET_CONTEXT: {
            const newState = Object.assign({}, state);
            newState.context = action.payload;
            return newState;
        }

        case types.FHIR_SET_META: {
            const newState = Object.assign({}, state);
            newState.meta = { status: "ready", ...action.payload };
            return newState;
        }

        case types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS: {
            const newState = Object.assign({}, state);
            newState.parsed.patientDemographics = {
                status: "ready",
                data: action.payload,
            };
            return newState;
        }

        case types.FHIR_SET_SAMPLE_DATA:
            return Object.assign({}, state, { ...sampleData[0] });


        case types.FHIR_SET_SMART: {
            const newState = Object.assign({}, state);
            newState.smart = action.payload;
            return newState;
        }

        case "persist/REHYDRATE":
            state = action.payload ? action.payload.fhir : state;
            break;
    }

    return state;
}
