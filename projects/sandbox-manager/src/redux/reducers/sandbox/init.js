export default {
    loading: false,
    selectedSandbox : '',
    sandboxes : [],
    invitations : [],
    launchScenarios : [],
    invitesLoading: false,
    creatingSandbox: false,
    createSandboxError: '',
    lookingForSandbox: false,
    launchScenariosLoading: false,
    launchScenarioCreating: false,
    launchScenarioDeleting: false,
    lookingForSandboxError: '',
    defaultUser: undefined,
    lookupSandbox: '',
    sandboxApiEndpointIndexes : [
        {index: "1", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: false, supportsDataSets: false},
        {index: "2", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: false, supportsDataSets: false},
        {index: "3", name: "FHIR STU 3 (v1.8.0)", fhirVersion: "1.8.0", fhirTag: "1_8_0", altName: "FHIR v1.8", canCreate: false, supportsDataSets: false},
        {index: "4", name: "FHIR STU 3 (v3.0.1)", fhirVersion: "3.0.1", fhirTag: "3_0_1", altName: "FHIR v3.0.1", canCreate: false, supportsDataSets: true},
        {index: "5", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: false, supportsDataSets: false},
        {index: "6", name: "FHIR STU 3 (v3.0.1)", fhirVersion: "3.0.1", fhirTag: "3_0_1", altName: "FHIR v3.0.1", canCreate: true, supportsDataSets: true}
    ],
    sandboxApiEndpointIndex: null
}
