import * as actionTypes from './actionTypes';
import axios from '../../axios';
import * as FHIR from 'fhirclient/fhir-client';  //the console says this is unused, but without it, your queries will fail

let fhirClient = null;

const getQueryParams = (url) => {
    if(url.search){
        let urlParams;
        let match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = url.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }
};

export const clearToken = () => {
    return {
        type: actionTypes.FHIR_CLEAR_TOKEN
    }
};

export const fhirInit = () => {
    return {
        type: actionTypes.FHIR_INIT
    }
};

export const setFhirClient = (fhirClient) => {
    return {
        type: actionTypes.FHIR_CLIENT,
        fhirClient: fhirClient
    }
};

export const hspcAuthorized = () => {
    return {
        type: actionTypes.FHIR_HSPC_AUTHORIZED
    }
};

export const setFhirVersion = (fhirVersion) => {
    return{
        type: actionTypes.FHIR_VERSION,
        fhirVersion: fhirVersion
    }
};

export const setOauthUserInfo = (sbmUserId, email, name) => {
    return{
        type: actionTypes.SAVE_OAUTH_USER,
        sbmUserId: sbmUserId,
        email: email,
        name: name
    };
};

export const savePatients = (patients) => {
  return{
      type: actionTypes.LOOKUP_PATIENTS_SUCCESS,
      patients : patients
  };
};

export const lookupPatientsStart = () => {
    return{
        type: actionTypes.LOOKUP_PATIENTS_START
    }
};

export const lookupPatientsFail = (error) => {
    return {
        type: actionTypes.LOOKUP_PATIENTS_FAIL,
        error : error
    }
};


export const lookupEncounterStart = () => {
    return {
        type: actionTypes.LOOKUP_ENCOUNTER_START
    }
};

export const lookupEncounterFail = (error) => {
    return{
        type: actionTypes.LOOKUP_ENCOUNTER_FAIL,
        lookupEncounterError: error
    }
};

export const saveEncounters = (encounters) => {
    return{
        type: actionTypes.LOOKUP_ENCOUNTER_SUCCESS,
        encounters: encounters
    }
};

export const lookupMedicationRequestStart = () => {
    return{
        type: actionTypes.LOOKUP_MEDICATION_REQUEST_START
    }
};

export const lookupMedicationRequestFail = (error) => {
    return{
        type: actionTypes.LOOKUP_MEDICATION_REQUEST_FAIL,
        lookupMedicationRequestError: error
    }
};

export const saveMedicationRequest = (medicationRequests) => {
    return{
        type: actionTypes.LOOKUP_MEDICATION_REQUEST_SUCCESS,
        medicationRequests: medicationRequests
    }
};

export const lookupMedicationDispenseStart = () => {
    return{
        type: actionTypes.LOOKUP_MEDICATION_DISPENSE_START
    }
};

export const lookupMedicationDispenseFail = (error) => {
    return{
        type: actionTypes.LOOKUP_MEDICATION_DISPENSE_FAIL,
        lookupMedicationDispenseError: error
    }
};

export const saveMedicationDispense = (medicationDispense) => {
    return{
        type: actionTypes.LOOKUP_MEDICATION_DISPENSE_SUCCESS,
        medicationDispense: medicationDispense
    }
};






export const saveSandboxManagerUser = (sandboxManagerUser) => {
    return{
        type: actionTypes.SAVE_SANDBOX_USER,
        user: sandboxManagerUser
    }
};

export const saveSandboxApiEndpointIndex = (index) => {
    return{
        type: actionTypes.SAVE_ENDPOINT_INDEX,
        index: index
    }
};


const queryFhirVersion = (dispatch, fhirClient, state) => {
    fhirClient.api.conformance({})
        .then(
            response => {
                console.log(response);
                dispatch(setFhirVersion(response.data.fhirVersion));
                state.sandbox.sandboxApiEndpointIndexes.forEach((sandboxEndpoint) => {
                    if(response.data.fhirVersion === sandboxEndpoint.fhirVersion){
                        dispatch(saveSandboxApiEndpointIndex(sandboxEndpoint.index));
                    }
                });
            }
        );
};

