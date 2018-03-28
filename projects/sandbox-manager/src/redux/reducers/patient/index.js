import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default ( state = initialState, action ) => {
    state = Object.assign({}, state);

    switch ( action.type ) {
        case actionTypes.ALLERGY_INTOLERANCE:
            return doAllergyIntolerance(state, action);
        case actionTypes.CARE_PLAN:
            return doCarePlan(state, action);
        case actionTypes.CARE_TEAM:
            return doCareTeam(state, action);
        case actionTypes.CONDITION:
            return doCondition(state, action);
        case actionTypes.DIAGNOSTIC_REPORT:
            return doDiagnosticReport(state, action);
        case actionTypes.OBSERVATION:
            return doObservation(state, action);
        case actionTypes.ENCOUNTER:
            return doEncounter(state, action);
        case actionTypes.GOAL:
            return doGoal(state, action);
        case actionTypes.IMMUNIZATION:
            return doImmunization(state, action);
        case actionTypes.MEDICATION_DISPENSE:
            return doMedicationDispsnse(state, action);
        case actionTypes.MEDICATION_REQUEST:
            return doMedicationRequest(state, action);
        case actionTypes.PROCEDURE:
            return doProcedure(state, action);
        case actionTypes.PROCEDURE_REQUEST:
            return doProcedureRequest(state, action);
        case actionTypes.LOOKUP_PATIENTS_START:
            state.lookingForPatients = true;
            state.lookingForPatientsError = null;
            break;
        case actionTypes.LOOKUP_PATIENTS_FAIL:
            state.lookingForPatients = false;
            state.lookingForPatientsError = action.error;
            break;
        case actionTypes.LOOKUP_PATIENTS_SUCCESS:
            state.patients = action.patients;
            state.lookingForPatients = false;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.patient : state;
            break;
    }

    return state;
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
    Diagnostic Report
*/
const lookupDiagnosticReportStart = (state) => {
    return updateObject(state, {
        loadingDiagnosticReport: true,
        diagnosticReportError: null
    });
};

const lookupDiagnosticReportFail = (state, action) => {
    return updateObject(state, {
        loadingDiagnosticReport: false,
        diagnosticReportError: action.error
    });
};

const lookupDiagnosticReportSave = (state, action) => {
    return updateObject(state, {
        loadingDiagnosticReport: false,
        diagnosticReport: action.data.data,
        diagnosticReportCount: action.data.total
    });
};

const doDiagnosticReport = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupDiagnosticReportStart(state);
        case 'fail':
            return lookupDiagnosticReportFail(state, action);
        case 'save':
            return lookupDiagnosticReportSave(state, action);
        default:
            return state;
    }
};
/*
    End Diagnostic Report
 */


/*
    Encounter
*/
const lookupEncounterStart = (state) => {
    return updateObject(state, {
        loadingEncounter: true,
        encounterError: null
    });
};

const lookupEncounterFail = (state, action) => {
    return updateObject(state, {
        loadingEncounter: false,
        encounterError: action.error
    });
};

const lookupEncounterSave = (state, action) => {
    return updateObject(state, {
        loadingEncounter: false,
        encounter: action.data.data,
        encounterCount: action.data.total
    });
};

const doEncounter = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupEncounterStart(state);
        case 'fail':
            return lookupEncounterFail(state, action);
        case 'save':
            return lookupEncounterSave(state, action);
        default:
            return state;
    }
};
/*
    End Encounter
 */

/*
    Goal
*/
const lookupGoalStart = (state) => {
    return updateObject(state, {
        loadingGoal: true,
        goalError: null
    });
};

const lookupGoalFail = (state, action) => {
    return updateObject(state, {
        loadingGoal: false,
        goalError: action.error
    });
};

const lookupGoalSave = (state, action) => {
    return updateObject(state, {
        loadingGoal: false,
        goal: action.data.data,
        goalCount: action.data.total
    });
};

const doGoal = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupGoalStart(state);
        case 'fail':
            return lookupGoalFail(state, action);
        case 'save':
            return lookupGoalSave(state, action);
        default:
            return state;
    }
};
/*
    End Goal
 */


