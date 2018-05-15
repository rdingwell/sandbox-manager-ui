import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case actionTypes.FHIR_LOGIN:
            state.error = null;
            state.loading = true;
            break;
        case actionTypes.FHIR_HSPC_AUTHORIZED:
            state.hspcAuthorized = true;
            break;
        case actionTypes.FHIR_CLIENT:
            state.fhirClient = action.fhirClient;
            break;
        case actionTypes.FHIR_VERSION:
            state.fhirVersion = action.fhirVersion;
            break;
        case actionTypes.SET_FHIR_SERVER_URL:
            state = setServerUrl(state, action);
            break;
        case actionTypes.APP_RESET_STATE:
            state = initialState;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.fhirauth : state;
            break;
    }

    return state;
};

const setServerUrl = (state, action) => {
    const fhirClient = { ...state.fhirClient };
    const server = { ...fhirClient.server };
    server.serviceUrl = "http://localhost:8076/" + action.sandboxId + "/data";
    fhirClient.server = server;

    state.fhirClient = fhirClient;
    return state;
};
