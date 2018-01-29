import * as actionTypes from './actionTypes';
import axios from '../../axiox';


export const selectSandbox = (sandboxId) => {
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
        type: actionTypes.CREAT_SANDBOX_FAIL,
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

export const createSandbox = (sandboxDetails) => {
    return (dispatch, getState) => {
        const state = getState();
        if(!state.fhir.fhirClient){
            return;
        }
        dispatch(createSandboxStart());
        axios.post(state.fhir.sandboxManagerApiUrl + '/sandbox', sandboxDetails, getConfig(state))
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
      dispatch(lookupSandboxByIdStart());
      const queryParams = '?lookupId=' + sandboxId;
      axios.get(state.fhir.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
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
        const queryParams = '?userId=' + state.user.oauthUser.sbmUserId;

        axios.get(state.fhir.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
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
      const queryParams = '?sbmUserId=' + state.user.oauthUser.sbmUserId + '&status=PENDING';

      axios.get(state.fhir.sandboxManagerApiUrl + '/sandboxinvite' + queryParams, getConfig(state))
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



