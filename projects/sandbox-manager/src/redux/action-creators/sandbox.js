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
        dispatch(setUpdatingUser(true));
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

                    dispatch(setUpdatingUser(false));
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
                            dispatch(setInvites(invitations));
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

        const cookieURl = window.location.host.split(":")[0].split(".").slice(-2).join(".");
        document.cookie = `${configuration.personaCookieName}=''; expires=${new Date(Date.UTC(0))}; domain=${cookieURl}; path=/`;

        try {
            fetch(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", config)
                .then(function (response) {
                    response.json()
                        .then(data => {
                            const date = new Date();
                            date.setTime(date.getTime() + (3 * 60 * 1000));
                            document.cookie = `${configuration.personaCookieName}=${data.jwt}; expires=${date.getTime()}; domain=${cookieURl}; path=/`;
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
