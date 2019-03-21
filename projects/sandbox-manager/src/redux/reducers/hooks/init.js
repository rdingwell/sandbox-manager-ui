export default {
    hooks: [
        {
            title: 'Sample CDS hooks',
            url: "https://fhir-org-cds-services.appspot.com/cds-services",
            hooks: [
                {
                    id: "patient-greeting",
                    title: "Patient greeting",
                    description: "Display which patient the user is currently working with",
                    hook: "patient-view",
                    prefetch: {
                        patient: "Patient/{{context.patientId}}"
                    }
                },
                {
                    id: "cms-price-check",
                    title: "CMS Pricing Service",
                    description: "Determine if an authored prescription has a cheaper alternative to switch to and display pricing",
                    hook: "medication-prescribe"
                }
            ]
        },
        {
            title: 'Sample Bilirubin CDS HOOKS',
            url: 'https://bilirubin-cdshooks.hspconsortium.org/cds-services',
            hooks: [
                {
                    id: "demo-suggestion-card",
                    hook: "patient-view",
                    title: "Demo Suggestion Card",
                    description: "Sends a Demo Suggestion Card"
                },
                {
                    id: "bilirubin-cds-hook",
                    hook: "patient-view",
                    title: "Bilirubin CDS Hooks ExecutableService",
                    description: "Detects issues with infants and the Kernicterus risk protocol",
                    prefetch: {
                        patient: "Patient/{{context.patientId}}",
                        observations: `Observation?patient={{context.patientId}}&code=http://loinc.org|58941-6&_sort:desc=date&_count=1`
                    }
                },
                {
                    id: "demo-app-link-card",
                    hook: "patient-view",
                    title: "Demo Application Link Card",
                    description: "Sends a Demo Application Link Card"
                },
                {
                    id: "demo-info-card",
                    hook: "patient-view",
                    title: "Demo Info Card",
                    description: "Sends a Demo Info Card"
                }
            ]
        }
    ],
    cards: [],
    hookContexts: {
        'patient-view': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        },
        'medication-prescribe': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            medications: {
                required: true,
                title: 'Medications',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    }
                }
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        }
    }
}
