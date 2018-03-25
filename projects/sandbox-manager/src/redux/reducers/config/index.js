import * as types from "../../action-creators/types";
import initialState from "./init";

export default function (state = initialState, action) {
    state = Object.assign({}, state);

    switch (action.type) {
        case types.CONFIG_SET_XSETTINGS:
            state.xsettings = action.payload;
            break;
    }

    return state;
}
