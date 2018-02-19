import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    allergyLoading: false,
    allergyError: null,
    allergyIntolerance: [],
    loadingCarePlan: false,
    carePlanError: null,
    carePlan: [],
    loadingCareTeam: false,
    careTeam: [],
    loadingCondition: false,
    condition: [],
    conditionError: null,
    loadingObservation: false,
    observation: [],
    observationError: null
};

/*
    Allergy Intolerance
 */
const lookupAllergyIntoleranceStart = (state) => {
    return updateObject(state, {
        allergyLoading: true,
        allergyError: null
    });
};

const lookupAllergyIntoleranceFail = (state, action) => {
    return updateObject(state, {
        allergyLoading: false,
        allergyError: action.error
    });
};

const lookupAllergyIntoleranceSuccess = (state, action) => {
    return updateObject( state, {
        allergyIntolerance: action.data,
        allergyLoading: false
    } );
};

const doAllergyIntolerance = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupAllergyIntoleranceStart(state);
        case 'fail':
            return lookupAllergyIntoleranceFail(state, action);
        case 'save':
            return lookupAllergyIntoleranceSuccess(state, action);
        default:
            return state;
    }
};
 /*
    End Allergy Intolerance
  */

/*
    Care Plan
 */
 const lookupCarePlanStart = (state) => {
    return updateObject(state, {
        loadingCarePlan: true,
        carePlan: null
    });
};

const lookupCarePlanFail = (state, action) => {
    return updateObject(state, {
        loadingCarePlan: false,
        carePlanError: action.error
    });
};

const lookupCarePlanSave = (state, action) => {
    return updateObject(state, {
        loadingCarePlan: false,
        carePlan: action.data
    });
};

const doCarePlan = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupCarePlanStart(state);
        case 'fail':
            return lookupCarePlanFail(state, action);
        case 'save':
            return lookupCarePlanSave(state, action);
        default:
            return state;
    }
};
/*
    End Care Plan
 */


/*
    Care Team
 */
const lookupCareTeamStart = (state) => {
    return updateObject(state, {
        loadingCareTeam: true,
        careTeam: null
    });
};

const lookupCareTeamFail = (state, action) => {
    return updateObject(state, {
        loadingCareTeam: false,
        careTeamError: action.error
    });
};

const lookupCareTeamSave = (state, action) => {
    return updateObject(state, {
        loadingCareTeam: false,
        careTeam: action.data
    });
};

const doCareTeam = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupCareTeamStart(state);
        case 'fail':
            return lookupCareTeamFail(state, action);
        case 'save':
            return lookupCareTeamSave(state, action);
        default:
            return state;
    }
};
/*
    End Care Team
 */


/*
    Condition
*/
const lookupConditionStart = (state) => {
    return updateObject(state, {
        loadingCondition: true,
        condition: null
    });
};

const lookupConditionFail = (state, action) => {
    return updateObject(state, {
        loadingCondition: false,
        conditionError: action.error
    });
};

const lookupConditionSave = (state, action) => {
    return updateObject(state, {
        loadingCondition: false,
        condition: action.data
    });
};

const doCondition = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupConditionStart(state);
        case 'fail':
            return lookupConditionFail(state, action);
        case 'save':
            return lookupConditionSave(state, action);
        default:
            return state;
    }
};
/*
    End Care Team
 */


/*
    Observation
*/
const lookupObservationStart = (state) => {
    return updateObject(state, {
        loadingObservation: true,
        observationError: null
    });
};

const lookupObservationFail = (state, action) => {
    return updateObject(state, {
        loadingObservation: false,
        observationError: action.error
    });
};

const lookupObservationSave = (state, action) => {
    return updateObject(state, {
        loadingObservation: false,
        observation: action.data
    });
};

const doObservation = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupObservationStart(state);
        case 'fail':
            return lookupObservationFail(state, action);
        case 'save':
            return lookupObservationSave(state, action);
        default:
            return state;
    }
};
/*
    End Observation
 */



const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ALLERGY_INTOLERANCE:
            return doAllergyIntolerance(state, action);
        case actionTypes.CARE_PLAN:
            return doCarePlan(state, action);
        case actionTypes.CARE_TEAM:
            return doCareTeam(state, action);
        case actionTypes.CONDITION:
            return doCondition(state, action);
        case actionTypes.OBSERVATION:
            return doObservation(state, action);
        default:
            return state;
    }
};

export default reducer;
