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
        case types.SET_ERROR_TO_SHOW:
            state.errorToShow = action.payload.error;
            break;
        case types.SET_GLOBAL_SESSION_MODAL:
            state.showGlobalSessionModal = true;
            break;
        case types.SET_TERMS_LOADING:
            state.termsLoading = action.payload.loading;
            break;
        case types.SET_TERMS:
            state.terms = action.payload.terms;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.app : state;
            state.rehydrateDone = true;
            state.showGlobalSessionModal = false;
            state.errorToShow = undefined;
            break;
    }

    return state;
};
