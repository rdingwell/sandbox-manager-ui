import * as actionTypes from "./types";
import { parseNames } from "../../lib/utils/fhir";
import API from '../../lib/api';
import { getDefaultUserForSandbox } from './sandbox';

export function lookupPersonasStart (type) {
    return {
        type: actionTypes.LOOKUP_PERSONAS_START,
        payload: { type }
    }
}

export function creatingPersonaStart () {
    return {
        type: actionTypes.CREATE_PERSONA_START
    }
}

export function creatingPersonaEnd () {
    return {
        type: actionTypes.CREATE_PERSONA_END
    }
}

export function lookupPersonasFail (error) {
    return {
        type: actionTypes.LOOKUP_PERSONAS_FAIL,
        error: error
    }
}

export function setPersonas (type, personas, pagination) {
    return {
        type: actionTypes.LOOKUP_PERSONAS_SUCCESS,
        payload: { type, personas, pagination }
    };
}

export function resetPersonas () {
    return {
        type: actionTypes.RESET_PERSONAS
    }
}

export function deletePersona (persona) {
    return (dispatch, getState) => {
        let state = getState();
        let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/userPersona/" + persona.id;
        API.delete(url, dispatch)
            .then(() => {
                dispatch(fetchPersonas('Persona'));
                getDefaultUserForSandbox(sessionStorage.sandboxId);
            })
            .catch(e => console.log(e));
    }
}

export function deletePractitioner (practitioner) {
    return dispatch => {
        let url = `${window.fhirClient.server.serviceUrl}/Practitioner/${practitioner}`;
        API.delete(url, dispatch)
            .then(() => dispatch(fetchPersonas('Practitioner')));
    }
}

export function getPersonasPage (type = "Patient", pagination, direction) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            dispatch(lookupPersonasStart(type));
            let next = pagination.link.find(i => i.relation === direction);
            let url = next.url;
            API.get(url, dispatch)
                .then(personas => {
                    let pagination = undefined;
                    let list = personas;
                    if (personas.entry) {
                        let resourceResults = [];

                        for (let key in personas.entry) {
                            personas.entry[key].resource.fullUrl = personas.entry[key].fullUrl;
                            resourceResults.push(personas.entry[key].resource);
                        }
                        let paginationData = {
                            total: personas.total,
                            link: personas.link
                        };

                        list = resourceResults;
                        pagination = paginationData;
                    }
                    let state = getState();
                    let current = state.persona[type.toLocaleLowerCase() + 's'] || [];
                    list = current.concat(list);
                    dispatch(setPersonas(type, list, pagination));
                })
        }
    }
}

export function fetchPersonas (type = "Patient", searchCrit = null, count = 17) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            dispatch(lookupPersonasStart(type));

            let state = getState();
            if (type === 'Persona') {
                let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
                API.get(`${url}/userPersona?sandboxId=${sessionStorage.sandboxId}`, dispatch)
                    .then(personas => {
                        dispatch(setPersonas(type, personas));
                    })
            } else {
                let url = `${window.fhirClient.server.serviceUrl}/${type}?${searchCrit ? (searchCrit + '&') : ''}_sort:asc=family&_count=${count}`;
                API.get(url, dispatch)
                    .then(response => {
                        let resourceResults = [];

                        for (let key in response.entry) {
                            response.entry[key].resource.fullUrl = response.entry[key].fullUrl;
                            resourceResults.push(response.entry[key].resource);
                        }
                        let paginationData = {
                            total: response.total,
                            link: response.link
                        };

                        dispatch(setPersonas(type, resourceResults, paginationData));
                    })
                    .catch(e => {
                        dispatch(lookupPersonasFail(e));
                    })
            }
        }
    }
}

export function createPersona (type, persona) {
    return (dispatch, getState) => {
        let state = getState();

        if (window.fhirClient) {
            dispatch(creatingPersonaStart());
            let names = parseNames(persona);
            let payload = {
                fhirId: persona.id,
                fhirName: names[0].val,
                personaUserId: persona.userId,
                personaName: names[0].val,
                resource: type,
                resourceUrl: `${type}/${persona.id}`,
                password: persona.password,
                sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
                createdBy: state.users.oauthUser
            };

            let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
            API.post(`${url}/userPersona?sandboxId=${sessionStorage.sandboxId}`, payload, dispatch)
                .then(() => dispatch(creatingPersonaEnd()));
        }
    }
}
