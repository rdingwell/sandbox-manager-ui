import React, { Component } from 'react';

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
            let details = JSON.parse(window.localStorage[key] || {});
            console.log('Stored details: ' + details);
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
                this.setState({
                    src: details.app.launchUri +
                        'iss=' + encodeURIComponent(details.iss) +
                        '&launch=' + encodeURIComponent(details.context.launch_id)
                });
            }
        };

        onStorage();
        window.addEventListener('storage', onStorage, false);
    }

    render () {
        return this.state.src
            ? <div className='launched-app-wrapper'>
                <div className='embedded-header'/>
                <div className='embedded-sidebar'/>
                <iframe src={this.state.src}/>
            </div>
            : null;
    }

    getFhirUserResource = (userId) => {
        let userIdSections = userId.split("/");

        window.fhirClient.api.read({ type: userIdSections[userIdSections.length - 2], id: userIdSections[userIdSections.length - 1] })
            .done(userResult => {
                let user = { name: "" };
                user.name = nameGivenFamily(userResult.data);
                user.id = userResult.data.id;
                user.details = userResult.data;
                this.setState({ user });
            });
    }
}