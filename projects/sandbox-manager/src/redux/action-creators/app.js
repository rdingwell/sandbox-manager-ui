import * as types from "./types";

export function resetState () {
    return { type: types.APP_RESET_STATE }
}

export function app_setScreen (screen) {
    return { type: types.SET_APP_SCREEN, payload: screen }
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
