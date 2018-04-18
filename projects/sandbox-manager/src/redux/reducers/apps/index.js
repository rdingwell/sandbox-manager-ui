import * as types from "../../action-creators/types";
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case types.SET_SANDBOX_APPS_LOADING:
            state.loading = action.payload.loading;
            break;
        case types.SET_SANDBOX_APPS_CREATING:
            state.creating = action.payload.creating;
            break;
        case types.SET_SANDBOX_APPS_DELETING:
            state.deleting = action.payload.deleting;
            break;
        case types.SET_SANDBOX_APPS:
            let apps = action.payload.apps || [];
            state.apps = apps;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.apps : state;
            break;
    }

    return state;
};
