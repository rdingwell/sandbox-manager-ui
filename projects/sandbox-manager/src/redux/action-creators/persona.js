import * as actionTypes from "./types";

export function lookupPersonasStart () {
    return {
        type: actionTypes.LOOKUP_PERSONAS_START
    }
}

export function lookupPersonasFail (error) {
    return {
        type: actionTypes.LOOKUP_PERSONAS_FAIL,
        error: error
    }
}

export function savePatients (type, personas) {
    return {
        type: actionTypes.LOOKUP_PERSONAS_SUCCESS,
        payload: { type, personas }
    };
}

export function fetchPersonas (type = "Patient") {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(lookupPersonasStart());
            let count = 50;

            let searchParams = { type, count: count };
            searchParams.query = {};

            window.fhirClient.api.search(searchParams)
                .then(response => {
                    let resourceResults = [];

                    for (let key in response.data.entry) {
                        response.data.entry[key].resource.fullUrl = response.data.entry[key].fullUrl;
                        resourceResults.push(response.data.entry[key].resource);
                    }
                    dispatch(savePatients(type, resourceResults));
                }).fail(error => {
                dispatch(lookupPersonasFail(error));
            });
        }
    };
}
