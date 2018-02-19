import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    loading: false,
    error: null,
    carePlan: []
};


const lookupCarePlanStart = (state) => {
    return updateObject(state, {
        loading: true,
        error: null
    });
};

const lookupCarePlanFail = (state, action) => {
    updateObject(state, {loading: false});
    return updateObject(state, {error: action.error});
};

const lookupCarePlanSuccess = (state, action) => {
    return updateObject( state, {
        carePlan: action.carePlan,
        loading: false
    } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOOKUP_CARE_PLAN_START:
            return lookupCarePlanStart(state);
        case actionTypes.LOOKUP_CARE_PLAN_FAIL:
            return lookupCarePlanFail(state, action);
        case actionTypes.LOOKUP_CARE_PLAN_SUCCESS:
            return lookupCarePlanSuccess(state, action);
        default: return state;
    }
};

export default reducer;
