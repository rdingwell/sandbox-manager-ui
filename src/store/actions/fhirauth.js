import * as actionTypes from './actionTypes';
import axios from '../../axiox';
import * as FHIR from 'fhirclient/fhir-client';

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

export const saveSandboxManagerUser = (sandboxManagerUser) => {
    return{
        type: actionTypes.SAVE_SANDBOX_USER,
        user: sandboxManagerUser
    }
};


const queryFhirVersion = (dispatch, fhirClient) => {
    fhirClient.api.conformance({})
        .then(
            response => {
                console.log(response);
                dispatch(setFhirVersion(response.data.fhirVersion));
            }
        );
};

const authorize = (url, state) => {
    let thisUri = window.location.origin + "/after-auth?path=" + window.location.pathname;
    let thisUrl = thisUri.replace(/\/+$/, "/");


    let client = {
        "client_id": "sand_man",
        "redirect_uri": thisUrl,
        "scope": state.fhir.scope
    };

    window.FHIR.oauth2.authorize({
        client: client,
        server: state.fhir.defaultServiceUrl,
        from: url.pathname
    }, function (err) {
        //error
    });
};


export const init = (url) => {
    return (dispatch, getState) => {
        const state = getState();
        authorize(url, state);
    }
};


export const afterFhirAuth = (url) => {
    return (dispatch, getState) => {
        const state = getState();
        let params = getQueryParams(url);
        if(params && params.code) {
            dispatch(clearToken());
            window.FHIR.oauth2.ready(params, function(newSmart) {
                dispatch(hspcAuthorized());
                dispatch(setFhirClient(newSmart));
                queryFhirVersion(dispatch, newSmart);
                const config = {
                    headers: {
                        Authorization: 'BEARER ' + newSmart.server.auth.token
                    }
                };
                axios.post(state.fhir.oauthUserInfoUrl, null, config)
                    .then(response => {
                        dispatch(setOauthUserInfo(response.data.sub, response.data.preferred_username, response.data.name))

                        axios.get(state.fhir.sandboxManagerApiUrl + '/user?sbmUserId=' + encodeURIComponent(response.data.sub), config)
                            .then(userResponse => {
                                dispatch(saveSandboxManagerUser(userResponse.data));
                            });
                    });
            });
        }
        if(state.fhir.hspcAccountCookieName){
            console.log("cookie");
        }
        // if not oauth auth against server
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


