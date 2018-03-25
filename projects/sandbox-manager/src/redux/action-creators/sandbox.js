import * as actionTypes from './types';

export const selectSandboxById = (sandboxId) => {
    localStorage.setItem('sandboxId', sandboxId);
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
};

export const inviteNewUser = (email) => {
    return {
        type: actionTypes.INVITE_NEW_USER,
        email : email
    }
};

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

export const fetchSandboxesStart = () => {
    return {
        type: actionTypes.FETCH_SANDBOXES_START
    };
};

export const fetchSandboxInvitesStart = () => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_START
    };
};

export const fetchSandboxesSuccess = (sandboxes) => {
    return {
        type: actionTypes.FETCH_SANDBOXES_SUCCESS,
        sandboxes: sandboxes
    }
};

export const fetchSandboxInvitesSuccess = (invitations) => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_SUCCESS,
        invitations: invitations
    }
};

export const fetchSandboxesFail = (error) => {
    return {
        type: actionTypes.FETCH_SANDBOXES_FAIL,
        error: error
    }
};

export const fetchSandboxInvitesFail = (error) => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_FAIL,
        error: error
    }
};

export const createSandboxStart = () => {
    return{
        type: actionTypes.CREATE_SANDBOX_START
    }
};

export const createSandboxFail = (error) => {
    return{
        type: actionTypes.CREATE_SANDBOX_FAIL,
        error : error
    }
};

export const createSandboxSuccess = (sandbox) => {
    return{
        type: actionTypes.CREATE_SANDBOX_SUCCESS,
        sandbox: sandbox
    }
};

export const lookupSandboxByIdStart = () => {
    return{
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_START
    }
};

export const lookupSandboxByIdFail = (error) => {
    return{
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_FAIL,
        error: error
    }
};

export const lookupSandboxByIdSuccess = (sandboxes) => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_SUCCESS,
        sandboxes: sandboxes
    }
};


const getConfig = (state) => {
    return {
        headers: {
            Authorization: 'BEARER ' + state.fhir.fhirClient.server.auth.token
        }
    };
};

const setDefaultUrl = (sandboxId) => {
    return{
        type: actionTypes.SET_FHIR_SERVER_URL,
        sandboxId: sandboxId
    }
};

export const selectSandbox = (sandboxId) => {
    return(dispatch, getState) => {
        let state = getState();
        let config = JSON.parse(localStorage.getItem('config'));
        let queryParams = "?userId=" + encodeURIComponent(state.user.oauthUser.sbmUserId);

        //log in to the sandbox
        axios.post(config.sandboxManagerApiUrl + '/sandbox/' + sandboxId + "/login" + queryParams, null, getConfig(state))
            .then(res => {})
            .catch(err => {});
        dispatch(authorizeSandbox(sandboxId));
        dispatch(setDefaultUrl(sandboxId));
        dispatch(selectSandboxById(sandboxId));
    };

};


export const createSandbox = (sandboxDetails) => {
    return (dispatch, getState) => {
        const state = getState();
        if(!state.fhir.fhirClient){
            return;
        }
        let configuration = JSON.parse(localStorage.getItem('config'));
        dispatch(createSandboxStart());
        axios.post(configuration.sandboxManagerApiUrl + '/sandbox', sandboxDetails, getConfig(state))
            .then(res => {
                dispatch(createSandboxSuccess(res.data));
            })
            .catch(err => {
                dispatch(createSandboxFail(err));
            });
    };
};



export const fetchSandboxById = (sandboxId) => {
    return(dispatch, getState) => {
        const state = getState();
        if(!state.fhir.fhirClient) {
            return;
        }
        let configuration = JSON.parse(localStorage.getItem('config'));
        dispatch(lookupSandboxByIdStart());
        const queryParams = '?lookupId=' + sandboxId;
        axios.get(configuration.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
            .then(res => {
                const sandboxes = [];
                for(let key in res.data){
                    sandboxes.push({
                        ...res.data[key], id: key
                    });
                }
                dispatch(lookupSandboxByIdSuccess(sandboxes));
            })
            .catch(err => {
                dispatch(lookupSandboxByIdFail(err));
            });
    };

};

export const fetchSandboxes = () => {
    return (dispatch, getState) => {
        const state = getState();
        if(!state.fhir.fhirClient){
            return;
        }
        dispatch(fetchSandboxesStart());
        let configuration = JSON.parse(localStorage.getItem('config'));
        const queryParams = '?userId=' + state.user.oauthUser.sbmUserId;

        axios.get(configuration.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
            .then(res => {
                const sandboxes = [];
                for (let key in res.data){
                    sandboxes.push({
                        ...res.data[key], id: key
                    });
                }
                dispatch(fetchSandboxesSuccess(sandboxes));
            })
            .catch(err => {
                dispatch(fetchSandboxesFail(err));
            });
    };
};

export const fetchSandboxInvites = () => {
    return (dispatch, getState) => {
        const state = getState();
        if(!state.fhir.fhirClient){
            return;
        }
        dispatch(fetchSandboxInvitesStart());
        let configuration = JSON.parse(localStorage.getItem('config'));

        const queryParams = '?sbmUserId=' + state.user.oauthUser.sbmUserId + '&status=PENDING';

        axios.get(configuration.sandboxManagerApiUrl + '/sandboxinvite' + queryParams, getConfig(state))
            .then(res => {
                const invitations = [];
                for(let key in res.data){
                    invitations.push({
                        ...res.data[key], id: key
                    });
                }
                dispatch(fetchSandboxInvitesSuccess(invitations));
            })
            .catch(err => {
                dispatch(fetchSandboxInvitesFail(err));
            })
    };
};



