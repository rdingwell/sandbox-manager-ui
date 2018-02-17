import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../utility";

const initialState = {
    loading: false,
    selectedSandbox : '',
    sandboxes : [],
    invitations : [],
    invitesLoading: false,
    creatingSandbox: false,
    createSandboxError: '',
    lookingForSandbox: false,
    lookingForSandboxError: '',
    lookupSandbox: '',
    sandboxApiEndpointIndexes : [
        {index: "1", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: false, supportsDataSets: false},
        {index: "2", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: false, supportsDataSets: false},
        {index: "3", name: "FHIR STU 3 (v1.8.0)", fhirVersion: "1.8.0", fhirTag: "1_8_0", altName: "FHIR v1.8", canCreate: false, supportsDataSets: false},
        {index: "4", name: "FHIR STU 3 (v3.0.1)", fhirVersion: "3.0.1", fhirTag: "3_0_1", altName: "FHIR v3.0.1", canCreate: false, supportsDataSets: true},
        {index: "5", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: false, supportsDataSets: false},
        {index: "6", name: "FHIR STU 3 (v3.0.1)", fhirVersion: "3.0.1", fhirTag: "3_0_1", altName: "FHIR v3.0.1", canCreate: true, supportsDataSets: true}
    ],
    sandboxApiEndpointIndex: null
};

const selectSandbox = (state, action) => {
    return updateObject(state, {selectedSandbox : action.sandboxId});
};

const removeSandbox = (state, action) => {
    const sandboxes = state.sandboxes.filter(sandbox => sandbox.id !== action.sandboxId);
    return updateObject(state, {sandboxes : sandboxes});
};

const updateSandbox = (state, action) => {
    const sandbox = {...state.sandboxes.filter((s) => s.sandboxId === state.selectedSandbox)[0]};
    sandbox.name = action.sandboxDetails.name;
    sandbox.description = action.sandboxDetails.description;
    sandbox.allowOpenAccess = action.sandboxDetails.allowOpenAccess;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[index].sandboxId === state.selectedSandbox) {
            ind = index;
            break;
        }
    }

    const updatedSandboxes = [
        ...state.sandboxes.slice(0, ind),
        sandbox,
        ...state.sandboxes.slice(ind + 1)
    ];
    return updateObject(state, {sandboxes: updatedSandboxes})
};

const removeUser = (state, action) => {
    const cloneState = {...state};
    const sandbox = {...cloneState.sandboxes.filter(s => s.sandboxId === state.selectedSandbox)[0]};
    const remainingUsers = sandbox.userRoles.slice()
        .filter(role => role.user.id !== action.userId);

    sandbox.userRoles = remainingUsers;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[index].sandboxId === state.selectedSandbox) {
            ind = index;
            break;
        }
    }

    const updatedSandboxes = [
        ...state.sandboxes.slice(0, ind),
        sandbox,
        ...state.sandboxes.slice(ind + 1)
    ];
    return updateObject(cloneState, {sandboxes: updatedSandboxes});
};

const fetchStart = (state, action) => {
    return updateObject( state, { loading: true } );
};

const fetchSuccess = (state, action) => {
    return updateObject( state, {
        sandboxes: action.sandboxes,
        loading: false
    } );
};

const fetchFail = (state, action) => {
    return updateObject( state, { loading: false } );
};

const fetchInvitesStart = (state, action) => {
  return updateObject(state, {invitesLoading: true});
};

const fetchInvitesSuccess = (state, action) => {
  return updateObject(state, {
      invitations: action.invitations,
      invitesLoading: false
  });
};

const fetchInvitesFail = (state, action) => {
    return updateObject(state, {invitesLoading: false});
};

const createSandboxStart = (state, action) => {
    updateObject(state, {createSandboxError: ''});
    return updateObject(state, {creatingSandbox: true});
};

const createSandboxFail = (state, action) => {
    updateObject(state, {creatingSandbox: false});
    return updateObject(state, {createSandboxError: action.error});
};

const lookupSandboxStart = (state, action) => {
    return updateObject(state, {lookingForSandbox: true});
};

const lookupSandboxSuccess = (state, action) => {
    return updateObject(state, {lookupSandbox: action.sandbox});
};

const lookupSandboxByIdFail = (state, action) => {
    updateObject(state, {lookingForSandbox: false});
    return updateObject(state, {lookingForSandboxError: action.error});
};

const saveEndpointIndex = (state, action) => {
    return updateObject(state, {sandboxApiEndpointIndex: action.index});
};

const reducer = (state = initialState, action) => {

    switch(action.type){
        case actionTypes.FETCH_SANDBOXES_START :
            return fetchStart(state, action);
        case actionTypes.FETCH_SANDBOXES_SUCCESS:
            return fetchSuccess(state, action);
        case actionTypes.FETCH_SANDBOXES_FAIL:
            return fetchFail(state, action);
        case actionTypes.DELETE_SANDBOX :
            return removeSandbox(state, action);
        case actionTypes.UPDATE_SANDBOX :
        case actionTypes.RESET_SANDBOX :
        case actionTypes.CREATE_SANDBOX_SUCCESS:
            return updateObject(state, updateSandbox(state, action));
        case actionTypes.SELECT_SANDBOX:
            return selectSandbox(state, action);
        case actionTypes.REMOVE_SANDBOX_USER:
            return removeUser(state, action);
        case actionTypes.FETCH_SANDBOX_INVITES_START:
            return fetchInvitesStart(state, action);
        case actionTypes.FETCH_SANDBOX_INVITES_SUCCESS:
            return fetchInvitesSuccess(state, action);
        case actionTypes.FETCH_SANDBOX_INVITES_FAIL:
            return fetchInvitesFail(state, action);
        case actionTypes.CREATE_SANDBOX_START:
            return createSandboxStart(state, action);
        case actionTypes.CREATE_SANDBOX_FAIL:
            return createSandboxFail(state, action);
        case actionTypes.LOOKUP_SANDBOX_BY_ID_START:
            return lookupSandboxStart(state, action);
        case actionTypes.LOOKUP_SANDBOX_BY_ID_SUCCESS:
            return lookupSandboxSuccess(state, action);
        case actionTypes.LOOKUP_SANDBOX_BY_ID_FAIL:
            return lookupSandboxByIdFail(state, action);
        case actionTypes.SAVE_ENDPOINT_INDEX:
            return saveEndpointIndex(state, action);
        default:
            return state;
    }
};

export default reducer;