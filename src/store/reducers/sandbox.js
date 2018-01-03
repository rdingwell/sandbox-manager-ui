import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../utility";

const initialState = {
    selectedSandbox : '',
        sandboxes : [
            {
                id:7,
                createdBy:
                    {
                        id:1,
                        createdTimestamp:1489617608000,
                        email:"admin",
                        sbmUserId:"90342.ASDFJWFA",
                        name:"Demo Admin",
                        hasAcceptedLatestTermsOfUse:true
                    },
                createdTimestamp:1514332333000,
                visibility:"PRIVATE",
                sandboxId:"sandbox1",
                name:"First Sandbox",
                description:"",
                apiEndpointIndex:"6",
                fhirServerEndPoint:null,
                allowOpenAccess:false
            },
            {
                id:8,
                createdBy:
                    {
                        id:1,
                        createdTimestamp:1489617608000,
                        email:"admin",
                        sbmUserId:"90342.ASDFJWFA",
                        name:"Demo Admin",
                        hasAcceptedLatestTermsOfUse:true
                    },
                createdTimestamp:1514332333000,
                visibility:"PRIVATE",
                sandboxId:"sandbox2",
                name:"Second Sandbox",
                description:"",
                apiEndpointIndex:"6",
                fhirServerEndPoint:null,
                allowOpenAccess:false

            },
            {
                id:9,
                createdBy:
                    {
                        id:1,
                        createdTimestamp:1489617608000,
                        email:"admin",
                        sbmUserId:"90342.ASDFJWFA",
                        name:"Demo Admin",
                        hasAcceptedLatestTermsOfUse:true
                    },
                createdTimestamp:1514332333000,
                visibility:"PRIVATE",
                sandboxId:"sandbox3",
                name:"Third Sandbox",
                description:"",
                apiEndpointIndex:"6",
                fhirServerEndPoint:null,
                allowOpenAccess:false

            }
        ]
};

const selectSandbox = (state, action) => {
    return updateObject(state, {selectedSandbox : action.sandboxId});
}

const removeSandbox = (state, action) => {
    const sandboxes = state.sandboxes.filter(sandbox => sandbox.id !== action.sandboxId);
    return updateObject(state, {sandboxes : sandboxes});
};

const updateSandbox = (state, action) => {
    const sandbox = {...state.sandboxes.filter((s) => s.sandboxId === state.selectedSandbox)[0]};
    sandbox.name = action.sandboxDetails.name;
    sandbox.description = action.sandboxDetails.description;
    sandbox.allowOpenAccess = action.sandboxDetails.allowOpenAccess;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[index].sandboxId === state.selectedSandbox) {
            ind = index;
            break;
        }
    }

    const updatedSandboxes = [
        ...state.sandboxes.slice(0, ind),
        sandbox,
        ...state.sandboxes.slice(ind + 1)
    ];
    return updateObject(state, {sandboxes: updatedSandboxes})
};

const reducer = (state = initialState, action) => {

    switch(action.type){
        case actionTypes.GET_SANDBOX :
            return state.sandboxes.filter(sandbox => sandbox.id === state.selectedSandbox);
        case actionTypes.DELETE_SANDBOX :
            return removeSandbox(state, action);
        case actionTypes.UPDATE_SANDBOX :
        case actionTypes.RESET_SANDBOX :
            return updateObject(state, updateSandbox(state, action));
        case actionTypes.SELECT_SANDBOX:
            return selectSandbox(state, action);
        default:
            return state;
    }
};

export default reducer;