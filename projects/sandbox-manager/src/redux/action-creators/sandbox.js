import * as actionTypes from './types';
import { authorize, saveSandboxApiEndpointIndex } from './fhirauth';
import { fetchPersonas } from "./persona";

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const selectSandboxById = (sandboxId) => {
    localStorage.setItem('sandboxId', sandboxId);
    sessionStorage['sandboxId'] = sandboxId;
    return { type: actionTypes.SELECT_SANDBOX }
};

export const removeUser = (userId) => {
    return {
        type: actionTypes.REMOVE_SANDBOX_USER,
        userId: userId
    }
};

export const clearResults = () => {
    return {
        type: actionTypes.CLEAR_RESULTS
    }
};

export const setDataImporting = (importing) => {
    return {
        type: actionTypes.SET_DATA_IMPORTING,
        payload: { importing }
    }
};

export const setImportResults = (results) => {
    return {
        type: actionTypes.SET_IMPORT_RESULTS,
        payload: { results }
    }
};

export function setLaunchScenariosLoading (loading) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS_LOADING,
        payload: { loading }
    }
}

export function setScenarioCreating (creating) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS_CREATING,
        payload: { creating }
    }
}

export function setScenarioDeleting (deleting) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS_DELETING,
        payload: { deleting }
    }
}

export function setLaunchScenarios (scenarios) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS,
        payload: { scenarios }
    }
}

export const fetchSandboxesStart = () => {
    return {
        type: actionTypes.FETCH_SANDBOXES_START
    };
};

export const fetchSandboxInvitesStart = () => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_START
    };
};

export const fetchSandboxesSuccess = (sandboxes) => {
    return {
        type: actionTypes.FETCH_SANDBOXES_SUCCESS,
        sandboxes: sandboxes
    }
};

export const fetchSandboxInvitesSuccess = (invitations) => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_SUCCESS,
        invitations: invitations
    }
};

export const fetchSandboxesFail = (error) => {
    return {
        type: actionTypes.FETCH_SANDBOXES_FAIL,
        error: error
    }
};

export const fetchSandboxInvitesFail = (error) => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_FAIL,
        error: error
    }
};

export const setCreatingSandbox = (creating) => {
    return {
        type: actionTypes.CREATING_SANDBOX,
        payload: { creating }
    }
};

export const createSandboxFail = (error) => {
    return {
        type: actionTypes.CREATE_SANDBOX_FAIL,
        error: error
    }
};

export const createSandboxSuccess = (sandbox) => {
    return {
        type: actionTypes.CREATE_SANDBOX_SUCCESS,
        sandbox: sandbox
    }
};

export const lookupSandboxByIdStart = () => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_START
    }
};

export const lookupSandboxByIdFail = (error) => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_FAIL,
        error: error
    }
};

export const lookupSandboxByIdSuccess = (sandboxes) => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_SUCCESS,
        sandboxes: sandboxes
    }
};

export const setDefaultSandboxUser = (user) => {
    return {
        type: actionTypes.SET_DEFAULT_SANDBOX_USER,
        payload: { user }
    }
};

export const setInvitesLoading = (loading) => {
    return {
        type: actionTypes.SET_INVITES_LOADING,
        payload: { loading }
    }
};

export const setInvites = (invites) => {
    return {
        type: actionTypes.SET_INVITES,
        payload: { invites }
    }
};

export const setResettingCurrentSandbox = (resetting) => {
    return {
        type: actionTypes.SET_RESETTING_CURRENT_SANDBOX,
        payload: { resetting }
    }
};

export function createResource (data) {
    return dispatch => {
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        };
        let url = `${window.fhirClient.server.serviceUrl}/${data.resourceType}`;

        fetch(url, config)
            .then(result => result.json()
                .then(_ => {
                    dispatch(fetchPersonas(data.resourceType));
                }))
    }
}

export const importData = (data) => {
    return dispatch => {
        dispatch(setDataImporting(true));
        let promises = [window.fhirClient.api.transaction({ data })];
        Promise.all(promises)
            .then(result => {
                console.log(result);
                dispatch(setDataImporting(false));
                dispatch(setImportResults(result));
            })
            .catch(error => {
                console.log(error);
                dispatch(setDataImporting(false));
                dispatch(setImportResults(error));
            })
    }
};