const authorize = (url, state, sandboxId) => {
    let thisUri = sandboxId ? window.location.origin + "/launch" : window.location.origin + "/after-auth?path=" + window.location.pathname;
    let thisUrl = thisUri.replace(/\/+$/, "/");


    let client = {
        "client_id": "sand_man",
        "redirect_uri": thisUrl,
        "scope": state.fhir.scope
    };

    let config = JSON.parse(localStorage.getItem('config'));

    let serviceUrl = config.defaultServiceUrl;
    if (sandboxId !== undefined && sandboxId !== "") {
        serviceUrl = config.baseServiceUrl_1 + "/" + sandboxId + "/data";
        if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "2") {
            serviceUrl = config.baseServiceUrl_2 + "/" + sandboxId + "/data";
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "3") {
            serviceUrl = config.baseServiceUrl_3 + "/" + sandboxId + "/data";
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "4") {
            serviceUrl = config.baseServiceUrl_4 + "/" + sandboxId + "/data";
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "5") {
            serviceUrl = config.baseServiceUrl_5  + "/" + sandboxId + "/data";
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "6") {
            serviceUrl = config.baseServiceUrl_6 + "/" + sandboxId + "/data";
        }
    }




    window.FHIR.oauth2.authorize({
        client: client,
        server: serviceUrl,
        from: url.pathname ? url.pathname : '/'
    }, function (err) {
        //error
    });
};

export const authorizeSandbox = (sandboxId) => {
    return(dispatch, getState) => {
        const state = getState();
        authorize(window.location, state, sandboxId);
    }
};

export const fetchPatients = () => {
    return (dispatch, getState) => {
        dispatch(lookupPatientsStart());
        let count = 50;

/*
        if(!count){
            count = 50;
        }
*/

        let searchParams = {type: "Patient", count: count};
        searchParams.query = {};
/*
        if(searchValue) {
            searchParams.query = searchValue;
        }
        if(sort) {
            searchParams.query['$sort'] = sort;
            searchParams.query['name'] = tokens;
        }
*/

        ///sandbox1/data/Patient?_sort:desc=family&_sort:desc=given&name=&_count=50
        //http://localhost:8076/stu3/data/Patient?&_count=50

        window.fhirClient.api.search(searchParams)
            .then(response => {
                let resourceResults = [];

                for(let key in response.data.entry){
                    response.data.entry[key].resource.fullUrl = response.data.entry[key].fullUrl;
                    resourceResults.push(response.data.entry[key].resource);
                }
                dispatch(savePatients(resourceResults));
        }).fail(error => {
            dispatch(lookupPatientsFail(error));
        });
    };
};





