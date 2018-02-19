import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    allergyLoading: false,
    allergyError: null,
    allergyIntolerance: [],
    allergyCount: 0,
    loadingCarePlan: false,
    carePlanError: null,
    carePlan: [],
    carePlanCount: 0,
    loadingCareTeam: false,
    careTeam: [],
    careTeamCount: 0,
    loadingCondition: false,
    condition: [],
    conditionError: null,
    conditionCount: 0,
    loadingObservation: false,
    observation: [],
    observationError: null,
    observationCount: 0
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
        allergyIntolerance: action.data.data,
        allergyCount: action.data.total,
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
        carePlan: action.data.data,
        carePlanCount: action.data.total
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
        careTeam: action.data.data,
        careTeamCOunt: action.data.total
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
        condition: action.data.data,
        conditionCount: action.data.total
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
        observation: action.data.data,
        observationCount: action.data.total
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