export const deleteCurrentSandbox = (history) => {
    return (dispatch, getState) => {
        let state = getState();

        let sandboxId = sessionStorage.sandboxId;
        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        };
        dispatch(setResettingCurrentSandbox(true));

        fetch(`${configuration.sandboxManagerApiUrl}/sandbox/${sandboxId}`, config)
            .then(() => {
                history && history.push('/dashboard');
                dispatch(setResettingCurrentSandbox(false));
                dispatch(selectSandboxById());
            })
            .catch(e => {
                console.log(e);
            });
    }
};

export const resetCurrentSandbox = (applyDefaultDataSet) => {
    return (dispatch, getState) => {
        dispatch(setResettingCurrentSandbox(true));
        let state = getState();

        let sandboxId = sessionStorage.sandboxId;
        let configuration = state.config.xsettings.data.sandboxManager;
        let dataSet = (applyDefaultDataSet ? 'DEFAULT' : 'NONE');
        let data = { sandboxId, dataSet };
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        };
        fetch(`${configuration.sandboxManagerApiUrl}/fhirdata/reset?sandboxId=${sandboxId}&dataSet=${dataSet}`, config)
            .then(result => {
                //
            })
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                dispatch(setResettingCurrentSandbox(false));
            });
    }
};

export const updateSandbox = (sandboxDetails) => {
    const UPDATE_EVENT = {
        type: actionTypes.UPDATE_SANDBOX,
        sandboxDetails: sandboxDetails
    };

    return (dispatch, getState) => {
        // dispatch(setScenarioCreating(true));
        let state = getState();

        let selectedSandbox = sessionStorage.sandboxId;
        let configuration = state.config.xsettings.data.sandboxManager;
        let data = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
        data = Object.assign(data, sandboxDetails);
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        };
        fetch(`${configuration.sandboxManagerApiUrl}/sandbox/${selectedSandbox}`, config)
            .then(result => {
                result.json().then(() => {
                    dispatch(UPDATE_EVENT);
                });
            })
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                // dispatch(setScenarioCreating(false));
            });
    };
};

export const selectSandbox = (sandbox) => {
    return (dispatch, getState) => {
        let state = getState();

        let queryParams = "?userId=" + encodeURIComponent(state.users.oauthUser.sbmUserId);

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token
            }
        };
        if (sandbox !== undefined) {
            let sandboxId = sandbox.sandboxId;
            fetch(configuration.sandboxManagerApiUrl + '/sandbox/' + sandboxId + "/login" + queryParams, Object.assign({ method: "POST" }, config))
                .then(() => {
                    dispatch(authorizeSandbox(sandbox));
                    dispatch(setDefaultUrl(sandboxId));
                    dispatch(selectSandboxById(sandboxId));
                    dispatch(getDefaultUserForSandbox(sandboxId));
                });
        }
    };

};

export function toggleUserAdminRights (userId, toggle) {
    return (dispatch, getState) => {
        let state = getState();
        let queryParams = "?editUserRole=" + encodeURIComponent(userId) + "&role=ADMIN&add=" + (toggle ? 'true' : 'false');

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        };
        fetch(configuration.sandboxManagerApiUrl + '/sandbox/' + sessionStorage.sandboxId + queryParams, Object.assign({ method: "PUT" }, config))
            .then(() => {
                dispatch(fetchSandboxes());
            });
    };
}

export function deleteScenario (scenario) {
    return (dispatch, getState) => {
        dispatch(setScenarioDeleting(true));
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        };
        fetch(`${configuration.sandboxManagerApiUrl}/launchScenario/${scenario.id}`, config)
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                dispatch(setScenarioDeleting(false));
            });
    }
}

export function createScenario (data) {
    return (dispatch, getState) => {
        dispatch(setScenarioCreating(true));
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(configuration.sandboxManagerApiUrl + '/launchScenario/', Object.assign({ method: "POST" }, config))
            .then(result => {
                result.json()
                    .then(r => {
                        console.log(r);
                    });
            })
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                dispatch(setScenarioCreating(false));
            });
    }
}

