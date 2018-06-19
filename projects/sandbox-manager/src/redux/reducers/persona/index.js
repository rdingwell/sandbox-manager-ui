import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case actionTypes.LOOKUP_PERSONAS_START:
            state.loading = true;
            state.loadingError = null;
            // action.payload.type === "Patient" && (state.patients = undefined);
            // action.payload.type === "Practitioner" && (state.practitioners = undefined);
            // action.payload.type === "Persona" && (state.personas = undefined);
            break;
        case actionTypes.LOOKUP_PERSONAS_FAIL:
            state.loading = false;
            state.loadingError = action.error;
            break;
        case actionTypes.CREATE_PERSONA_START:
            state.createing = true;
            break;
        case actionTypes.CREATE_PERSONA_END:
            state.createing = false;
            break;
        case actionTypes.LOOKUP_PERSONAS_SUCCESS:
            state.loading = false;
            switch (action.payload.type) {
                case "Patient":
                    state.patients = action.payload.personas;
                    state.patientsPagination = action.payload.pagination;
                    break;
                case "Practitioner":
                    state.practitioners = action.payload.personas;
                    state.practitionersPagination = action.payload.pagination;
                    break;
                case "Persona":
                    state.personas = action.payload.personas;
                    state.personasPagination = action.payload.pagination;
                    break;
            }
            break;
        case actionTypes.APP_RESET_STATE:
        case actionTypes.SET_SANDBOX_SELECTING:
            state = initialState;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.persona : state;
            break;
    }

    return state;
};
