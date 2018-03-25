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
        case actionTypes.CREATE_SANDBOX_START:
            state.createSandboxError = '';
            state.creatingSandbox = true;
            break;
        case actionTypes.CREATE_SANDBOX_FAIL:
            state.creatingSandbox = false;
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
    }

    return state;
};

const updateSandbox = (state, action) => {
    const sandbox = { ...state.sandboxes.filter((s) => s.sandboxId === state.selectedSandbox)[ 0 ] };
    sandbox.name = action.sandboxDetails.name;
    sandbox.description = action.sandboxDetails.description;
    sandbox.allowOpenAccess = action.sandboxDetails.allowOpenAccess;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[ index ].sandboxId === state.selectedSandbox) {
            ind = index;
            break;
        }
    }

    state.sandboxes = [ ...state.sandboxes.slice(0, ind), sandbox, ...state.sandboxes.slice(ind + 1) ];

    return state;
};

const removeUser = (state, action) => {
    const cloneState = { ...state };
    const sandbox = { ...cloneState.sandboxes.filter(s => s.sandboxId === state.selectedSandbox)[ 0 ] };
    const remainingUsers = sandbox.userRoles.slice().filter(role => role.user.id !== action.userId);

    sandbox.userRoles = remainingUsers;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[ index ].sandboxId === state.selectedSandbox) {
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
