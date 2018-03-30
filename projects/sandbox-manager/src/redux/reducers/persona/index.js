import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default ( state = initialState, action ) => {
    state = Object.assign({}, state);

    switch ( action.type ) {
        case actionTypes.LOOKUP_PERSONAS_START:
            state.loading = true;
            state.loadingError = null;
            break;
        case actionTypes.LOOKUP_PERSONAS_FAIL:
            state.loading = false;
            state.loadingError = action.error;
            break;
        case actionTypes.LOOKUP_PERSONAS_SUCCESS:
            action.payload.type === "Patient" && (state.patients = action.payload.personas);
            action.payload.type !== "Patient" && (state.practitioners = action.payload.personas);
            state.loading = false;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.persona : state;
            break;
    }

    return state;
};
