import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    oauthUser : {
        sbmUserId: null,
        email: null, 
        name: null
    },
    user : null,
    pendingUsers: [
        {
            id:4,
            invitee:
                {id:4,
                    createdTimestamp:1513379581000,
                    email:"test@email.com",
                    sbmUserId:null,
                    name:null,
                    systemRoles:[],
                    sandboxes:[],
                    hasAcceptedLatestTermsOfUse:null,
                    termsOfUseAcceptances:[]
                },
            invitedBy:
                {
                    id:1,
                    createdTimestamp:1489617608000,
                    email:"admin",
                    sbmUserId:"90342.ASDFJWFA",
                    name:"Demo Admin",
                    systemRoles:["ADMIN","CREATE_SANDBOX"],
                    sandboxes:
                        [
                            {
                                id:1,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1489617966000,
                                visibility:"PRIVATE",
                                sandboxId:"hspc1",
                                name:"HSPC Sandbox v1",
                                description:"HSPC Development Sandbox v1",
                                apiEndpointIndex:"1",
                                fhirServerEndPoint:null,
                                allowOpenAccess:true
                            },
                            {
                                id:2,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1489618010000,
                                visibility:"PRIVATE",
                                sandboxId:"hspc4",
                                name:"HSPC Sandbox v4",
                                description:"HSPC Development Sandbox v4",
                                apiEndpointIndex:"4",
                                fhirServerEndPoint:null,
                                allowOpenAccess:true
                            },
                            {
                                id:3,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1512789158000,
                                visibility:"PRIVATE",
                                sandboxId:"dec8",
                                name:"Dec 8 Sandbox",
                                description:"",
                                apiEndpointIndex:"6",
                                fhirServerEndPoint:null,
                                allowOpenAccess:false
                            },
                            {
                                id:6,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1513379551000,
                                visibility:"PRIVATE",
                                sandboxId:"doit",
                                name:"ad",
                                description:"",
                                apiEndpointIndex:"6",
                                fhirServerEndPoint:null,
                                allowOpenAccess:false
                            },
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
                                sandboxId:"blah",
                                name:"blah",
                                description:"",
                                apiEndpointIndex:"6",
                                fhirServerEndPoint:null,
                                allowOpenAccess:false
                            }
                        ],
                        hasAcceptedLatestTermsOfUse:true,
                        termsOfUseAcceptances:[]
                },
            sandbox:
                {
                    id:6,
                    createdBy:
                        {
                            id:1,
                            createdTimestamp:1489617608000,
                            email:"admin",
                            sbmUserId:"90342.ASDFJWFA",
                            name:"Demo Admin",
                            hasAcceptedLatestTermsOfUse:true
                        },
                    createdTimestamp:1513379551000,
                    visibility:"PRIVATE",
                    sandboxId:"doit",
                    name:"ad",
                    description:"",
                    apiEndpointIndex:"6",
                    fhirServerEndPoint:null,
                    allowOpenAccess:false
                },
            status:"PENDING"
        },
        {
            id:5,
            invitee:
                {
                    id:5,
                    createdTimestamp:1514763108000,
                    email:"email@email.com",
                    sbmUserId:null,
                    name:null,
                    systemRoles:[],
                    sandboxes:[],
                    hasAcceptedLatestTermsOfUse:null,
                    termsOfUseAcceptances:[]
                },
            invitedBy:
                {
                    id:1,
                    createdTimestamp:1489617608000,
                    email:"admin",
                    sbmUserId:"90342.ASDFJWFA",
                    name:"Demo Admin",
                    systemRoles:["ADMIN","CREATE_SANDBOX"],
                    sandboxes:
                        [
                            {
                                id:1,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1489617966000,
                                visibility:"PRIVATE",
                                sandboxId:"hspc1",
                                name:"HSPC Sandbox v1",
                                description:"HSPC Development Sandbox v1",
                                apiEndpointIndex:"1",
                                fhirServerEndPoint:null,
                                allowOpenAccess:true
                            },
                            {
                                id:2,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1489618010000,
                                visibility:"PRIVATE",
                                sandboxId:"hspc4",
                                name:"HSPC Sandbox v4",
                                description:"HSPC Development Sandbox v4",
                                apiEndpointIndex:"4",
                                fhirServerEndPoint:null,
                                allowOpenAccess:true
                            },
                            {
                                id:3,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1512789158000,
                                visibility:"PRIVATE",
                                sandboxId:"dec8",
                                name:"Dec 8 Sandbox",
                                description:"",
                                apiEndpointIndex:"6",
                                fhirServerEndPoint:null,
                                allowOpenAccess:false
                            },
                            {
                                id:6,
                                createdBy:
                                    {
                                        id:1,
                                        createdTimestamp:1489617608000,
                                        email:"admin",
                                        sbmUserId:"90342.ASDFJWFA",
                                        name:"Demo Admin",
                                        hasAcceptedLatestTermsOfUse:true
                                    },
                                createdTimestamp:1513379551000,
                                visibility:"PRIVATE",
                                sandboxId:"doit",
                                name:"ad",
                                description:"",
                                apiEndpointIndex:"6",
                                fhirServerEndPoint:null,
                                allowOpenAccess:false
                            },
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
                                sandboxId:"blah",
                                name:"blah",
                                description:"",
                                apiEndpointIndex:"6",
                                fhirServerEndPoint:null,
                                allowOpenAccess:false
                            }
                            ],
                    hasAcceptedLatestTermsOfUse:true,
                    termsOfUseAcceptances:[]
                },
            sandbox:
                {
                    id:6,
                    createdBy:
                        {
                            id:1,
                            createdTimestamp:1489617608000,
                            email:"admin",
                            sbmUserId:"90342.ASDFJWFA",
                            name:"Demo Admin",
                            hasAcceptedLatestTermsOfUse:true
                        },
                    createdTimestamp:1513379551000,
                    visibility:"PRIVATE",
                    sandboxId:"doit",
                    name:"ad",
                    description:"",
                    apiEndpointIndex:"6",
                    fhirServerEndPoint:null,
                    allowOpenAccess:false
                },
            status:"PENDING"
        }],
    rejectedUsers: [],
};

const inviteNewUser = (state, action) => {
    return state;
};

const saveOauthUser = (state, action) => {
    const user = {...state.oauthUser};
    user.sbmUserId = action.sbmUserId;
    user.email = action.email;
    user.name = action.name;
    localStorage.setItem("oauthUser", JSON.stringify(user));
    return updateObject(state, {oauthUser: user})
};

const saveUser = (state, action) => {
    return updateObject(state, {user: action.user})
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.INVITE_NEW_USER:
            return inviteNewUser(state, action);
        case actionTypes.SAVE_OAUTH_USER:
            return saveOauthUser(state, action);
        case actionTypes.SAVE_SANDBOX_USER:
            return saveUser(state, action);
        default: return state;
    }
};

export default reducer;