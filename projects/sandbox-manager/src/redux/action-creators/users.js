import * as actionTypes from "./types";

export const setOauthUserInfo = (sbmUserId, email, name) => {
    return{
        type: actionTypes.SAVE_OAUTH_USER,
        sbmUserId: sbmUserId,
        email: email,
        name: name
    };
};

export const saveSandboxManagerUser = (sandboxManagerUser) => {
    return{
        type: actionTypes.SAVE_SANDBOX_USER,
        user: sandboxManagerUser
    }
};
