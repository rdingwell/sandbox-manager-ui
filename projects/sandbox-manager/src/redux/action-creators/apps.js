import * as types from "./types";
import API from '../../lib/api';

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

        if (app.tokenEndpointAuthMethod !== "NONE") {
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

        API.post(url, newApp, dispatch)
            .then(createdApp => {
                if (app.logoFile) {
                    let formData = new FormData();
                    formData.append("file", app.logoFile);
                    url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + createdApp.id + "/image";
                    API.postImage(url, formData)
                        .then(() => setTimeout(() => {
                            dispatch(setCreatedApp(createdApp));
                            dispatch(loadSandboxApps());
                        }, 550));
                } else {
                    dispatch(setCreatedApp(createdApp));
                    dispatch(loadSandboxApps());
                    dispatch(appCreating(false));
                }
            })
            .catch(() => setTimeout(() => dispatch(appCreating(false)), 550));
    }
}

export function updateApp (newValues, originalApp, changes) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(appCreating(true));
        dispatch(setCreatedApp());

        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/app/${originalApp.id}`;
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
                API.postImage(url, formData, { Authorization: 'BEARER ' + window.fhirClient.server.auth.token }, dispatch).then(() => setTimeout(() => dispatch(loadSandboxApps()), 550));
            } else if (!newValues.logoFile) {
                url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + originalApp.id + "/image";
                API.delete(url, dispatch).then(() => dispatch(loadSandboxApps()));
            } else {
                dispatch(loadSandboxApps());
            }
        };

        if (changes.length && !(changes.length === 1 && changes[0] === 'image')) {
            API.put(url, newApp, dispatch)
                .then(() => {
                    if (changes.indexOf('image') >= 0) {
                        updateImage();
                    } else {
                        dispatch(loadSandboxApps());
                    }
                })
                .catch(() => {
                    dispatch(loadSandboxApps());
                });
        } else if (changes.indexOf('image') >= 0) {
            updateImage();
        } else {
            setTimeout(() => dispatch(loadSandboxApps()), 2500);
        }
    }
}

export function deleteApp (app) {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(appDeleting(true));

        let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app/" + app.id;
        API.delete(url, dispatch).finally(() => dispatch(loadSandboxApps()));
    }
}

export function loadApp (app) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            dispatch(setSandboxAppLoading(true));

            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/app/${app.id}`;
            API.get(url, dispatch).then(app => dispatch(setApp(app))).finally(() => dispatch(setSandboxAppLoading(false)));
        }
    }
}

export function loadSandboxApps () {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            dispatch(setSandboxAppsLoading(true));

            let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/app?sandboxId=" + sessionStorage.sandboxId;
            API.get(url, dispatch)
                .then(apps => dispatch(setSandboxApps(apps)))
                .finally(() => {
                    dispatch(setSandboxAppsLoading(false));
                    dispatch(appDeleting(false));
                    dispatch(appCreating(false));
                });
        }
    }
}
