import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    loading: false,
    error: null,
    hspcAuthorized : false,
    fhirClient: null,
    fhirVersion: null,
    scope: 'smart/orchestrate_launch user/*.* profile openid',
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const clearToken = (state, action) => {
    return updateObject(state, {token: null});
};

const hspcAuthorized = ( state, action ) => {
    return updateObject(state, {hspcAuthorized: true});
};

const setFhirClient = ( state, action ) => {
    return updateObject(state, {fhirClient: action.fhirClient});
};

const setFhirVersion = ( state, action ) => {
    return updateObject(state, {fhirVersion: action.fhirVersion});
};

const setServerUrl = (state, action) => {
    const fhirClient = {...state.fhirClient};
    const server = {...fhirClient.server};
    server.serviceUrl = "http://localhost:8076/" + action.sandboxId + "/data";
    fhirClient.server = server;

    return updateObject(state, {fhirClient: fhirClient});

};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.FHIR_LOGIN: return authStart(state, action);
        case actionTypes.FHIR_HSPC_AUTHORIZED: return hspcAuthorized(state, action);
        case actionTypes.FHIR_CLIENT: return setFhirClient(state, action);
        case actionTypes.FHIR_VERSION: return setFhirVersion(state, action);
        case actionTypes.SET_FHIR_SERVER_URL: return setServerUrl(state, action);
        default:
            return state;
    }
};

export default reducer;