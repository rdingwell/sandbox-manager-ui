import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

const saveOauthUser = (state, action) => {
    const user = { ...state.oauthUser };
    user.sbmUserId = action.sbmUserId;
    user.email = action.email;
    user.name = action.name;
    localStorage.setItem("oauthUser", JSON.stringify(user));
    state.oauthUser = user;
    return state;
};


export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case actionTypes.SAVE_OAUTH_USER:
            state = saveOauthUser(state, action);
            break;
        case actionTypes.SAVE_SANDBOX_USER:
            state.user = action.user;
            break;
    }

    return state;
};
