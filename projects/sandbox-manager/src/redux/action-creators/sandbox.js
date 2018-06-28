import * as actionTypes from './types';
import { authorize, goHome, saveSandboxApiEndpointIndex } from './fhirauth';
import { fetchPersonas } from "./persona";

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const selectSandboxById = (sandboxId) => {
    localStorage.setItem('sandboxId', sandboxId);
    sessionStorage['sandboxId'] = sandboxId;
    return { type: actionTypes.SELECT_SANDBOX }
};

export function setUpdatingUser (updating) {
    return {
        type: actionTypes.UPDATING_USER,
        payload: { updating }
    }
}

export function setSandboxSelecting (selecting) {
    return {
        type: actionTypes.SET_SANDBOX_SELECTING,
        payload: { selecting }
    }
}

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

export function setUserInviting (inviting) {
    return {
        type: actionTypes.SET_USER_INVITING,
        payload: { inviting }
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

export const setDeletingCurrentSandbox = (deleting) => {
    return {
        type: actionTypes.SET_DELETING_CURRENT_SANDBOX,
        payload: { deleting }
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
        dispatch(setDeletingCurrentSandbox(true));

        fetch(`${configuration.sandboxManagerApiUrl}/sandbox/${sandboxId}`, config)
            .then(() => {
                history && history.push('/dashboard');
                dispatch(selectSandboxById());
            })
            .catch(e => {
                console.log(e);
            })
            .then(() => dispatch(setDeletingCurrentSandbox(false)));
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
        sandbox && dispatch(setSandboxSelecting(true));
        !sandbox && dispatch(setSandboxSelecting(false));
        let state = getState();

        let queryParams = "?userId=" + encodeURIComponent(state.users.oauthUser.sbmUserId);

        let configuration = state.config.xsettings.data.sandboxManager;

        const domain = window.location.host.split(":")[0].split(".").slice(-2).join(".");
        document.cookie = `${configuration.personaCookieName}=''; expires=${new Date(Date.UTC(0))}; domain=${domain}; path=/`;

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
                });
        }
    };

};

export function toggleUserAdminRights (userId, toggle) {
    return (dispatch, getState) => {
        dispatch(setUpdatingUser(true));
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
                dispatch(setUpdatingUser(false));
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

        dispatch(setUserInviting(true));
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
                dispatch(setUserInviting(false));
            })
            .catch(e => {
                console.log(e);
                dispatch(setUserInviting(false));
            });
    };
};

export const removeInvitation = (id) => {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setUserInviting(true));
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
                dispatch(setUserInviting(false));
            })
            .catch(e => {
                console.log(e);
                dispatch(setUserInviting(false));
            });
    };
};

export function getDefaultUserForSandbox (sandboxId) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
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
                    userResponse.json()
                        .then(user => {
                            dispatch(setDefaultSandboxUser(user));
                        })
                })
                .catch(e => console.log(e))
                .then(() => dispatch(setSandboxSelecting(false)));
        } else {
            goHome();
        }
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
                            dispatch(setLaunchScenarios(scenarios));
                        })
                })
                .catch(e => console.log(e))
                .then(() => dispatch(setLaunchScenariosLoading(false)));
        }
    }
}

export function removeUser (userId, history) {
    return (dispatch, getState) => {
        dispatch(setInvitesLoading(true));
        let sandboxId = sessionStorage.sandboxId;
        let state = getState();

        if (state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl) {
            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandbox/${sandboxId}?removeUserId=${encodeURIComponent(userId)}`;
            const config = {
                headers: {
                    Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                method: 'PUT'
            };

            fetch(url, config)
                .then(() => {
                    if (userId === state.users.user.sbmUserId) {
                        history && history.push('/dashboard');
                    }

                    dispatch(setInvitesLoading(false));
                    dispatch({ type: actionTypes.REMOVE_SANDBOX_USER, userId: userId });
                })
        }
    }
}

export function updateSandboxInvite (invite, answer) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setInvitesLoading(true));
        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandboxinvite/${invite.id}?status=${answer}`;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: 'PUT'
        };
        fetch(url, config)
            .then(() => {
                dispatch(loadInvites());
                dispatch(fetchSandboxes());
            });
    }
}