/*
export const LOOKUP_ALLERGY_INTOLERANCE_START = "LOOKUP_ALLERGY_INTOLERANCE_START";
export const LOOKUP_ALLERGY_INTOLERANCE_SUCCESS = "LOOKUP_ALLERGY_INTOLERANCE_SUCCESS";
export const LOOKUP_ALLERGY_INTOLERANCE_FAIL = "LOOKUP_ALLERGY_INTOLERANCE_FAIL";
export const LOOKUP_CONDITION_START = "LOOKUP_CONDITION_START";
export const LOOKUP_CONDITION_SUCCESS = "LOOKUP_CONDITION_SUCCESS";
export const LOOKUP_CONDITION_FAIL = "LOOKUP_CONDITION_FAIL";
export const LOOKUP_PROCEDURE_START = "LOOKUP_PROCEDURE_START";
export const LOOKUP_PROCEDURE_SUCCESS = "LOOKUP_PROCEDURE_SUCCESS";
export const LOOKUP_PROCEDURE_FAIL = "LOOKUP_PROCEDURE_FAIL";
export const LOOKUP_PROCEDURE_REQUEST_START = "LOOKUP_PROCEDURE_REQUEST_START";
export const LOOKUP_PROCEDURE_REQUEST_SUCCESS = "LOOKUP_PROCEDURE_REQUEST_SUCCESS";
export const LOOKUP_PROCEDURE_REQUEST_FAIL = "LOOKUP_PROCEDURE_REQUEST_FAIL";
export const LOOKUP_DIAGNOSTIC_REPORT_START = "LOOKUP_DIAGNOSTIC_REPORT_START";
export const LOOKUP_DIAGNOSTIC_REPORT_SUCCESS = "LOOKUP_DIAGNOSTIC_REPORT_SUCCESS";
export const LOOKUP_DIAGNOSTIC_REPORT_FAIL = "LOOKUP_DIAGNOSTIC_REPORT_FAIL";
export const LOOKUP_IMMUNIZATION_START = "LOOKUP_IMMUNIZATION_START";
export const LOOKUP_IMMUNIZATION_SUCCESS = "LOOKUP_IMMUNIZATION_SUCCESS";
export const LOOKUP_IMMUNIZATION_FAIL = "LOOKUP_IMMUNIZATION_FAIL";
export const LOOKUP_CARE_PLAN_START = "LOOKUP_CARE_PLAN_START";
export const LOOKUP_CARE_PLAN_SUCCESS = "LOOKUP_CARE_PLAN_SUCCESS";
export const LOOKUP_CARE_PLAN_FAIL = "LOOKUP_CARE_PLAN_FAIL";
export const LOOKUP_CARE_TEAM_START = "LOOKUP_CARE_TEAM_START";
export const LOOKUP_CARE_TEAM_SUCCESS = "LOOKUP_CARE_TEAM_SUCCESS";
export const LOOKUP_CARE_TEAM_FAIL = "LOOKUP_CARE_TEAM_FAIL";
export const LOOKUP_GOAL_START = "LOOKUP_GOAL_START";
export const LOOKUP_GOAL_SUCCESS = "LOOKUP_GOAL_SUCCESS";
export const LOOKUP_GOAL_FAIL = "LOOKUP_GOAL_FAIL";

*/

export const init = (url) => {
    return (dispatch, getState) => {
        const state = getState();
        authorize(url, state);
    }
};



export const afterFhirAuth = (url) => {
    return (dispatch, getState) => {
        let configuration = JSON.parse(localStorage.getItem('config'));
        const state = getState();
        let params = getQueryParams(url);
        if(params && params.code) {
            dispatch(clearToken());
            window.FHIR.oauth2.ready(params, function(newSmart) {
                dispatch(hspcAuthorized());
                dispatch(setFhirClient(newSmart));
                fhirClient = newSmart;
                window.fhirClient = newSmart;
                queryFhirVersion(dispatch, fhirClient, state);
                const config = {
                    headers: {
                        Authorization: 'BEARER ' + fhirClient.server.auth.token
                    }
                };
                axios.post(configuration.oauthUserInfoUrl, null, config)
                    .then(response => {
                        dispatch(setOauthUserInfo(response.data.sub, response.data.preferred_username, response.data.name));

                        axios.get(configuration.sandboxManagerApiUrl + '/user?sbmUserId=' + encodeURIComponent(response.data.sub), config)
                            .then(userResponse => {
                                dispatch(saveSandboxManagerUser(userResponse.data));
                            });
                    });
            });
        }
    }
};


export const fhirLogin = () => {
    return {
        type: actionTypes.FHIR_LOGIN
    };
};

export const fhirLoginSuccess = () => {
    return {
        type: actionTypes.FHIR_LOGIN_SUCCESS
    };
};

export const fhirLoginFail = () => {
    return {
        type: actionTypes.FHIR_LOGIN_FAIL
    };
};


