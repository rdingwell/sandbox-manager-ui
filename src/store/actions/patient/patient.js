import * as actionTypes from '../actionTypes';
import * as FHIR from 'fhirclient/fhir-client';  //the console says this is unused, but without it, your queries will fail


const getType = (type) => {
    switch(type){
        case 'AllergyIntolerance' :
            return actionTypes.ALLERGY_INTOLERANCE;
        case 'CarePlan':
            return actionTypes.CARE_PLAN;
        case 'CareTeam':
            return actionTypes.CARE_TEAM;
        case 'Condition':
            return actionTypes.CONDITION;
        case 'Observation':
            return actionTypes.OBSERVATION;
        default:
            return '';
    }
};

export const lookupStart = (type) => {
    return {
        type: getType(type),
        action: 'start'
    }
};

export const lookupFail = (type, error) => {
  return {
      type: getType(type),
      action: 'fail',
      error: error
  }
};

export const save = (type, data) => {
    return{
        type: getType(type),
        action: 'save',
        data: data
    }
};

export const fetch = (patient, resourceType) => {
    return(dispatch) => {
        dispatch(lookupStart(resourceType));
        const resources = JSON.parse(localStorage.getItem('resources'));
        let type = '';
        let patientSearch = '';

        for (const resource of resources) {
            if (resource.resourceType.includes(resourceType)){
                type = resource.resourceType;
                patientSearch = resource.patientSearch;
            }
        }

        const query = {};
        query[patientSearch] = 'Patient/'+ patient.id;

        const searchParams =
            {
                type: type,
                count: 1,
                query: query
            };

        window.fhirClient.api.search(searchParams)
            .then(response => {
                const resourceResults = [];
                if(response.data.total > 0 && response.data.entry){
                    response.data.entry.forEach(function (element) {
                        element.resource.fullUrl = element.fullUrl;
                        resourceResults.push(element.resource);
                    });
                }
                let resource = {
                    total: response.data.total,
                    data: resourceResults
                };
                dispatch(save(resourceType, resource));
            }).fail(error => {
            dispatch(save(resourceType, error));
        });
    }
};