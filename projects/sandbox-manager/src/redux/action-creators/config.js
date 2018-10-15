import API from '../../lib/api';

const XSETTINGS_SOURCE = "/data/xsettings.json";

import * as types from "./types";

import initialState from "../reducers/config/init";

export function config_Reset () {
    return { type: types.CONFIG_RESET };
}

export function setSettings (status, data) {
    return {
        type: types.CONFIG_SET_XSETTINGS,
        payload: { status, data }
    }
}

// Complex action creators -----------------------------------------------------
export function config_LoadXsettings () {
    return function (dispatch) {
        dispatch(setSettings("loading", {}));

        API.get(XSETTINGS_SOURCE, dispatch)
            .then(data => dispatch(setSettings("ready", data || {})))
            .catch(() => {
                dispatch(setSettings("error", initialState.xsettings));
            });
    };
}