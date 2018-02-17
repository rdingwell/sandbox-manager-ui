import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    loading: false,
    error: null,
    observations: []
};


const lookupObservationsStart = (state) => {
    updateObject(state, {loading: true});
    return updateObject(state, {error: null});
};

const lookupObservationFail = (state, action) => {
    updateObject(state, {loading: false});
    return updateObject(state, {error: action.error});
};

const lookupObservationSuccess = (state, action) => {
    return updateObject( state, {
        observations: action.observations,
        loading: false
    } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOOKUP_OBSERVATION_START:
            return lookupObservationsStart(state);
        case actionTypes.LOOKUP_OBSERVATION_FAIL:
            return lookupObservationFail(state, action);
        case actionTypes.LOOKUP_OBSERVATION_SUCCESS:
            return lookupObservationSuccess(state, action);
        default: return state;
    }
};

export default reducer;
