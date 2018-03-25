const XSETTINGS_SOURCE = "/data/xsettings.json";

import * as types from "./types";

import { getDeepValue as gdv } from "../../../../../lib/utils/";
import initialState from "../reducers/config/init";

export function config_Reset () {
    return { type: types.CONFIG_RESET };
}

// Complex action creators -----------------------------------------------------
export function config_LoadXsettings () {
    return function (dispatch) {
        dispatch({
            type: types.CONFIG_SET_XSETTINGS,
            payload: { status: "loading", data: {} },
        });

        return fetch(XSETTINGS_SOURCE)
            .then((res) => dispatch({
                type: types.CONFIG_SET_XSETTINGS,
                payload: {
                    status: "ready",
                    data: gdv(res, "data") || {},
                },
            }))
            .catch((reason) => {
                process.env.NODE_ENV !== "test" && console.error(reason);
                return dispatch({
                    type: types.CONFIG_SET_XSETTINGS,
                    payload: { ...Object.assign({}, initialState.xsettings, { status: "error" }) },
                });
            })
            ;
    };
}