export function updateLaunchScenario (scenario, description) {
    return (dispatch, getState) => {
        dispatch(setScenarioCreating(true));
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        scenario.description = description;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scenario)
        };
        fetch(`${configuration.sandboxManagerApiUrl}/launchScenario/${scenario.id}`, Object.assign({ method: "PUT" }, config))
            .then(result => {
                result.json()
                    .then(r => {
                        console.log(r);
                    });
            })
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                dispatch(setScenarioCreating(false));
            });
    }
}

export const inviteNewUser = (email) => {
    return (dispatch, getState) => {
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitedBy: {
                    sbmUserId: state.users.oauthUser.sbmUserId
                },
                invitee: {
                    email
                },
                sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId)
            })
        };
        fetch(configuration.sandboxManagerApiUrl + '/sandboxinvite', Object.assign({ method: "PUT" }, config))
            .then(() => {
                dispatch(fetchSandboxInvites());
            })
            .catch(e => {
                console.log(e);
            });
    };
};

export const removeInvitation = (id) => {
    return (dispatch, getState) => {
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                'Content-Type': 'application/json'
            }
        };
        fetch(configuration.sandboxManagerApiUrl + '/sandboxinvite/' + id + '?status=REVOKED', Object.assign({ method: "PUT" }, config))
            .then(() => {
                dispatch(fetchSandboxInvites());
            })
            .catch(e => {
                console.log(e);
            });
    };
};

export function getDefaultUserForSandbox (sandboxId) {
    return (dispatch, getState) => {
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token
            },
            contentType: "application/json",
        };

        fetch(`${configuration.sandboxManagerApiUrl}/userPersona/default?sandboxId=${sandboxId}`, config)
            .then(userResponse => {
                console.log(userResponse);
                userResponse.json()
                    .then(user => {
                        dispatch(setDefaultSandboxUser(user));
                    })
            })
            .catch(e => console.log(e));
    }
}

export function authorizeSandbox (sandbox) {
    return (dispatch, getState) => {
        if (sandbox !== undefined) {
            dispatch(saveSandboxApiEndpointIndex(sandbox.apiEndpointIndex));
            const state = getState();

            // state['sandbox']['sandboxApiEndpointIndex'] = sandbox.apiEndpointIndex;
            authorize(window.location, state, sandbox.sandboxId);
        }
    }
}

export const createSandbox = (sandboxDetails) => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(setCreatingSandbox(true));
        let config = getConfig(state);

        config.body = JSON.stringify(sandboxDetails);
        config.method = "POST";
        config.headers["Content-Type"] = "application/json";
        fetch(configuration.sandboxManagerApiUrl + '/sandbox', config)
            .then(() => {
                dispatch(fetchSandboxes(sandboxDetails.sandboxId));
            })
            .catch(err => {
                dispatch(createSandboxFail(err));
            })
            .then(() => {
                dispatch(setCreatingSandbox(false));
            });
    };
};

export const fetchSandboxes = (toSelect) => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(fetchSandboxesStart());
        let configuration = state.config.xsettings.data.sandboxManager;
        const queryParams = '?userId=' + state.users.oauthUser.sbmUserId + '&_sort:asc=name';

        fetch(configuration.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
            .then(res => {
                res && res.json()
                    .then(data => {
                        const sandboxes = [];
                        for (let key in data) {
                            sandboxes.push({
                                ...data[key], id: key
                            });
                        }
                        dispatch(fetchSandboxesSuccess(sandboxes));
                        dispatch(selectSandbox(sandboxes.find(i => i.sandboxId === toSelect)));
                    })
            })
            .catch(err => {
                console.log(err);
                dispatch(fetchSandboxesFail(err));
            });
    };
};

