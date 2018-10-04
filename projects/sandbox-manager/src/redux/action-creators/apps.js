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

export function setCreatedApp (app) {
    return { type: types.SET_CREATED_APP, payload: { app } }
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
        let scope = app.scope.length > 2
            ? app.scope.split(' ')
            : app.patientScoped
                ? ["launch", "patient/*.*", "profile", "openid"]
                : ["launch", "user/*.*", "profile", "openid"];
        let clientJSON = {
            scope,
            clientName: app.clientName,
            launchUri: app.launchUri,
            redirectUris: app.redirectUris.split(','),
            grantTypes: ["authorization_code"],
            tokenEndpointAuthMethod: app.tokenEndpointAuthMethod,
            accessTokenValiditySeconds: 3600,
            idTokenValiditySeconds: 3600,
            refreshTokenValiditySeconds: 31557600
        };
        if (app.offlineAccess) {
            clientJSON.scope.push("offline_access");
            clientJSON.grantTypes.push("refresh_token");
            clientJSON.requireAuthTime = false;
        }

        if (app.tokenEndpointAuthMethod !== "Public Client") {
            clientJSON.tokenEndpointAuthMethod = "SECRET_BASIC";
            clientJSON.clientType = "Confidential Client";
        } else {
            clientJSON.tokenEndpointAuthMethod = "NONE";
            clientJSON.clientType = "Public Client";
        }

        let newApp = {
            launchUri: app.launchUri,
            redirectUris: app.redirectUris.split(','),
            clientName: app.clientName,
            createdBy: state.users.oauthUser,
            sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
            briefDescription: app.briefDescription,
            samplePatients: app.samplePatients,
            clientJSON: JSON.stringify(clientJSON)
        };

        fetch(url, Object.assign({ method: "POST", body: JSON.stringify(newApp) }, config))
            .then(e => {
                e.json()
                    .then(createdApp => {
                        if (app.logoFile) {
                            let formData = new FormData();
                            formData.append("file", app.logoFile);
                            url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + createdApp.id + "/image";
                            fetch(url, { method: 'POST', body: formData, headers: { Authorization: 'BEARER ' + window.fhirClient.server.auth.token } })
                                .then(() => {
                                    setTimeout(() => {
                                        dispatch(setCreatedApp(createdApp));
                                        dispatch(loadSandboxApps());
                                    }, 550);
                                });
                        } else {
                            dispatch(setCreatedApp(createdApp));
                            dispatch(loadSandboxApps());
                            dispatch(appCreating(false));
                        }
                    });
            })
            .catch(e => {
                console.log(e);
                setTimeout(() => dispatch(appCreating(false)), 550);
            });
    }
}

export function updateApp (newValues, originalApp, changes) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(appCreating(true));
        dispatch(setCreatedApp());

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
            logoUri: newValues.clientJSON.logoUri ? newValues.clientJSON.logoUri : null,
            clientJSON: JSON.stringify(Object.assign({}, newValues.clientJSON, {
                clientName: newValues.clientName,
                launchUri: newValues.launchUri,
                redirectUris: newValues.redirectUris.split(','),
                tokenEndpointAuthMethod: newValues.tokenEndpointAuthMethod,
                scope: newValues.scope.split(' ')
            }))
        });


        let updateImage = () => {
            if (newValues.logoFile) {
                let formData = new FormData();
                formData.append("file", newValues.logoFile);
                url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + originalApp.id + "/image";
                fetch(url, { method: 'POST', body: formData, headers: { Authorization: 'BEARER ' + window.fhirClient.server.auth.token } })
                    .then(() => {
                        setTimeout(() => {
                            dispatch(loadSandboxApps());
                        }, 550);
                    });
            } else if (!newValues.logoFile) {
                url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + originalApp.id + "/image";
                fetch(url, { method: 'DELETE', headers: { Authorization: 'BEARER ' + window.fhirClient.server.auth.token } })
                    .then(() => {
                        dispatch(loadSandboxApps());
                    });
            } else {
                dispatch(loadSandboxApps());
            }
        };

        if (changes.length && !(changes.length === 1 && changes[0] === 'image')) {
            fetch(url, Object.assign({ method: "PUT", body: JSON.stringify(newApp) }, config))
                .then(() => {
                    if (changes.indexOf('image') >= 0) {
                        updateImage();
                    } else {
                        dispatch(loadSandboxApps());
                    }
                })
                .catch(e => {
                    console.log(e);
                    dispatch(loadSandboxApps());
                });
        } else if (changes.indexOf('image') >= 0) {
            updateImage();
        } else {
            setTimeout(() => {
                dispatch(loadSandboxApps());
            }, 2500);
        }
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
            .then(() => {
                dispatch(loadSandboxApps());
            })
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
                        });
                })
                .catch(e => {
                    console.log(e);
                })
                .then(() => {
                    dispatch(setSandboxAppLoading(false));
                });
        }
    }
}

export function loadSandboxApps () {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            dispatch(setSandboxAppsLoading(true));

            let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app?sandboxId=" + sessionStorage.sandboxId;
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
                            dispatch(setSandboxAppsLoading(false));
                            dispatch(appDeleting(false));
                            dispatch(appCreating(false));
                        })
                })
                .catch(e => {
                    console.log(e);
                    dispatch(setSandboxAppsLoading(false));
                    dispatch(appDeleting(false));
                    dispatch(appCreating(false));
                });
        }
    }
}
