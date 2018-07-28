import * as types from "../../action-creators/types";
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case types.SET_SANDBOX_APPS_LOADING:
            state.loading = action.payload.loading;
            break;
        case types.SET_SANDBOX_APP_LOADING:
            state.loadingApp = action.payload.loading;
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
        case types.SET_CREATED_APP:
            state.createdApp = action.payload.app;
            break;
        case types.SET_SANDBOX_SELECTING:
            action.payload.selecting && (state.apps = []);
            break;
        case types.APP_RESET_STATE:
            state = initialState;
            break;
        case types.SET_APP:
            let newApps = state.apps.filter(i => i.id !== action.payload.app.id);
            newApps.push(action.payload.app);
            state.apps = newApps;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.apps : state;
            break;
    }

    return state;
};
