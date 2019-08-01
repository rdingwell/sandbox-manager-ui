import React, { Component, Fragment } from 'react';

import Patient from "svg-react-loader?name=Patient!../../../assets/icons/patient.svg";

import './index.less';

let launched = false;

export default class LaunchApp extends Component {
    constructor (props) {
        super(props);

        this.state = {};
    }

    componentDidMount () {
        // A hack to get around the window popup behavior in modern web browsers
        let key = window.location.search.slice(1);
        if (!(key in window.localStorage)) {
            console.log('Failed to launch app -- no launch key.');
        }

        let onStorage = () => {
            let details = null;
            try {
                details = JSON.parse(window.localStorage[key]);
                if (!details || launched || details.status === 'requested-launch') {
                    return;
                }

                // Session storage is inherited from opening window, so
                // we need to purge the tokenResponse here to avoid passing
                // the Sandbox Manager's token credentials to the app
                delete sessionStorage.tokenResponse;

                if (details.app.launchUri.lastIndexOf("?") > -1) {
                    details.app.launchUri = details.app.launchUri + "&"
                } else {
                    details.app.launchUri = details.app.launchUri + "?"
                }

                if (!details.embedded) {
                    launched = true;
                    window.localStorage.removeItem(key);

                    window.location = details.app.launchUri +
                        'iss=' + encodeURIComponent(details.iss) +
                        '&launch=' + encodeURIComponent(details.context.launch_id);
                } else {
                    // details.launchDetails.patientContext && this.props.fetchPatientDetails({id: details.launchDetails.patientContext});
                    // details.launchDetails.patientContext && window.fhirClient.api.read({type: 'Patient', id: details.launchDetails.patientContext})
                    // details.launchDetails.patientContext && window.fhirClient.api.search({ type: 'Patient', query: {id: details.launchDetails.patientContext} })
                    //     .done(patient => {
                    //         console.log('-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!');
                    //         console.log(patient);
                    //         console.log('-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!');
                    //     });
                    //
                    // launched = true;
                    this.setState({
                        src: details.app.launchUri +
                            'iss=' + encodeURIComponent(details.iss) +
                            '&launch=' + encodeURIComponent(details.context.launch_id),
                        details
                    });
                }
            } catch (e) {
                return null;
            }
        };

        onStorage();
        window.addEventListener('storage', onStorage, false);
    }

    render () {
        return this.state.src
            ? <div className='launched-app-wrapper'>
                <div className='embedded-header'>
                    <div className='patient-context-wrapper'>

                    </div>
                    <div className='user-context-wrapper'>
                        {this.getUserContextData()}
                    </div>
                </div>
                <div className='embedded-sidebar'/>
                <iframe src={this.state.src}/>
            </div>
            : null;
    }

    getUserContextData = () => {
        let userContext = this.state.details.launchDetails.userPersona;
        return <Fragment>
            <div>
                {
                    userContext.resource === "Practitioner"
                        ? <i className='fa fa-user-md fa-lg'/>
                        : <Patient style={{ width: '80px', height: '80px', position: 'relative', top: '15px', fill: 'white' }}/>
                }
            </div>
            <div className='user-data-wrapper'>
                <span>{userContext.personaName}</span>
                <span>FHIR ID: {userContext.fhirId}</span>
            </div>
        </Fragment>
    };
}