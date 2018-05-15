import * as types from "../../action-creators/types";
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case types.SET_APP_SCREEN:
            state.screen = action.payload;
            break;
        case types.APP_RESET_STATE:
            state = initialState;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.app : state;
            break;
    }

    return state;
};
