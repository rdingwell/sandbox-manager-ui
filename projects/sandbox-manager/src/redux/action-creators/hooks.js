import API from '../../lib/api';
import * as types from './types';
import { modifyingCustomContext, random } from './sandbox';
import { setGlobalError } from './app';
import { appCreating, appDeleting, loadSandboxApps, setCreatedApp, setSandboxApps, setSandboxAppsLoading } from './apps';

const POSTFIX_SERVICE = '/cds-services';

const GETTERS = {
    userId: getUserId
};

export const hookExecuting = executing => {
    return {
        type: types.HOOKS_EXECUTING,
        payload: { executing }
    }
};

export const setResultCards = cards => {
    return {
        type: types.HOOKS_SET_CARDS,
        payload: { cards }
    }
};

export function removeResultCard (cardIndex) {
    return {
        type: types.HOOKS_REMOVE_CARD,
        payload: { cardIndex }
    }
}

export function setServices (services) {
    return {
        type: types.HOOKS_SET_SERVICES,
        payload: { services }
    }
}

export function setServicesLoading (loading) {
    return {
        type: types.HOOKS_SERVICE_LOADING,
        payload: { loading }
    }
}

export function createService (url, serviceName) {
    return (dispatch, getState) => {
        // remove trailing slash if present
        url[url.length - 1] === '/' && (url = url.substr(0, url.length - 1));

        // add the final part of the path if not there
        url.indexOf(POSTFIX_SERVICE) === -1 && (url += POSTFIX_SERVICE);

        dispatch(setServicesLoading(true));
        API.getNoAuth(url)
            .then(result => {
                let state = getState();
                let services = state.hooks.services ? state.hooks.services.slice() : [];
                let newService = {
                    title: serviceName || url,
                    url,
                    cdsHooks: [],
                    description: '',
                    sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
                    createdBy: state.users.oauthUser
                };
                if (result && result.services) {
                    result.services.map(service => {
                        let obj = Object.assign({}, service);
                        obj.hookId = obj.id;
                        !obj.title && (obj.title = obj.name ? obj.name : '');
                        delete obj.id;
                        newService.cdsHooks.push(obj);
                    });
                }
                let configuration = state.config.xsettings.data.sandboxManager;

                API.post(`${configuration.sandboxManagerApiUrl}/cds-services`, newService, dispatch)
                    .then(() => {
                        dispatch(loadServices());
                    });
                services.push(newService);
            })
            .catch(_ => {
                dispatch(setServicesLoading(false));
            });
    }
}

