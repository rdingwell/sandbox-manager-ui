import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    loading: false,
    error: null,
    hspcAuthorized : false,
    fhirClient: null,
    fhirVersion: null,
    hspcAccountCookieName: 'hspc-token',
    defaultServiceUrl: 'http://localhost:8076/stu3/data',
    scope: 'smart/orchestrate_launch user/*.* profile openid',
    oauthUserInfoUrl: 'http://localhost:8060/userinfo',
    sandboxManagerApiUrl: 'http://localhost:12000'

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

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.FHIR_LOGIN: return authStart(state, action);
        case actionTypes.FHIR_HSPC_AUTHORIZED: return hspcAuthorized(state, action);
        case actionTypes.FHIR_CLIENT: return setFhirClient(state, action);
        case actionTypes.FHIR_VERSION: return setFhirVersion(state, action);
        default:
            return state;
    }
};

export default reducer;