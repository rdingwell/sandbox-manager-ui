import * as types from "../../action-creators/types";
import initialState from "./init";

export default function (state = initialState, action) {
    state = Object.assign({}, state);
    switch (action.type) {
        case types.CONFIG_SET_XSETTINGS:
            state.xsettings = action.payload;
            break;
        case types.APP_RESET_STATE:
            state = initialState;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.config : state;
            break;
    }

    return state;
}
