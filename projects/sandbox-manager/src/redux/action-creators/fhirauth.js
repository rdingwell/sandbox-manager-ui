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

export function clearToken () {
    return {
        type: actionTypes.FHIR_CLEAR_TOKEN
    }
}

export function fhirInit () {
    return {
        type: actionTypes.FHIR_INIT
    }
}

export function setFhirClient (fhirClient) {
    return {
        type: actionTypes.FHIR_CLIENT,
        fhirClient: fhirClient
    }
}

export function hspcAuthorized () {
    return {
        type: actionTypes.FHIR_HSPC_AUTHORIZED
    }
}

export function setFhirVersion (fhirVersion) {
    return {
        type: actionTypes.FHIR_VERSION,
        fhirVersion: fhirVersion
    }
}

export function saveSandboxApiEndpointIndex (index) {
    return {
        type: actionTypes.SAVE_ENDPOINT_INDEX,
        index: index
    }
}

function queryFhirVersion (dispatch, fhirClient, state) {
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
}

export function authorize (url, state, sandboxId) {
    let thisUri = sandboxId ? window.location.origin + "/launch" : window.location.origin + "/after-auth";
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
}

export function init () {
    return (dispatch, getState) => {
        const state = getState();
        authorize(window.location, state);
    }
}

export function afterFhirAuth (url) {
    return dispatch => {
        let params = getQueryParams(url);
        if (params && params.code) {
            dispatch(clearToken());
            try {
                window.FHIR.oauth2.ready(params, function (newSmart) {
                    dispatch(fhirauth_setSmart(newSmart));
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
}

export function fhirauth_setSmart (smart, redirect = null) {
    return (dispatch, getState) => {
        let state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(hspcAuthorized());
        dispatch(setFhirClient(smart));
        fhirClient = smart;
        window.fhirClient = smart;
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
                                        let state = getState();
                                        redirect && redirect.push(`/${state.app.screen}`);
                                    });
                            });
                    });
            });
    }
}

export function fhirLogin () {
    return {
        type: actionTypes.FHIR_LOGIN
    };
}

export function fhirLoginSuccess () {
    return {
        type: actionTypes.FHIR_LOGIN_SUCCESS
    };
}

export function fhirLoginFail () {
    return {
        type: actionTypes.FHIR_LOGIN_FAIL
    }
}


