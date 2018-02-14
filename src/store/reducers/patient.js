import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    lookingForPatients: false,
    lookingForPatientsError: null,
    patients: []
};


const lookupPatientsStart = (state) => {
    updateObject(state, {lookingForPatients: true});
    return updateObject(state, {lookingForPatientsError: null});
};

const lookupPatientsFail = (state, action) => {
    updateObject(state, {lookingForPatients: false});
    return updateObject(state, {lookingForPatientsError: action.error});
};

const lookupPatientsSuccess = (state, action) => {
    return updateObject( state, {
        patients: action.patients,
        lookingForPatients: false
    } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOOKUP_PATIENTS_START:
            return lookupPatientsStart(state);
        case actionTypes.LOOKUP_PATIENTS_FAIL:
            return lookupPatientsFail(state, action);
        case actionTypes.LOOKUP_PATIENTS_SUCCESS:
            return lookupPatientsSuccess(state, action);
        default: return state;
    }
};

export default reducer;
