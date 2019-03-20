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
    cards: []
}
