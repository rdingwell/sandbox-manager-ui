import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    loading: false,
    error: null,
    careTeam: []
};


const lookupCareTeamStart = (state) => {
    return updateObject(state, {
        loading: true,
        error: null
    });
};

const lookupCareTeamFail = (state, action) => {
    updateObject(state, {loading: false});
    return updateObject(state, {error: action.error});
};

const lookupCareTeamSuccess = (state, action) => {
    return updateObject( state, {
        careTeam: action.careTeam,
        loading: false
    } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOOKUP_CARE_TEAM_START:
            return lookupCareTeamStart(state);
        case actionTypes.LOOKUP_CARE_TEAM_FAIL:
            return lookupCareTeamFail(state, action);
        case actionTypes.LOOKUP_CARE_TEAM_SUCCESS:
            return lookupCareTeamSuccess(state, action);
        default: return state;
    }
};

export default reducer;
