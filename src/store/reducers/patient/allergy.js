import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    loading: false,
    error: null,
    allergyIntolerance: []
};


const lookupAllergyIntoleranceStart = (state) => {
    return updateObject(state, {
        loading: true,
        error: null
    });
};

const lookupAllergyIntoleranceFail = (state, action) => {
    updateObject(state, {loading: false});
    return updateObject(state, {error: action.error});
};

const lookupAllergyIntoleranceSuccess = (state, action) => {
    return updateObject( state, {
        allergyIntolerance: action.allergyIntolerance,
        loading: false
    } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOOKUP_ALLERGY_INTOLERANCE_START:
            return lookupAllergyIntoleranceStart(state);
        case actionTypes.LOOKUP_ALLERGY_INTOLERANCE_FAIL:
            return lookupAllergyIntoleranceFail(state, action);
        case actionTypes.LOOKUP_ALLERGY_INTOLERANCE_SUCCESS:
            return lookupAllergyIntoleranceSuccess(state, action);
        default: return state;
    }
};

export default reducer;
