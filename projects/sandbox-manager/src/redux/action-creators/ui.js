/* tslint:disable:max-line-length */

import * as types from "./types";

export function ui_SetClientWidth (width = 800) {
    return {
        type: types.UI_SET_CLIENT_WIDTH,
        payload: width,
    };
}

export function ui_SetFooterHeight (height = 100) {
    return {
        type: types.UI_SET_FOOTER_HEIGHT,
        payload: height,
    };
}

export function ui_SetInitialized (flag = true) {
    return {
        type: types.UI_SET_INITIALIZED,
        payload: flag,
    };
}

export function ui_SetRetina () {
    const media = "(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)";
    const isRetina = (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(media).matches));
    return {
        type: types.UI_SET_RETINA,
        payload: isRetina,
    };
}

export function ui_SetTheme (theme) {
    return {
        type: types.UI_SET_THEME,
        payload: theme,
    };
}
