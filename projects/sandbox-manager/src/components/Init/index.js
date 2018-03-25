import * as jwtDecode from "jwt-decode";
import fhirInitState from "../../redux/reducers/fhir/init";

import * as React from "react";
import * as PropTypes from "prop-types";

import getMuiTheme from "material-ui/styles/getMuiTheme";

export default class InitLoader extends React.Component {
    static propTypes = {
        config: PropTypes.object.isRequired,
        fhir: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired,

        config_LoadXsettings: PropTypes.func.isRequired,
        config_Reset: PropTypes.func.isRequired,
        customizeTheme: PropTypes.func.isRequired,
        delay: PropTypes.func.isRequired,
        fhir_Reset: PropTypes.func.isRequired,
        fhir_SetContext: PropTypes.func.isRequired,
        fhir_SetMeta: PropTypes.func.isRequired,
        fhir_SetParsedPatientDemographics: PropTypes.func.isRequired,
        fhir_SetSampleData: PropTypes.func.isRequired,
        fhir_SetSmart: PropTypes.func.isRequired,
        getFHIRMetadata: PropTypes.func.isRequired,
        getPatientDemographics: PropTypes.func.isRequired,
        ui_SetInitialized: PropTypes.func.isRequired,
        ui_SetRetina: PropTypes.func.isRequired,
        ui_SetTheme: PropTypes.func.isRequired
    };

    componentDidMount () {
        window.FHIR.oauth2.ready(
            (smart) => {
                Promise.resolve()
                    .then(() => {
                        this.props.fhir_Reset();
                        this.props.fhir_SetSmart({ status: "ready", data: smart });
                    })
                    .then(() => process.env.NODE_ENV !== "production");
            },
            () => {
                Promise.resolve()
                    .then(() => {
                        this.props.fhir_Reset();
                        this.props.fhir_SetSmart({ status: "error", data: fhirInitState.smart.data });
                        this.props.fhir_SetSampleData();
                    })
                    .then(() => process.env.NODE_ENV !== "production");
            },
        );

        // Initialize the app
        this.init();
    }

    componentDidUpdate (prevProps) {
        if (prevProps.fhir.smart.status !== "ready" && this.props.fhir.smart.status === "ready") {
            const smart = this.props.fhir.smart.data;
            Promise.resolve()
            // Download the patient's demographics
                .then(() => this.props.getPatientDemographics(smart))
                .then((res) => this.props.fhir_SetParsedPatientDemographics(res))
                // Download the FHIR Server capabilities
                .then(() => this.props.getFHIRMetadata(smart))
                .then((res) => this.props.fhir_SetMeta(res))
                // Set context
                .then(() => this.props.fhir_SetContext(this.getContext(smart)));
        }

        const demoMode = this.props.fhir.smart.status === "demo-mode";
        const isCompleted =
            this.props.config.xsettings.status === "ready" && (this.props.fhir.smart.status === "ready" || demoMode) &&
            this.props.fhir.parsed.patientDemographics.status === "ready" && (this.props.fhir.meta.status === "ready" || demoMode);
        if (isCompleted && !this.props.ui.initialized && !prevProps.ui.initialized) {
            this.props.delay(150).then(() => this.props.ui_SetInitialized());
        }
    }

    render () {
        return null;
    }

    // Application initialization process
    init = () => {
        return Promise.resolve()
        // (1) Customize theme
            .then(() => this.props.ui_SetTheme(getMuiTheme(this.props.customizeTheme(this.props.ui.theme))))
            // (2) Retina display detection
            .then(() => this.props.ui_SetRetina())
            // (3) Reset `config` Redux reducer
            .then(() => this.props.config_Reset())
            // (4) Load external settings
            .then(() => this.props.config_LoadXsettings());
    }

    getContext (smart) {
        const tokenResponse = smart.tokenResponse;
        const result = [];
        if (tokenResponse.id_token) {
            const decoded = jwtDecode(tokenResponse.id_token);
            // console.log("::: tokenResponse.id_token(decoded):",decoded);
            if (decoded.profile) {
                result.push(decoded.profile.split("/")[ 0 ]);
            } else {
                console.warn("::: Profile data not found in token response:", JSON.stringify(decoded, null, 2));
            }
        }
        if (tokenResponse.patient) {
            result.push("Patient");
        }
        return result;
    }
}