export function loadInvites () {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setInvitesLoading(true));
        if (state.config.xsettings.data.sandboxManager) {
            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandboxinvite?sbmUserId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}&status=PENDING`;
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
                            dispatch(setInvites([{
                                "id": 677,
                                "invitee": {
                                    "id": 1332,
                                    "createdTimestamp": 1524554343000,
                                    "email": "mitakis2002@gmail.com",
                                    "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                    "name": "Dimitar" +
                                    " Dimitrov",
                                    "systemRoles": ["USER", "CREATE_SANDBOX"],
                                    "sandboxes": [{
                                        "id": 944,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1521099623000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "UofUSRD",
                                        "name": "UofU_SRD",
                                        "description": "",
                                        "apiEndpointIndex": "5",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 894,
                                        "createdBy": {
                                            "id": 681,
                                            "createdTimestamp": 1501790563000,
                                            "email": "nikolai@interopion.com",
                                            "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                            "name": "Nikolai Schwertner",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1520359397000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "SurgeryReferralDemo",
                                        "name": "Surgery Referral Demo",
                                        "description": "",
                                        "apiEndpointIndex": "5",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }],
                                    "hasAcceptedLatestTermsOfUse": null,
                                    "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                },
                                "invitedBy": {
                                    "id": 686,
                                    "createdTimestamp": 1501790795000,
                                    "email": "dimitar@interopion.com",
                                    "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                    "name": "Dimitar Dimitrov",
                                    "systemRoles": ["USER", "CREATE_SANDBOX"],
                                    "sandboxes": [{
                                        "id": 563,
                                        "createdBy": {
                                            "id": 5,
                                            "createdTimestamp": null,
                                            "email": "travis@interopion.com",
                                            "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                            "name": "Travis Cummings",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1501021360000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "iiodstu2dev",
                                        "name": "InteropIO DSTU2 (Dev)",
                                        "description": "InteropIO DSTU2 Dev sandbox",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 613,
                                        "createdBy": {
                                            "id": 443,
                                            "createdTimestamp": 1493043988000,
                                            "email": "nikolai.schwertner@medapptech.com",
                                            "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                            "name": "Nikolai Schwertner",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1503051065000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "interopion",
                                        "name": "Interopion Demo",
                                        "description": "Interopion Demo Environment",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 661,
                                        "createdBy": {
                                            "id": 446,
                                            "createdTimestamp": 1493044028000,
                                            "email": "rusin@interopion.com",
                                            "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                            "name": "Rusin Tsonev",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1506959073000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "wakeforest",
                                        "name": "Wake Forest CompassCP DEV",
                                        "description": "Sandbox for the Wake forest CompassCP project",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 665,
                                        "createdBy": {
                                            "id": 446,
                                            "createdTimestamp": 1493044028000,
                                            "email": "rusin@interopion.com",
                                            "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                            "name": "Rusin Tsonev",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1507099240000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "fhirDS",
                                        "name": "Wakeforest Fhir Data Store",
                                        "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                        "apiEndpointIndex": "4",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 678,
                                        "createdBy": {
                                            "id": 445,
                                            "createdTimestamp": 1493044016000,
                                            "email": "vasil@interopion.com",
                                            "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                            "name": "Vasil Filipov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1507714449000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "maecloud",
                                        "name": "Merck (UAT)",
                                        "description": "",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 670,
                                        "createdBy": {
                                            "id": 445,
                                            "createdTimestamp": 1493044016000,
                                            "email": "vasil@interopion.com",
                                            "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                            "name": "Vasil Filipov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1507561166000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "merckae",
                                        "name": "Merck (DEV)",
                                        "description": "A development sandbox for the Merck Adherence Estimator App",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 3,
                                        "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                        "createdTimestamp": null,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "uofu",
                                        "name": "U of U Sandbox",
                                        "description": "University of Utah Collaboration Sandbox",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 737,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1512132376000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "wfClinDashDev",
                                        "name": "WakeForest CLIN DASH DEV",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 780,
                                        "createdBy": {
                                            "id": 445,
                                            "createdTimestamp": 1493044016000,
                                            "email": "vasil@interopion.com",
                                            "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                            "name": "Vasil Filipov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1516175146000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "psdev",
                                        "name": "Pediatric Suite DEV DSTU2",
                                        "description": "A sandbox for the development of the Pediatric Suite",
                                        "apiEndpointIndex": "5",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 551,
                                        "createdBy": {
                                            "id": 5,
                                            "createdTimestamp": null,
                                            "email": "travis@interopion.com",
                                            "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                            "name": "Travis Cummings",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1500410508000,
                                        "visibility": "PUBLIC",
                                        "sandboxId": "STU301withSynthea",
                                        "name": "HSPC Synthea STU3 (3.0.1)",
                                        "description": "",
                                        "apiEndpointIndex": "4",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 23,
                                        "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                        "createdTimestamp": null,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "hspcdemo",
                                        "name": "HSPC Demo Sandbox",
                                        "description": "HSPC Demo Sandbox",
                                        "apiEndpointIndex": "1",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 894,
                                        "createdBy": {
                                            "id": 681,
                                            "createdTimestamp": 1501790563000,
                                            "email": "nikolai@interopion.com",
                                            "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                            "name": "Nikolai Schwertner",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1520359397000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "SurgeryReferralDemo",
                                        "name": "Surgery Referral Demo",
                                        "description": "",
                                        "apiEndpointIndex": "5",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 945,
                                        "createdBy": {
                                            "id": 442,
                                            "createdTimestamp": 1493043962000,
                                            "email": "georgi@interopion.com",
                                            "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                            "name": "Georgi Georgiev",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1521105994000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "pfcdrdev",
                                        "name": "Pediatric Forms Dev CDR",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 944,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1521099623000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "UofUSRD",
                                        "name": "UofU_SRD",
                                        "description": "",
                                        "apiEndpointIndex": "5",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 1084,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529386171000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "SampleOne",
                                        "name": "SampleOne",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 1085,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529387337000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "SampleTwo",
                                        "name": "SampleTwo",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 1089,
                                        "createdBy": {
                                            "id": 622,
                                            "createdTimestamp": 1500494575000,
                                            "email": "mike@interopion.com",
                                            "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                            "name": "Mike Bylund",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529422030000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "SandboxBeta",
                                        "name": "Sandbox Beta",
                                        "description": "First sandbox created with the new Sandbox UI",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": true,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }, {
                                        "id": 1095,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443216000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "SampleCreate",
                                        "name": "SampleCreate",
                                        "description": "",
                                        "apiEndpointIndex": "7",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                        "expirationDate": "2018-09-01"
                                    }, {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    }],
                                    "hasAcceptedLatestTermsOfUse": null,
                                    "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                },
                                "sandbox": {
                                    "id": 1096,
                                    "createdBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "hasAcceptedLatestTermsOfUse": null
                                    },
                                    "createdTimestamp": 1529443261000,
                                    "visibility": "PRIVATE",
                                    "sandboxId": "ssdasdafasdf",
                                    "name": "ssdasdafasdf",
                                    "description": "",
                                    "apiEndpointIndex": "6",
                                    "fhirServerEndPoint": null,
                                    "apps": "NA",
                                    "allowOpenAccess": false,
                                    "expirationMessage": null,
                                    "expirationDate": null
                                },
                                "status": "PENDING"
                            },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                },
                                {
                                    "id": 677,
                                    "invitee": {
                                        "id": 1332,
                                        "createdTimestamp": 1524554343000,
                                        "email": "mitakis2002@gmail.com",
                                        "sbmUserId": "dWf6fnLedQWPcD403qzbosGSZtA2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 878, "acceptedTimestamp": 1524554445000 }]
                                    },
                                    "invitedBy": {
                                        "id": 686,
                                        "createdTimestamp": 1501790795000,
                                        "email": "dimitar@interopion.com",
                                        "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                        "name": "Dimitar Dimitrov",
                                        "systemRoles": ["USER", "CREATE_SANDBOX"],
                                        "sandboxes": [{
                                            "id": 563,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1501021360000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "iiodstu2dev",
                                            "name": "InteropIO DSTU2 (Dev)",
                                            "description": "InteropIO DSTU2 Dev sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 613,
                                            "createdBy": {
                                                "id": 443,
                                                "createdTimestamp": 1493043988000,
                                                "email": "nikolai.schwertner@medapptech.com",
                                                "sbmUserId": "90c3921d-02c6-08df-09b9-1d6a4e620fdc",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1503051065000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "interopion",
                                            "name": "Interopion Demo",
                                            "description": "Interopion Demo Environment",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 661,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1506959073000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wakeforest",
                                            "name": "Wake Forest CompassCP DEV",
                                            "description": "Sandbox for the Wake forest CompassCP project",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 665,
                                            "createdBy": {
                                                "id": 446,
                                                "createdTimestamp": 1493044028000,
                                                "email": "rusin@interopion.com",
                                                "sbmUserId": "b7b7e348-2373-0657-0cfd-821c72bd60f4",
                                                "name": "Rusin Tsonev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507099240000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "fhirDS",
                                            "name": "Wakeforest Fhir Data Store",
                                            "description": "Temporary FHIR resource data store / API to simulate a HAPI Fhir installation",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 678,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507714449000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "maecloud",
                                            "name": "Merck (UAT)",
                                            "description": "",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 670,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1507561166000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "merckae",
                                            "name": "Merck (DEV)",
                                            "description": "A development sandbox for the Merck Adherence Estimator App",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 3,
                                            "createdBy": { "id": 3, "createdTimestamp": null, "email": "iSalus-UofU", "sbmUserId": "iSalus-UofU", "name": "iSalus-U of U", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "uofu",
                                            "name": "U of U Sandbox",
                                            "description": "University of Utah Collaboration Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 737,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1512132376000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "wfClinDashDev",
                                            "name": "WakeForest CLIN DASH DEV",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 780,
                                            "createdBy": {
                                                "id": 445,
                                                "createdTimestamp": 1493044016000,
                                                "email": "vasil@interopion.com",
                                                "sbmUserId": "ba9e6b69-5c43-7246-33d6-5669c54f2184",
                                                "name": "Vasil Filipov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1516175146000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "psdev",
                                            "name": "Pediatric Suite DEV DSTU2",
                                            "description": "A sandbox for the development of the Pediatric Suite",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 551,
                                            "createdBy": {
                                                "id": 5,
                                                "createdTimestamp": null,
                                                "email": "travis@interopion.com",
                                                "sbmUserId": "6c1daa0a-36d9-4840-3d5a-a5c9beb344ee",
                                                "name": "Travis Cummings",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1500410508000,
                                            "visibility": "PUBLIC",
                                            "sandboxId": "STU301withSynthea",
                                            "name": "HSPC Synthea STU3 (3.0.1)",
                                            "description": "",
                                            "apiEndpointIndex": "4",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 23,
                                            "createdBy": { "id": 17, "createdTimestamp": null, "email": "hspc demo", "sbmUserId": "hspc demo", "name": "HSPC Demo", "hasAcceptedLatestTermsOfUse": null },
                                            "createdTimestamp": null,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "hspcdemo",
                                            "name": "HSPC Demo Sandbox",
                                            "description": "HSPC Demo Sandbox",
                                            "apiEndpointIndex": "1",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 894,
                                            "createdBy": {
                                                "id": 681,
                                                "createdTimestamp": 1501790563000,
                                                "email": "nikolai@interopion.com",
                                                "sbmUserId": "RLXCoGMYIFWHwV8p3I5dvSywi1I3",
                                                "name": "Nikolai Schwertner",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1520359397000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SurgeryReferralDemo",
                                            "name": "Surgery Referral Demo",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 945,
                                            "createdBy": {
                                                "id": 442,
                                                "createdTimestamp": 1493043962000,
                                                "email": "georgi@interopion.com",
                                                "sbmUserId": "90c43935-0824-16c9-5bfe-d3e97bdc1589",
                                                "name": "Georgi Georgiev",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521105994000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "pfcdrdev",
                                            "name": "Pediatric Forms Dev CDR",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 944,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1521099623000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "UofUSRD",
                                            "name": "UofU_SRD",
                                            "description": "",
                                            "apiEndpointIndex": "5",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1084,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529386171000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleOne",
                                            "name": "SampleOne",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1085,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529387337000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleTwo",
                                            "name": "SampleTwo",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1089,
                                            "createdBy": {
                                                "id": 622,
                                                "createdTimestamp": 1500494575000,
                                                "email": "mike@interopion.com",
                                                "sbmUserId": "fw1pr8Wy1OSa1XjiTWKLK7PfiSN2",
                                                "name": "Mike Bylund",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529422030000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SandboxBeta",
                                            "name": "Sandbox Beta",
                                            "description": "First sandbox created with the new Sandbox UI",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": true,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }, {
                                            "id": 1095,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443216000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "SampleCreate",
                                            "name": "SampleCreate",
                                            "description": "",
                                            "apiEndpointIndex": "7",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": "The version of this sandbox (R4) is not final. Therefore, this is a temporary sandbox that will no longer be available after Aug 31, 2018.",
                                            "expirationDate": "2018-09-01"
                                        }, {
                                            "id": 1096,
                                            "createdBy": {
                                                "id": 686,
                                                "createdTimestamp": 1501790795000,
                                                "email": "dimitar@interopion.com",
                                                "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                                "name": "Dimitar Dimitrov",
                                                "hasAcceptedLatestTermsOfUse": null
                                            },
                                            "createdTimestamp": 1529443261000,
                                            "visibility": "PRIVATE",
                                            "sandboxId": "ssdasdafasdf",
                                            "name": "ssdasdafasdf",
                                            "description": "",
                                            "apiEndpointIndex": "6",
                                            "fhirServerEndPoint": null,
                                            "apps": "NA",
                                            "allowOpenAccess": false,
                                            "expirationMessage": null,
                                            "expirationDate": null
                                        }],
                                        "hasAcceptedLatestTermsOfUse": null,
                                        "termsOfUseAcceptances": [{ "id": 496, "acceptedTimestamp": 1510092430000 }]
                                    },
                                    "sandbox": {
                                        "id": 1096,
                                        "createdBy": {
                                            "id": 686,
                                            "createdTimestamp": 1501790795000,
                                            "email": "dimitar@interopion.com",
                                            "sbmUserId": "2y1L87fJRAbiqtQV02XfXlw0gSy2",
                                            "name": "Dimitar Dimitrov",
                                            "hasAcceptedLatestTermsOfUse": null
                                        },
                                        "createdTimestamp": 1529443261000,
                                        "visibility": "PRIVATE",
                                        "sandboxId": "ssdasdafasdf",
                                        "name": "ssdasdafasdf",
                                        "description": "",
                                        "apiEndpointIndex": "6",
                                        "fhirServerEndPoint": null,
                                        "apps": "NA",
                                        "allowOpenAccess": false,
                                        "expirationMessage": null,
                                        "expirationDate": null
                                    },
                                    "status": "PENDING"
                                }]));
                        })
                })
                .catch(e => console.log(e))
                .then(() => dispatch(setInvitesLoading(false)));
        } else {
            goHome();
        }
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
            fetch(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", config)
                .then(function (response) {
                    response.json()
                        .then(data => {
                            const url = window.location.host.split(":")[0].split(".").slice(-2).join(".");
                            const date = new Date();
                            date.setTime(date.getTime() + (3 * 60 * 1000));
                            document.cookie = `hspc-persona-token=${data.jwt}; expires=${date.getTime()}; domain=${url}; path=/`;
                            registerAppContext(app, params, launchDetails, key);
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
