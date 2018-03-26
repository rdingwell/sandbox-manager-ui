import * as actionTypes from './types';
import { setOauthUserInfo, saveSandboxManagerUser } from './users';

let fhirClient = null;

const getQueryParams = (url) => {
    if (url.search) {
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
    return {
        type: actionTypes.FHIR_VERSION,
        fhirVersion: fhirVersion
    }
};

export const savePatients = (patients) => {
    return {
        type: actionTypes.LOOKUP_PATIENTS_SUCCESS,
        patients: patients
    };
};

export const lookupPatientsStart = () => {
    return {
        type: actionTypes.LOOKUP_PATIENTS_START
    }
};

export const lookupPatientsFail = (error) => {
    return {
        type: actionTypes.LOOKUP_PATIENTS_FAIL,
        error: error
    }
};

export const saveSandboxApiEndpointIndex = (index) => {
    return {
        type: actionTypes.SAVE_ENDPOINT_INDEX,
        index: index
    }
};

const queryFhirVersion = (dispatch, fhirClient, state) => {
    fhirClient.api.conformance({})
        .then(
            response => {
                dispatch(setFhirVersion(response.data.fhirVersion));
                state.sandbox.sandboxApiEndpointIndexes.forEach((sandboxEndpoint) => {
                    if (response.data.fhirVersion === sandboxEndpoint.fhirVersion) {
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
        "scope": state.fhirauth.scope
    };

    let config = state.config.xsettings.data.sandboxManager;

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
            serviceUrl = config.baseServiceUrl_5 + "/" + sandboxId + "/data";
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
    return (dispatch, getState) => {
        const state = getState();
        authorize(window.location, state, sandboxId);
    }
};


export const fetchPatients = () => {
    return dispatch => {
        dispatch(lookupPatientsStart());
        let count = 50;

        let searchParams = { type: "Patient", count: count };
        searchParams.query = {};

        window.fhirClient.api.search(searchParams)
            .then(response => {
                let resourceResults = [];

                for (let key in response.data.entry) {
                    response.data.entry[key].resource.fullUrl = response.data.entry[key].fullUrl;
                    resourceResults.push(response.data.entry[key].resource);
                }
                dispatch(savePatients(resourceResults));
            }).fail(error => {
            dispatch(lookupPatientsFail(error));
        });
    };
};

export const init = () => {
    return (dispatch, getState) => {
        const state = getState();
        authorize(window.location, state);
    }
};

export const afterFhirAuth = (url) => {
    return (dispatch, getState) => {
        const state = getState();
        let params = getQueryParams(url);
        if (params && params.code) {
            dispatch(clearToken());
            window.FHIR.oauth2.ready(params, function (newSmart) {
                let configuration = state.config.xsettings.data.sandboxManager;
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

                fetch(configuration.oauthUserInfoUrl, Object.assign({ method: "POST" }, config))
                    .then(response => {
                        response.json()
                            .then(data => {
                                dispatch(setOauthUserInfo(data.sub, data.preferred_username, data.name));

                                fetch(configuration.sandboxManagerApiUrl + '/user?sbmUserId=' + encodeURIComponent(data.sub), config)
                                    .then(resp => {
                                        resp.json()
                                            .then(data => {
                                                dispatch(saveSandboxManagerUser(data));
                                            });
                                    });
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


