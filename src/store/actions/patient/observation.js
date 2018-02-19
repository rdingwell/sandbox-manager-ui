import * as actionTypes from '../actionTypes';
import * as FHIR from 'fhirclient/fhir-client';  //the console says this is unused, but without it, your queries will fail


export const lookupObservationStart = () => {
    return {
        type: actionTypes.LOOKUP_OBSERVATION_START
    }
};

export const lookupObservationFail = (error) => {
    return{
        type: actionTypes.LOOKUP_OBSERVATION_FAIL,
        error: error
    }
};

export const saveObservations = (observations) => {
    return{
        type: actionTypes.LOOKUP_OBSERVATION_SUCCESS,
        observations: observations
    }
};

export const fetchObservations = (patient) => {
    return(dispatch) => {
        dispatch(lookupObservationStart());
        const searchParams = {type: 'Observation', count: 1, query: {subject: 'Patient/'+ patient.id}};

        window.fhirClient.api.search(searchParams)
            .then(response => {
                const resourceResults = [];
                if(response.data.total > 0 && response.data.entry){
                    response.data.entry.forEach(function (element) {
                        element.resource.fullUrl = element.fullUrl;
                        resourceResults.push(element.resource);
                    });
                }
                dispatch(saveObservations(resourceResults));
            }).fail(error => {
            dispatch(lookupObservationFail(error));
        });
    }
};