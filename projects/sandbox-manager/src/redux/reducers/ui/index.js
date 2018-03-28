import * as types from "../../action-creators/types";
import initialState from "./init";

export default function (state = initialState, action) {
    switch (action.type) {
        case types.UI_SET_CLIENT_WIDTH:
            return Object.assign({}, state, { clientWidth: action.payload });

        case types.UI_SET_FOOTER_HEIGHT:
            return Object.assign({}, state, { footerHeight: action.payload });

        case types.UI_SET_INITIALIZED:
            return Object.assign({}, state, { initialized: action.payload });

        case types.UI_SET_RETINA:
            return Object.assign({}, state, { retina: action.payload });

        case types.UI_SET_THEME:
            return Object.assign({}, state, { theme: action.payload });

        case "persist/REHYDRATE":
            state = action.payload ? action.payload.ui : state;
            break;
    }

    return state;
}
