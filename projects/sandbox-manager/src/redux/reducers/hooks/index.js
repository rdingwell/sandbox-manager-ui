import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);
    switch (action.type) {
        case actionTypes.HOOKS_EXECUTING:
            state.executing = action.payload.executing;
            break;
        case "persist/REHYDRATE":
            // state = action.payload && action.payload.hooks ? action.payload.hooks : state;
            state = initialState;
            break;
    }

    return state;
};
