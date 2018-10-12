import { setGlobalError } from '../../redux/action-creators';

export default {
    post (url, data, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("POST", data))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    put (url, data, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("PUT", data))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    get (url, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("GET"))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    delete (url, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("DELETE"))
                .then(() => resolve())
                .catch(e => parseError(e, dispatch, reject));
        });
    }
};

// Helpers

const get_config = (method, data) => {
    let CONFIG = {
        headers: {
            Authorization: window.fhirClient && window.fhirClient.server && window.fhirClient.server.auth ? `BEARER ${window.fhirClient.server.auth.token}` : undefined,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method
    };

    if (data) {
        CONFIG.body = JSON.stringify(data);
    }

    return CONFIG;
};

const parseResponse = (response, dispatch, resolve, reject) => {
    if (response.status === 404) {
        dispatch(setGlobalError(`Resource "${url}" not found!`));
        // reject();
    } else if (response.status >= 300) {
        response.text()
            .then(a => {
                dispatch(setGlobalError(a));
            })
            .catch(e => {
                dispatch(setGlobalError(e));
            });
        // reject();
    } else {
        try {
            response.json()
                .then(terms => resolve(terms))
                // .catch(e => {
                    // if (e.message && (e.message === 'Unexpected token S in JSON at position 0' || e.message === 'Unexpected end of JSON input' || e.message === 'JSON.parse: unexpected end of data at line 1 column 1 of the JSON data')) {
                    //     resolve();
                    // } else {
                    //     dispatch(setGlobalError(e));
                        // reject();
                    // }
                // })
        } catch (e) {
            response.text()
                .then(a => {
                    dispatch(setGlobalError(a));
                })
                .catch(e => {
                    dispatch(setGlobalError(e));
                });
        }
    }
};

const parseError = (error, dispatch, reject) => {
    dispatch(setGlobalError(error));
    // reject();
};