import * as actionTypes from './actionTypes';

export const deleteSandbox = (sandboxId) => {
    return{
        type: actionTypes.DELETE_SANDBOX,
        sandboxId : sandboxId
    };
};

export const resetSandbox = (sandboxId) => {
    return {
        type: actionTypes.RESET_SANDBOX,
        sandboxId : sandboxId
    }
};

export const updateSandbox = (sandboxDetails) => {
    return {
        type: actionTypes.UPDATE_SANDBOX,
        sandboxDetails : sandboxDetails
    }
};

export const getSandbox = () => {
    return {
        type: actionTypes.GET_SANDBOX
    }
};

export const selectSandbox = (sandboxId) => {
    return {
        type : actionTypes.SELECT_SANDBOX,
        sandboxId : sandboxId
    }
};

export const removeUser = (userId) => {
    return {
        type: actionTypes.REMOVE_SANDBOX_USER,
        userId : userId
    }
}