import * as actionTypes from './types';
import { setOauthUserInfo, saveSandboxManagerUser } from './users';
import { fetchSandboxes, fetchUserNotifications, loadInvites } from "./sandbox";
import API from '../../lib/api';
import Cookies from 'js-cookie';

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

export function fhirLogin () {
    return {
        type: actionTypes.FHIR_LOGIN
    };
}

export function setServerUrl () {
    const fhirClient = { ...state.fhirClient };
    const server = { ...fhirClient.server };
    const sandboxId = action.sandboxId;
    const fhirVersion = state.fhirVersion;
    if (sandboxId !== undefined && sandboxId !== "") {
        server.serviceUrl = config.baseServiceUrl_5 + "/" + sandboxId + "/data";
        if (fhirVersion !== undefined && fhirVersion !== "" && fhirVersion === "1.6.0") {
            server.serviceUrl = config.baseServiceUrl_3 + "/" + sandboxId + "/data";
        } else if (fhirVersion !== undefined && fhirVersion !== "" && fhirVersion === "1.8.0") {
            server.serviceUrl = config.baseServiceUrl_4 + "/" + sandboxId + "/data";
        } else if (fhirVersion !== undefined && fhirVersion !== "" && fhirVersion === "3.0.1") {
            server.serviceUrl = config.baseServiceUrl_6 + "/" + sandboxId + "/data";
        } else if (fhirVersion !== undefined && fhirVersion !== "" && fhirVersion === "3.4.0") {
            server.serviceUrl = config.baseServiceUrl_7 + "/" + sandboxId + "/data";
        }
    }
    server.serviceUrl = "http://localhost:8075/" + action.sandboxId + "/data";
    fhirClient.server = server;

    state.fhirClient = fhirClient;
    return state;
}

export function fhirLoginSuccess () {
    return {
        type: actionTypes.FHIR_LOGIN_SUCCESS
    };
}

export function goHome () {
    sessionStorage && sessionStorage.clear && sessionStorage.clear();
    localStorage && localStorage.clear && localStorage.clear();

    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let spcook = cookies[i].split("=");
        deleteCookie(spcook[0]);
    }

    function deleteCookie (cookiename) {
        Cookies.remove(cookiename, { path: '/' });
    }

    window.location = window.location.origin;
}

export function fhirLoginFail () {
    return {
        type: actionTypes.FHIR_LOGIN_FAIL
    }
}

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
    let thisUri = sandboxId ? window.location.origin + "/" + sandboxId + "/apps" : window.location.origin + "/after-auth";
    let thisUrl = thisUri.replace(/\/+$/, "/");

    let client = {
        "client_id": "sand_man",
        "redirect_uri": thisUrl,
        "scope": state.fhirauth.scope
    };

    let config = state.config.xsettings.data.sandboxManager;
    let serviceUrl = config.defaultServiceUrl;

    Cookies.remove(config.personaCookieName, { path: '/' });

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
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "7") {
            serviceUrl = config.baseServiceUrl_7 + "/" + sandboxId + "/data";
        }
    }

    window.FHIR.oauth2.authorize({
        client: client,
        server: serviceUrl,
        from: url.pathname ? url.pathname : '/'
    }, function (err) {
        console.log(err);
        goHome();
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
                // For some reason if we make the call too quickly the server responds that the
                // token is invalid... we need to slow down the call a bit to prevent random
                // 400 errors
                setTimeout(() => {
                    window.FHIR.oauth2.ready(function (newSmart) {
                        dispatch(fhirauth_setSmart(newSmart));
                    });
                }, 1000);
            } catch (e) {
                goHome();
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

        API.post(configuration.oauthUserInfoUrl, dispatch)
            .then(data => {
                dispatch(setOauthUserInfo(data.sub, data.preferred_username, data.name));
                API.get(configuration.sandboxManagerApiUrl + '/user?sbmUserId=' + encodeURIComponent(data.sub), dispatch)
                    .then(data2 => {
                        dispatch(saveSandboxManagerUser(data2));
                        let state = getState();
                        redirect && sessionStorage.sandboxId && redirect.push(`/${sessionStorage.sandboxId}/${state.app.screen}`);
                        redirect && sessionStorage.sandboxId && state.sandbox.sandboxes.length &&
                        dispatch(saveSandboxApiEndpointIndex(state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId).apiEndpointIndex));
                        window.location.pathname !== '/dashboard' && dispatch(fetchSandboxes());
                        dispatch(loadInvites());
                        dispatch(fetchUserNotifications());
                    })
                    .catch(() => {
                    })
            })
            .catch(() => {
                goHome();
            });
    }
}