export function updateHook (hookId, newImage) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(appCreating(true));
        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/cds-services/${hookId}/image?file=sample.jpg`;

        if (newImage) {
            let formData = new FormData();
            formData.append("file", newImage);
            API.post(url, formData, dispatch, true)
                .finally(() => {
                    setTimeout(() => {
                        dispatch(loadServices());
                        dispatch(appCreating(false));
                    }, 550);
                });
        } else if (!newImage) {
            API.delete(url, dispatch).finally(() => {
                dispatch(loadServices());
                dispatch(appCreating(false));
            });
        }
    };
}

export function loadServices () {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            dispatch(setServicesLoading(true));

            let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/cds-services?sandboxId=" + sessionStorage.sandboxId;
            API.get(url, dispatch)
            // .then(services => dispatch(setServices(services)))
                .then(services => {
                    services[0].cdsHooks = [{
                        "id": 5,
                        "logoUri": null,
                        "hook": "patient-view",
                        "title": "Demo Suggestion Card",
                        "description": "Sends a Demo Suggestion Card",
                        "hookId": "demo-suggestion-card",
                        "prefetch": null,
                        "cdsServiceEndpointId": 2
                    },
                        {
                            "id": 6,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Bilirubin CDS Hooks ExecutableService",
                            "description": "Detects issues with infants and the Kernicterus risk protocol",
                            "hookId": "bilirubin-cds-hook",
                            "prefetch": {
                                "patient": "Patient/{{Patient.id}}",
                                "observations": "Observation?patient={{Patient.id}}&code=http://loinc.org|58941-6&_sort:desc=date&count=1"
                            },
                            "cdsServiceEndpointId": 2
                        },
                        {
                            "id": 7,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Demo Application Link Card",
                            "description": "Sends a Demo Application Link Card",
                            "hookId": "demo-app-link-card",
                            "prefetch": null,
                            "cdsServiceEndpointId": 2
                        },
                        {
                            "id": 8,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Demo Info Card",
                            "description": "Sends a Demo Info Card",
                            "hookId": "demo-info-card",
                            "prefetch": null,
                            "cdsServiceEndpointId": 2
                        }];
                    services[1].cdsHooks = [
                        {
                            "id": 13,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Demo Suggestion Card",
                            "description": "Sends a Demo Suggestion Card",
                            "hookId": "demo-suggestion-card",
                            "prefetch": null,
                            "cdsServiceEndpointId": 4
                        },
                        {
                            "id": 14,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Bilirubin CDS Hooks ExecutableService",
                            "description": "Detects issues with infants and the Kernicterus risk protocol",
                            "hookId": "bilirubin-cds-hook",
                            "prefetch": {
                                "patient": "Patient/{{Patient.id}}",
                                "observations": "Observation?patient={{Patient.id}}&code=http://loinc.org|58941-6&_sort:desc=date&count=1"
                            },
                            "cdsServiceEndpointId": 4
                        },
                        {
                            "id": 15,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Demo Application Link Card",
                            "description": "Sends a Demo Application Link Card",
                            "hookId": "demo-app-link-card",
                            "prefetch": null,
                            "cdsServiceEndpointId": 4
                        },
                        {
                            "id": 16,
                            "logoUri": null,
                            "hook": "patient-view",
                            "title": "Demo Info Card",
                            "description": "Sends a Demo Info Card",
                            "hookId": "demo-info-card",
                            "prefetch": null,
                            "cdsServiceEndpointId": 4
                        }
                    ]
                    dispatch(setServices(services));
                })
                .finally(() => {
                    dispatch(setServicesLoading(false));
                });
        }
    }
}

export const launchHook = (hook, launchContext) => {
    return (dispatch, getState) => {
        dispatch(hookExecuting(true));

        let state = getState();
        let context = buildContext(hook.hook, launchContext, state, dispatch);

        // Authorize the hook
        let userData = { username: state.sandbox.defaultUser.personaUserId, password: state.sandbox.defaultUser.password };
        let configuration = state.config.xsettings.data.sandboxManager;

        context && API.post(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", userData, dispatch)
            .then(authData => {
                let data = {
                    hookInstance: random(64),
                    hook: hook.hook,
                    fhirServer: window.fhirClient.server.serviceUrl,
                    user: state.sandbox.defaultUser.resourceUrl,
                    patient: `Patient/${context.patientId}`,
                    context,
                    fhirAuthorization: {
                        access_token: authData.token,
                        token_type: "Bearer",
                        scope: "patient/*.* user/*.* launch openid profile online_access",
                        subject: hook.hook
                    },
                    prefetch: {}
                };

                // Prefetch any data that the hook might need
                if (hook.prefetch) {
                    let promises = [];
                    Object.keys(hook.prefetch).map(key => {
                        let url = hook.prefetch[key];
                        let regex = new RegExp(/\{\{context\.(.*?)\}\}/gi);
                        url = url.replace(regex, (a, b) => context[b]);
                        promises.push(new Promise((resolve, reject) => {
                            API.get(`${window.fhirClient.server.serviceUrl}/${url}`, dispatch)
                                .then(result => {
                                    data.prefetch[key] = result;
                                    resolve();
                                })
                                .catch(e => {
                                    reject();
                                })
                        }));
                    });
                    Promise.all(promises)
                        .then(() => {

                            // Trigger the hook
                            API.post(`${hook.url}/${hook.id}`, data)
                                .then(cards => {
                                    cards && cards.cards && dispatch(setResultCards(cards.cards));
                                });
                        })
                } else {
                    // Trigger the hook
                    API.post(`${hook.url}/${hook.id}`, data)
                        .then(cards => {
                            cards && cards.cards && dispatch(setResultCards(cards.cards));
                        });
                }
            });
    }
};

function buildContext (hook, launchContext, state, dispatch) {
    let params = state.hooks.hookContexts[hook];
    let context = {};
    let hasMissingContext = false;
    if (params) {
        Object.keys(params).map(key => {
            let required = params[key].required;
            let val = launchContext[key] ? launchContext[key] : GETTERS[key] ? GETTERS[key](state) : undefined;
            if ((!val || val.length === 0) && required) {
                dispatch(setGlobalError(`Hook can not be launched! Missing required context "${key}".`));
                hasMissingContext = true;
            } else if (val && val.length > 0) {
                context[key] = val;
            }
        });
    }

    return !hasMissingContext ? context : undefined;
}

function getUserId (state) {
    return state.sandbox.defaultUser.resourceUrl;
}
