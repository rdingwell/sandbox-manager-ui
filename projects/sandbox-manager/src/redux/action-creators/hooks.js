import API from '../../lib/api';
import * as types from './types';
import { random } from './sandbox';

const CONTEXT = {
    'patient-view': {
        userId: {
            required: true,
            get: getUserId
        },
        patientId: {
            required: true
        },
        encounterId: {}
    },
    'medication-prescribe': {
        userId: {
            required: true,
            get: getUserId
        },
        patientId: {
            required: true
        },
        medications: {
            required: true
        },
        encounterId: {}
    }
};

export const hookExecuting = executing => {
    return {
        type: types.HOOKS_EXECUTING,
        payload: { executing }
    }
};

export const launchHook = (hook, launchContext) => {
    return (dispatch, getState) => {
        dispatch(hookExecuting(true));

        let state = getState();
        let context = buildContext(hook.hook, launchContext, state);

        // Authorize the hook
        let userData = { username: state.sandbox.defaultUser.personaUserId, password: state.sandbox.defaultUser.password };
        let configuration = state.config.xsettings.data.sandboxManager;

        try {
            API.post(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", userData, dispatch)
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
                                API.post(`${hook.url}/${hook.id}`, data);
                            })
                    } else {
                        API.post(`${hook.url}/${hook.id}`, data);
                    }
                });
        } catch (e) {
            console.log(e);
        }
    }
};

function buildContext (hook, launchContext, state) {
    let params = CONTEXT[hook];
    let context = {};
    if (params) {
        Object.keys(params).map(key => {
            let val = params[key].get ? params[key].get(state) : launchContext[key];
            val && val.length > 0 && (context[key] = val);
        });
    }

    return context;
}

function getUserId (state) {
    return state.sandbox.defaultUser.resourceUrl;
}
