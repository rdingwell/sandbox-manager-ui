import fhirInitState from "../../redux/reducers/fhir/init";
import * as React from "react";

import getMuiTheme from "material-ui/styles/getMuiTheme";

export default class InitLoader extends React.Component {
    componentDidMount () {
        if (this.props.location.pathname !== "/launchApp") {
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
            smart && this.props.fhirauth_setSmart(smart, this.props.history);

            // Initialize the app
            this.init();
        }
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
