import initialState from "./init";
import * as actionTypes from "../../action-creators/types";

export default function (state = initialState, action) {
    state = Object.assign({}, state);

    switch (action.type) {
        case actionTypes.FETCH_SANDBOXES_START :
            state.loading = true;
            break;
        case actionTypes.FETCH_SANDBOXES_SUCCESS:
            state.sandboxes = action.sandboxes;
            state.loading = false;
            break;
        case actionTypes.FETCH_SANDBOXES_FAIL:
            state.loading = false;
            break;
        case actionTypes.DELETE_SANDBOX :
            const sandboxes = state.sandboxes.filter(sandbox => sandbox.id !== action.sandboxId);
            state.sandboxes = sandboxes;
            break;
        case actionTypes.UPDATE_SANDBOX :
        case actionTypes.RESET_SANDBOX :
        case actionTypes.CREATE_SANDBOX_SUCCESS:
            state = updateSandbox(state, action);
            break;
        case actionTypes.SELECT_SANDBOX:
            state.selectedSandbox = action.sandboxId;
            break;
        case actionTypes.REMOVE_SANDBOX_USER:
            state = removeUser(state, action);
            break;
        case actionTypes.CLEAR_RESULTS:
            state.dataImporting = false;
            state.importResults = undefined;
            break;
        case actionTypes.SET_DATA_IMPORTING:
            state.dataImporting = action.payload.importing;
            state.importResults = undefined;
            break;
        case actionTypes.SET_IMPORT_RESULTS:
            state.importResults = action.payload.results;
            break;
        case actionTypes.SET_INVITES_LOADING:
            state.userInvitesLoading = action.payload.loading;
            break;
        case actionTypes.SET_INVITES:
            state.userInvites = action.payload.invites;
            break;
        case actionTypes.FETCH_SANDBOX_INVITES_START:
            state.invitesLoading = true;
            break;
        case actionTypes.FETCH_SANDBOX_INVITES_SUCCESS:
            state.invitations = action.invitations;
            state.invitesLoading = false;
            break;
        case actionTypes.FETCH_SANDBOX_INVITES_FAIL:
            state.invitesLoading = false;
            break;
        case actionTypes.CREATING_SANDBOX:
            state.creatingSandbox = action.payload.creating;
            break;
        case actionTypes.CREATE_SANDBOX_FAIL:
            state.createSandboxError = action.error;
            break;
        case actionTypes.LOOKUP_SANDBOX_BY_ID_START:
            state.lookingForSandbox = true;
            break;
        case actionTypes.LOOKUP_SANDBOX_BY_ID_SUCCESS:
            state.lookupSandbox = action.sandbox;
            break;
        case actionTypes.LOOKUP_SANDBOX_BY_ID_FAIL:
            state.lookingForSandbox = false;
            state.lookingForSandboxError = action.error;
            break;
        case actionTypes.SAVE_ENDPOINT_INDEX:
            state.sandboxApiEndpointIndex = action.index;
            break;
        case actionTypes.SET_DEFAULT_SANDBOX_USER:
            state.defaultUser = action.payload.user;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS_LOADING:
            state.launchScenariosLoading = action.payload.loading;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS:
            state.launchScenarios = action.payload.scenarios;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS_CREATING:
            state.launchScenarioCreating = action.payload.creating;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS_DELETING:
            state.launchScenarioDeleting = action.payload.deleting;
            break;
        case actionTypes.SET_RESETTING_CURRENT_SANDBOX:
            state.resetting = action.payload.resetting;
            break;
        case actionTypes.APP_RESET_STATE:
            state = initialState;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.sandbox : state;
            state.dataImporting = false;
            state.importResults = undefined;
            break;
    }

    return state;
};

const updateSandbox = (state, action) => {
    const sandbox = { ...state.sandboxes.filter((s) => s.sandboxId === sessionStorage.sandboxId)[ 0 ] };
    sandbox.name = action.sandboxDetails.name;
    sandbox.description = action.sandboxDetails.description;
    sandbox.allowOpenAccess = action.sandboxDetails.allowOpenAccess;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[ index ].sandboxId === sessionStorage.sandboxId) {
            ind = index;
            break;
        }
    }

    state.sandboxes = [ ...state.sandboxes.slice(0, ind), sandbox, ...state.sandboxes.slice(ind + 1) ];

    return state;
};

const removeUser = (state, action) => {
    const cloneState = { ...state };
    const sandbox = { ...cloneState.sandboxes.filter(s => s.sandboxId === sessionStorage.sandboxId)[ 0 ] };
    const remainingUsers = sandbox.userRoles.slice().filter(role => role.user.id !== action.userId);

    sandbox.userRoles = remainingUsers;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[ index ].sandboxId === sessionStorage.sandboxId) {
            ind = index;
            break;
        }
    }

    state.sandboxes = [
        ...state.sandboxes.slice(0, ind),
        sandbox,
        ...state.sandboxes.slice(ind + 1)
    ];

    return state;
};
