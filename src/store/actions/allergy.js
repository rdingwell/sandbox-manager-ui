import * as actionTypes from './actionTypes';
import * as FHIR from 'fhirclient/fhir-client';  //the console says this is unused, but without it, your queries will fail


const lookupAllergyIntoleranceStart = () => {
    return {
        type: actionTypes.LOOKUP_ALLERGY_INTOLERANCE_START
    }
};

export const lookupAllergyIntoleranceFail = (error) => {
    return{
        type: actionTypes.LOOKUP_ALLERGY_INTOLERANCE_FAIL,
        error: error
    }
};

export const saveAllergyIntolerance = (allergyIntolerance) => {
    return{
        type: actionTypes.LOOKUP_ALLERGY_INTOLERANCE_SUCCESS,
        allergyIntolerance: allergyIntolerance
    }
};

export const fetchAllergyIntolerance = (patient) => {
    return(dispatch) => {
        dispatch(lookupAllergyIntoleranceStart());
        const searchParams = {type: 'AllergyIntolerance', count: 1, query: {patient: 'Patient/'+ patient.id}};

        window.fhirClient.api.search(searchParams)
            .then(response => {
                const resourceResults = [];
                if(response.data.total > 0 && response.data.entry){
                    debugger
                    response.data.entry.forEach(function (element) {
                        element.resource.fullUrl = element.fullUrl;
                        resourceResults.push(element.resource);
                    });
                }
                dispatch(saveAllergyIntolerance(resourceResults));
            }).fail(error => {
            dispatch(lookupAllergyIntoleranceFail(error));
        });
    }
};

