import * as types from "./types";

export function setSandboxApps (apps) {
    return { type: types.SET_SANDBOX_APPS, payload: { apps } }
}

export function setSandboxAppsLoading (loading) {
    return { type: types.SET_SANDBOX_APPS_LOADING, payload: { loading } }
}

export function setSandboxAppLoading (loading) {
    return { type: types.SET_SANDBOX_APP_LOADING, payload: { loading } }
}

export function appCreating (creating) {
    return { type: types.SET_SANDBOX_APPS_CREATING, payload: { creating } }
}

export function appDeleting (deleting) {
    return { type: types.SET_SANDBOX_APPS_DELETING, payload: { deleting } }
}

export function setApp (app) {
    return { type: types.SET_APP, payload: { app } }
}

export function createApp (app) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(appCreating(true));

        let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app";
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };

        let newApp = {
            launchUri: app.launchUri,
            logo: app.logoUri, // TODO add file here
            redirectUris: app.redirectUris.split(','),
            authClient: {
                clientName: app.clientName
            },
            createdBy: state.users.oauthUser,
            sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === state.sandbox.selectedSandbox),
            briefDescription: app.briefDescription,
            clientJSON: JSON.stringify({
                clientName: app.clientName,
                launchUri: app.launchUri,
                redirectUris: app.redirectUris.split(','),
                grantTypes: ["authorization_code", "refresh_token"],
                tokenEndpointAuthMethod: app.tokenEndpointAuthMethod,
                scope: app.patientScoped ? ["launch", "patient/*.*", "profile", "openid", "offline_access"] : ["launch", "user/*.*", "profile", "openid"],
                requireAuthTime: false,
                accessTokenValiditySeconds: 3600,
                idTokenValiditySeconds: 3600,
                refreshTokenValiditySeconds: 31557600
            })
        };

        fetch(url, Object.assign({ method: "POST", body: JSON.stringify(newApp) }, config))
            .then(e => {
                e.json().then(a => console.log(a));
            })
            .catch(e => console.log(e))
            .then(() => {
                dispatch(appCreating(false));
            })
    }
}

export function updateApp (newValues, originalApp) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(appCreating(true));

        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/app/${originalApp.id}`;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };

        let newApp = Object.assign({}, originalApp, {
            launchUri: newValues.launchUri,
            briefDescription: newValues.briefDescription,
            samplePatients: newValues.samplePatients,
            clientJSON: JSON.stringify(Object.assign({}, JSON.parse(originalApp.clientJSON), {
                clientName: newValues.clientName,
                launchUri: newValues.launchUri,
                redirectUris: newValues.redirectUris.split(','),
                tokenEndpointAuthMethod: newValues.tokenEndpointAuthMethod,
                scope: newValues.scope.split(' ')
            }))
        });

        fetch(url, Object.assign({ method: "PUT", body: JSON.stringify(newApp) }, config))
            .then(e => {
                e.json().then(a => console.log(a));
            })
            .catch(e => console.log(e))
            .then(() => {
                dispatch(appCreating(false));
            })
    }
}

export function deleteApp (app) {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(appDeleting(true));

        let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + app.id;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };

        fetch(url, Object.assign({ method: "DELETE" }, config))
            .catch(e => console.log(e))
            .then(() => dispatch(appDeleting(false)))
    }
}

export function loadApp (app) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            dispatch(setSandboxAppLoading(true));

            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/app/${app.id}`;
            fetch(url, {
                headers: {
                    Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    response.json()
                        .then(app => {
                            dispatch(setApp(app));
                        })
                        .then(() => {
                            dispatch(setSandboxAppLoading(false));
                        });
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }
}

export function loadSandboxApps () {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            dispatch(setSandboxAppsLoading(true));

            let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app?sandboxId=" + state.sandbox.selectedSandbox;
            fetch(url, {
                headers: {
                    Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    response.json()
                        .then(apps => {
                            dispatch(setSandboxApps(apps));
                        })
                })
                .catch(e => {
                    console.log(e);
                })
                .then(() => {
                    dispatch(setSandboxAppsLoading(false));
                })
        }
    }
}
