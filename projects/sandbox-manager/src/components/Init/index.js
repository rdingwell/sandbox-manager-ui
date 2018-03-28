import fhirInitState from "../../redux/reducers/fhir/init";

import * as React from "react";
import * as PropTypes from "prop-types";

import getMuiTheme from "material-ui/styles/getMuiTheme";

export default class InitLoader extends React.Component {
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
            }
        );

        let smart = this.props.fhir.smart.data.server ? FHIR.client(this.props.fhir.smart.data.server) : null;
        smart && this.props.fhirauth_setSmart(smart);

        // Initialize the app
        this.init();
    }

    render () {
        return null;
    }

    // Application initialization process
    init () {
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
}

InitLoader.propTypes = {
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
}
