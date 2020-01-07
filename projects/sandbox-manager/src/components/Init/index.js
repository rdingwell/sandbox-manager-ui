import * as React from "react";

import {createMuiTheme} from '@material-ui/core';

export default class InitLoader extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the app
        this.init();

        this.state = {};
    }

    componentDidMount() {
        if (this.props.location.pathname !== "/launchApp" && this.props.location.pathname !== "/after-auth" && this.props.location.pathname !== "/") {
            window.FHIR.oauth2.ready(
                (smart) => {
                    Promise.resolve()
                        .then(() => {
                            this.props.fhir_Reset();
                            this.props.fhir_SetSmart({status: "ready", data: smart});
                        });
                }
            );

            let smart = this.props.fhir.smart.data.server ? FHIR.client(this.props.fhir.smart.data.server) : null;
            smart && setTimeout(this.props.fhirauth_setSmart(smart, this.props.history), 1000);
        }
    }

    render() {
        return null;
    }

    // Application initialization process
    init() {
        return Promise.resolve()
            // (1) Customize theme
            .then(() => this.props.ui_SetTheme(createMuiTheme(this.props.customizeTheme(this.props.ui.theme))))
            // (2) Retina display detection
            .then(() => this.props.ui_SetRetina())
            // (3) Reset `config` Redux reducer
            .then(() => this.props.config_Reset())
            // (4) Load external settings
            .then(() => this.props.config_LoadXsettings());
    }
}
