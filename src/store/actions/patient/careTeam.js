import * as actionTypes from '../actionTypes';
import * as FHIR from 'fhirclient/fhir-client';  //the console says this is unused, but without it, your queries will fail


const lookupCareTeamStart = () => {
    return {
        type: actionTypes.LOOKUP_CARE_TEAM_START
    }
};

export const lookupCareTeamFail = (error) => {
    return{
        type: actionTypes.LOOKUP_CARE_TEAM_FAIL,
        error: error
    }
};

export const saveCareTeam = (careTeam) => {
    return{
        type: actionTypes.LOOKUP_CARE_TEAM_SUCCESS,
        careTeam: careTeam
    }
};

export const fetchCareTeam = (patient) => {
    return(dispatch) => {
        dispatch(lookupCareTeamStart());
        const searchParams = {type: 'CareTeam', count: 1, query: {subject: 'Patient/'+ patient.id}};

        window.fhirClient.api.search(searchParams)
            .then(response => {
                const resourceResults = [];
                if(response.data.total > 0 && response.data.entry){
                    response.data.entry.forEach(function (element) {
                        element.resource.fullUrl = element.fullUrl;
                        resourceResults.push(element.resource);
                    });
                }
                dispatch(saveCareTeam(resourceResults));
            }).fail(error => {
            dispatch(lookupCareTeamFail(error));
        });
    }
};