export const fetchSandboxInvites = () => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(fetchSandboxInvitesStart());

        const queryParams = '?sandboxId=' + sessionStorage.sandboxId + '&status=PENDING';

        fetch(configuration.sandboxManagerApiUrl + '/sandboxinvite' + queryParams, getConfig())
            .then(result => {
                result.json()
                    .then(res => {
                        const invitations = [];
                        for (let key in res) {
                            invitations.push({
                                ...res[key]
                            });
                        }
                        dispatch(fetchSandboxInvitesSuccess(invitations));
                    });
            })
            .catch(err => {
                dispatch(fetchSandboxInvitesFail(err));
            })
    };
};

export function loadLaunchScenarios () {
    return (dispatch, getState) => {
        dispatch(setLaunchScenariosLoading(true));
        let state = getState();
        if (state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl) {
            let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + '/launchScenario?sandboxId=' + sessionStorage.sandboxId;
            const config = {
                headers: {
                    Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            };
            fetch(url, config)
                .then(result => {
                    result.json()
                        .then(scenarios => {
                            dispatch(setLaunchScenarios([{"id":21,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"Bilirubin in High Risk","launchEmbedded":true,"patient":{"id":17,"name":"Amy V. Shaw","fhirId":"SMART-1032702","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":1121,"createdBy":null,"createdTimestamp":null,"visibility":null,"sandbox":{"id":785,"createdBy":{"id":622,"createdTimestamp":1500494575000,"email":"mike@interopion.com","sbmUserId":"fw1pr8Wy1OSa1XjiTWKLK7PfiSN2","name":"Mike Bylund","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":1516306390000,"visibility":"PRIVATE","sandboxId":"mikev5stu3","name":"STU3 w/ v5 schema","description":"","apiEndpointIndex":"6","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://bilirubin-risk-chart.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://content.hspconsortium.org/images/bilirubin/logo/bilirubin.png","authClient":{"id":1121,"clientName":"Bilirubin Chart","clientId":"bilirubin_chart","logoUri":null,"authDatabaseId":null},"samplePatients":null,"clientJSON":null,"info":null,"briefDescription":"The HSPC Bilirubin Risk Chart is a sample app that demonstrates many of the features of the SMART on FHIR app launch specification and HL7 FHIR standard.","author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"Pediatric Growth Chart","launchEmbedded":false,"patient":{"id":19,"name":"Susan A. Clark","fhirId":"SMART-1482713","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":24,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://growth-chart-app.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://sandbox-api.hspconsortium.org/app/24/image","authClient":{"id":24,"clientName":"Growth Chart","clientId":"my_web_app","logoUri":"https://sandbox-api.hspconsortium.org/app/24/image","authDatabaseId":95},"samplePatients":"Patient?_id=SMART-1482713","clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":24,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"BP Centiles","launchEmbedded":false,"patient":{"id":20,"name":"Allen Vitalis","fhirId":"SMART-99912345","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":25,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://bp-centiles-app.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://sandbox-api.hspconsortium.org/app/25/image","authClient":{"id":25,"clientName":"BP Centiles","clientId":"c9b3f865-163f-4c6c-8d2e-babf63b540d8","logoUri":"https://sandbox-api.hspconsortium.org/app/25/image","authDatabaseId":96},"samplePatients":"Patient?_id=SMART-99912345","clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":25,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"Cardiac Risk","launchEmbedded":false,"patient":{"id":21,"name":"Sharon P. Green","fhirId":"SMART-2113340","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":26,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://cardiac-risk-app.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://sandbox-api.hspconsortium.org/app/26/image","authClient":{"id":26,"clientName":"Cardiac Risk","clientId":"427d3e81-ca10-45ed-9567-7ce0156e9355","logoUri":"https://sandbox-api.hspconsortium.org/app/26/image","authDatabaseId":97},"samplePatients":"Patient?_id=SMART-2113340","clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":26,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"All Buford Cottrill's Appointments","launchEmbedded":false,"patient":{"id":22,"name":"Buford Cottrill","fhirId":"COREPATIENT1","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":8,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Buford@hspcdemo","personaName":"Buford Cottrill","password":"password","fhirId":"COREPATIENT1","fhirName":"Buford Cottrill","resource":"Patient","resourceUrl":"Patient/COREPATIENT1"},"app":{"id":27,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://appointments.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://sandbox-api.hspconsortium.org/app/27/image","authClient":{"id":27,"clientName":"HSPC Appointments","clientId":"e2d1017a-050f-4ae6-9e30-4f2b254067a5","logoUri":"https://sandbox.hspconsortium.org/REST/app/27/image","authDatabaseId":98},"samplePatients":null,"clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":27,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"All Dr. Giles Appointments","launchEmbedded":false,"patient":{"id":23,"name":"None","fhirId":"0","resource":"None","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":27,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://appointments.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://sandbox-api.hspconsortium.org/app/27/image","authClient":{"id":27,"clientName":"HSPC Appointments","clientId":"e2d1017a-050f-4ae6-9e30-4f2b254067a5","logoUri":"https://sandbox.hspconsortium.org/REST/app/27/image","authDatabaseId":98},"samplePatients":null,"clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":89,"createdBy":{"id":5,"createdTimestamp":null,"email":"travis@interopion.com","sbmUserId":"6c1daa0a-36d9-4840-3d5a-a5c9beb344ee","name":"Travis Cummings","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"Test Bili","launchEmbedded":true,"patient":{"id":16,"name":"Baby Bili","fhirId":"BILIBABY","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":1121,"createdBy":null,"createdTimestamp":null,"visibility":null,"sandbox":{"id":785,"createdBy":{"id":622,"createdTimestamp":1500494575000,"email":"mike@interopion.com","sbmUserId":"fw1pr8Wy1OSa1XjiTWKLK7PfiSN2","name":"Mike Bylund","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":1516306390000,"visibility":"PRIVATE","sandboxId":"mikev5stu3","name":"STU3 w/ v5 schema","description":"","apiEndpointIndex":"6","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"https://bilirubin-risk-chart.hspconsortium.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://content.hspconsortium.org/images/bilirubin/logo/bilirubin.png","authClient":{"id":1121,"clientName":"Bilirubin Chart","clientId":"bilirubin_chart","logoUri":null,"authDatabaseId":null},"samplePatients":null,"clientJSON":null,"info":null,"briefDescription":"The HSPC Bilirubin Risk Chart is a sample app that demonstrates many of the features of the SMART on FHIR app launch specification and HL7 FHIR standard.","author":null},"contextParams":[{"id":64,"name":"myparam1","value":"test123"},{"id":65,"name":"myparam2","value":"abcd"}],"lastLaunchSeconds":1520426473000},{"id":318,"createdBy":{"id":5,"createdTimestamp":null,"email":"travis@interopion.com","sbmUserId":"6c1daa0a-36d9-4840-3d5a-a5c9beb344ee","name":"Travis Cummings","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":1486494867000,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"Testing custom app","launchEmbedded":false,"patient":{"id":178,"name":"Daniel X. Adams","fhirId":"SMART-1288992","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":257,"createdBy":null,"createdTimestamp":null,"visibility":null,"sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"http://10.249.194.137:8080/quick-start-java-spring-mvc-for-provider/launch/launch","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":null,"authClient":{"id":257,"clientName":"Custom App","clientId":"test_client","logoUri":null,"authDatabaseId":null},"samplePatients":null,"clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0},{"id":699,"createdBy":{"id":5,"createdTimestamp":null,"email":"travis@interopion.com","sbmUserId":"6c1daa0a-36d9-4840-3d5a-a5c9beb344ee","name":"Travis Cummings","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":1505493428000,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"description":"CDS Hooks","launchEmbedded":false,"patient":{"id":16,"name":"Baby Bili","fhirId":"BILIBABY","resource":"Patient","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null}},"userPersona":{"id":7,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PUBLIC","sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"personaUserId":"Kurtis@hspcdemo","personaName":"Kurtis Giles, MD","password":"password","fhirId":"COREPRACTITIONER1","fhirName":"Kurtis Giles, MD","resource":"Practitioner","resourceUrl":"Practitioner/COREPRACTITIONER1"},"app":{"id":793,"createdBy":null,"createdTimestamp":null,"visibility":null,"sandbox":{"id":23,"createdBy":{"id":17,"createdTimestamp":null,"email":"hspc demo","sbmUserId":"hspc demo","name":"HSPC Demo","hasAcceptedLatestTermsOfUse":null},"createdTimestamp":null,"visibility":"PRIVATE","sandboxId":"hspcdemo","name":"HSPC Demo Sandbox","description":"HSPC Demo Sandbox","apiEndpointIndex":"1","fhirServerEndPoint":null,"allowOpenAccess":true,"expirationMessage":null,"expirationDate":null},"launchUri":"http://sandbox.cds-hooks.org/launch.html","appManifestUri":null,"softwareId":null,"fhirVersions":null,"logoUri":"https://content.hspconsortium.org/images/cds-hooks-sandbox/logo/CdsHooks.png","authClient":{"id":793,"clientName":"CDS Hooks Sandbox","clientId":"48163c5e-88b5-4cb3-92d3-23b800caa927","logoUri":null,"authDatabaseId":null},"samplePatients":null,"clientJSON":null,"info":null,"briefDescription":null,"author":null},"contextParams":[],"lastLaunchSeconds":0}]));
                        })
                })
                .catch(e => console.log(e))
                .then(() => dispatch(setLaunchScenariosLoading(false)));
        }
    }
}

export function loadInvites () {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setInvitesLoading(true));
        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandboxinvite?sbmUserId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}&status=${status}`;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };
        fetch(url, config)
            .then(result => {
                result.json()
                    .then(invitations => {
                        setInvitesLoading(false);
                        dispatch(setInvites(invitations));
                    })
            })
            .catch(e => console.log(e))
            .then(() => dispatch(setInvitesLoading(false)));
    }
}

export function doLaunch (app, persona = {}, user) {
    return (dispatch, getState) => {
        let state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        user = user ? user : state.sandbox.defaultUser;

        let key = random(32);
        window.localStorage[key] = "requested-launch";

        let params = {};
        if (persona.fhirId || persona.id) {
            params = { patient: persona.fhirId || persona.id };
        }

        params["need_patient_banner"] = false;
        let appWindow = window.open('/launchApp?' + key, '_blank');
        let config = getConfig(state);
        config.body = JSON.stringify({ username: user.personaUserId, password: user.password });
        config.method = "POST";
        config.headers["Content-Type"] = "application/json";
        let launchDetails = {
            userPersona: Object.assign({}, user),
            patientContext: persona.id
        };

        try {
            registerAppContext(app, params, launchDetails, key);
            fetch(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", config)
                .then(function (response) {
                    response.json()
                        .then(data => {
                            const url = window.location.host.split(":")[0].split(".").slice(-2).join(".");
                            const date = new Date();
                            date.setTime(date.getTime() + (3 * 60 * 1000));
                            let cookie = `hspc-persona-token=${data.jwt}; expires=${date.toString()}; domain=${url}; path=/`;
                            document.cookie = cookie;
                        });
                });
        } catch (e) {
            console.log(e);
            appWindow.close();
        }
    }
}

const getConfig = (_state) => {
    return {
        headers: {
            Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    };
};

const setDefaultUrl = (sandboxId) => {
    return {
        type: actionTypes.SET_FHIR_SERVER_URL,
        sandboxId: sandboxId
    }
};

function random (length) {
    let result = '';
    for (let i = length; i > 0; --i) {
        result += CHARS[Math.round(Math.random() * (CHARS.length - 1))];
    }
    return result;
}

function registerAppContext (app, params, launchDetails, key) {
    let appToLaunch = Object.assign({}, app);
    delete appToLaunch.clientJSON;
    delete appToLaunch.createdBy;
    delete appToLaunch.sandbox;
    callRegisterContext(appToLaunch, params, window.fhirClient.server.serviceUrl, launchDetails, key);
}

function callRegisterContext (appToLaunch, params, issuer, launchDetails, key) {
    let config = {
        method: 'POST',
        headers: {
            Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: appToLaunch.authClient.clientId,
            parameters: params
        })
    };

    fetch(issuer + '/_services/smart/Launch', config)
        .then(response => {
            response.json()
                .then(context =>
                    window.localStorage[key] = JSON.stringify({
                        app: appToLaunch,
                        iss: issuer,
                        launchDetails: launchDetails,
                        context
                    }))
        })
}
