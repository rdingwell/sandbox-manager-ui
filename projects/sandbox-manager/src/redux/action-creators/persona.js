import * as actionTypes from "./types";
import { parseNames } from "sandbox-manager-lib/utils/fhir";

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

export function deletePersona (persona) {
    return (dispatch, getState) => {
        let state = getState();
        let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/userPersona/" + persona.id;
        fetch(url, {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: 'DELETE'
        })
            .then(() => dispatch(fetchPersonas('Persona')));
    }
}

export function getPersonasPage (type = "Patient", pagination, direction) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(lookupPersonasStart(type));
            let next = pagination.link.find(i => i.relation === direction);
            let url = next.url;
            fetch(url, {
                headers: {
                    Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    res.json().then(personas => {
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

                            dispatch(setPersonas(type, resourceResults, paginationData));
                        } else {
                            dispatch(setPersonas(type, personas));
                        }
                    })
                })
        }
    }
}

export function fetchPersonas (type = "Patient", searchCrit = {}) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            dispatch(lookupPersonasStart(type));
            let count = 11;

            let state = getState();
            if (type === 'Persona') {
                let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
                fetch(`${url}/userPersona?sandboxId=${sessionStorage.sandboxId}`, {
                    headers: {
                        Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                })
                    .then(res => {
                        res.json().then(personas => {
                            dispatch(setPersonas(type, personas));
                        })
                    })
            } else {
                let searchParams = { type, count: count };
                searchParams.query = searchCrit;
                searchParams.query['$sort'] = [['family', 'asc']];

                window.fhirClient.api.search(searchParams)
                    .then(response => {
                        let resourceResults = [];

                        for (let key in response.data.entry) {
                            response.data.entry[key].resource.fullUrl = response.data.entry[key].fullUrl;
                            resourceResults.push(response.data.entry[key].resource);
                        }
                        let paginationData = {
                            total: response.data.total,
                            link: response.data.link
                        };

                        dispatch(setPersonas(type, resourceResults, paginationData));
                    }).fail(error => {
                    dispatch(lookupPersonasFail(error));
                });
            }
        }
    };
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
            fetch(`${url}/userPersona?sandboxId=${sessionStorage.sandboxId}`, {
                headers: {
                    Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(payload)
            })
                .then(e => {
                    e.json().then(i => console.log(i));
                    dispatch(creatingPersonaEnd());
                });
        }
    }
}