/*
    Immunization
*/
const lookupImmunizationStart = (state) => {
    return updateObject(state, {
        loadingImmunization: true,
        immunizationError: null
    });
};

const lookupImmunizationFail = (state, action) => {
    return updateObject(state, {
        loadingImmunization: false,
        immunizationError: action.error
    });
};

const lookupImmunizationSave = (state, action) => {
    return updateObject(state, {
        loadingImmunization: false,
        immunization: action.data.data,
        immunizationCount: action.data.total
    });
};

const doImmunization = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupImmunizationStart(state);
        case 'fail':
            return lookupImmunizationFail(state, action);
        case 'save':
            return lookupImmunizationSave(state, action);
        default:
            return state;
    }
};
/*
    End Immunization
 */


/*
    Medication Dispense
*/
const lookupMedicationDispenseStart = (state) => {
    return updateObject(state, {
        loadingMedicationDispense: true,
        medicationDispenseError: null
    });
};

const lookupMedicationDispenseFail = (state, action) => {
    return updateObject(state, {
        loadingMedicationDispense: false,
        medicationDispenseError: action.error
    });
};

const lookupMedicationDispenseSave = (state, action) => {
    return updateObject(state, {
        loadingMedicationDispense: false,
        medicationDispense: action.data.data,
        medicationDispenseCount: action.data.total
    });
};

const doMedicationDispsnse = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupMedicationDispenseStart(state);
        case 'fail':
            return lookupMedicationDispenseFail(state, action);
        case 'save':
            return lookupMedicationDispenseSave(state, action);
        default:
            return state;
    }
};
/*
    End Medication Dispense
 */

/*
    Medication Request
*/
const lookupMedicationRequestStart = (state) => {
    return updateObject(state, {
        loadingMedicationRequest: true,
        medicationRequestError: null
    });
};

const lookupMedicationRequestFail = (state, action) => {
    return updateObject(state, {
        loadingMedicationRequest: false,
        medicationRequestError: action.error
    });
};

const lookupMedicationRequestSave = (state, action) => {
    return updateObject(state, {
        loadingMedicationRequest: false,
        medicationRequest: action.data.data,
        medicationRequestCount: action.data.total
    });
};

const doMedicationRequest = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupMedicationRequestStart(state);
        case 'fail':
            return lookupMedicationRequestFail(state, action);
        case 'save':
            return lookupMedicationRequestSave(state, action);
        default:
            return state;
    }
};
/*
    End Medication Request
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

/*
    Procedure
*/
const lookupProcedureStart = (state) => {
    return updateObject(state, {
        loadingProcedure: true,
        procedureError: null
    });
};

const lookupProcedureFail = (state, action) => {
    return updateObject(state, {
        loadingProcedure: false,
        procedureError: action.error
    });
};

const lookupProcedureSuccess = (state, action) => {
    return updateObject(state, {
        loadingProcedure: false,
        procedure: action.data.data,
        procedureCount: action.data.total
    });
};

const doProcedure = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupProcedureStart(state);
        case 'fail':
            return lookupProcedureFail(state, action);
        case 'save':
            return lookupProcedureSuccess(state, action);
        default:
            return state;
    }
};
/*
    End Procedure
 */

/*
    Procedure Request
*/
const lookupProcedureRequestStart = (state) => {
    return updateObject(state, {
        loadingProcedureRequest: true,
        procedureRequestError: null
    });
};

const lookupProcedureRequestFail = (state, action) => {
    return updateObject(state, {
        loadingProcedureRequest: false,
        procedureRequestError: action.error
    });
};

const lookupProcedureRequestSuccess = (state, action) => {
    return updateObject(state, {
        loadingProcedureRequest: false,
        procedureRequest: action.data.data,
        procedureRequestCount: action.data.total
    });
};

const doProcedureRequest = (state, action) => {
    switch(action.action){
        case 'start':
            return lookupProcedureRequestStart(state);
        case 'fail':
            return lookupProcedureRequestFail(state, action);
        case 'save':
            return lookupProcedureRequestSuccess(state, action);
        default:
            return state;
    }
};
/*
    End Procedure Request
 */
