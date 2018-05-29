export default {
    context: [],
    customSearchResults: null,
    parsed: {
        needPatientBanner: true,
        patientDemographics: {
            status: "pending",
            data: {
                birthDate: "",
                gender: "",
                MRN: "",
                name: "",
                smartId: "",
                address: [],
                email: [],
                names: [],
                phone: [],
            },
        },
    },
    smart: {
        status: "",
        data: {},
    },
    meta: {
        status: "",
        parsed: {},
        raw: {},
    },
};
