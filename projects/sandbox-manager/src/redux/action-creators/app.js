import * as types from "./types";

export function resetState () {
    return { type: types.APP_RESET_STATE }
}

export function app_setScreen (screen) {
    return { type: types.SET_APP_SCREEN, payload: screen }
}

export function setTermsLoading (loading) {
    return { type: types.SET_TERMS_LOADING, payload: { loading } }
}

export function setTerms (terms) {
    return { type: types.SET_TERMS, payload: { terms } }
}

export function loadTerms () {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(setTermsLoading(true));

        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/termsofuse`;
        fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                response.json()
                    .then(terms => {
                        dispatch(setTerms(terms));
                    })
                    .catch(e => {
                        console.log(e);
                    });
            })
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                dispatch(setTermsLoading(false));
            });
    }
}

export function signOut () {
    return (dispatch, getState) => {
        let state = getState();
        sessionStorage.clear();
        localStorage.clear();
        let configuration = state.config.xsettings.data.sandboxManager;

        dispatch(resetState());
        window.location.href = `${configuration.oauthLogoutUrl}?hspcRedirectUrl=${window.location.origin}`;
    }
}
