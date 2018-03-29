import * as types from "./types";

export function app_setScreen (screen) {
    return { type: types.SET_APP_SCREEN, payload: screen }
}
