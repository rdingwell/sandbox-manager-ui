export default {
    hooks: [
        {
            id: "patient-greeting",
            title: "Patient greeting",
            description: "Display which patient the user is currently working with",
            hook: "patient-view",
            url: "https://fhir-org-cds-services.appspot.com/cds-services",
            prefetch: {
                patient: "Patient/{{context.patientId}}"
            }
        },
        {
            id: "cms-price-check",
            title: "CMS Pricing Service",
            url: "https://fhir-org-cds-services.appspot.com/cds-services",
            description: "Determine if an authored prescription has a cheaper alternative to switch to and display pricing",
            hook: "medication-prescribe"
        },
        {
            id: "demo-suggestion-card",
            hook: "patient-view",
            title: "Demo Suggestion Card",
            url: "https://bilirubin-cdshooks.hspconsortium.org/cds-services",
            description: "Sends a Demo Suggestion Card"
        },
        {
            id: "bilirubin-cds-hook",
            hook: "patient-view",
            title: "Bilirubin CDS Hooks ExecutableService",
            url: "https://bilirubin-cdshooks.hspconsortium.org/cds-services",
            description: "Detects issues with infants and the Kernicterus risk protocol",
            prefetch: {
                patient: "Patient/{{context.patientId}}",
                observations: `Observation?patient={{context.patientId}}&code=58941-6&_sort:desc=date&_count=1`
            }
        },
        {
            id: "demo-app-link-card",
            hook: "patient-view",
            title: "Demo Application Link Card",
            url: "https://bilirubin-cdshooks.hspconsortium.org/cds-services",
            description: "Sends a Demo Application Link Card"
        },
        {
            id: "demo-info-card",
            hook: "patient-view",
            title: "Demo Info Card",
            url: "https://bilirubin-cdshooks.hspconsortium.org/cds-services",
            description: "Sends a Demo Info Card"
        }
    ]
}
