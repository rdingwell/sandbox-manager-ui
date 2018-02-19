import * as actionTypes from './actionTypes';
import * as FHIR from 'fhirclient/fhir-client';  //the console says this is unused, but without it, your queries will fail


const lookupCarePlanStart = () => {
    return {
        type: actionTypes.LOOKUP_CARE_PLAN_START
    }
};

export const lookupCarePlanFail = (error) => {
    return{
        type: actionTypes.LOOKUP_CARE_PLAN_FAIL,
        error: error
    }
};

export const saveCarePlan = (carePlan) => {
    return{
        type: actionTypes.LOOKUP_CARE_PLAN_SUCCESS,
        carePlan: carePlan
    }
};

export const fetchCarePlan = (patient) => {
    return(dispatch) => {
        dispatch(lookupCarePlanStart());
        const searchParams = {type: 'CarePlan', count: 1, query: {subject: 'Patient/'+ patient.id}};

        window.fhirClient.api.search(searchParams)
            .then(response => {
                const resourceResults = [];
                if(response.data.total > 0 && response.data.entry){
                    response.data.entry.forEach(function (element) {
                        element.resource.fullUrl = element.fullUrl;
                        resourceResults.push(element.resource);
                    });
                }
                dispatch(saveCarePlan(resourceResults));
            }).fail(error => {
            dispatch(lookupCarePlanFail(error));
        });
    }
};

