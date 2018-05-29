import React, { Component } from 'react';

export default class LaunchApp extends Component {
    componentDidMount () {
        // A hack to get around the window popup behavior in modern web browsers
        let launched = false;
        let key = window.location.search.slice(1);
        if (!(key in window.localStorage)) {
            console.log('Failed to launch app -- no launch key.');
        }
        onStorage();
        window.addEventListener('storage', onStorage, false);
        console.log('mounted!');

        function onStorage () {
            console.log('storage!');
            if (launched || window.localStorage[key] === 'requested-launch') {
                return;
            }
            console.log('launch started!');
            launched = true;
            let details = JSON.parse(window.localStorage[key]);
            window.localStorage.removeItem(key);

            // Session storage is inherited from opening window, so
            // we need to purge the tokenResponse here to avoid passing
            // the Sandbox Manager's token credentials to the app
            delete sessionStorage.tokenResponse;

            if (details.app.launchUri.lastIndexOf("?") > -1) {
                details.app.launchUri = details.app.launchUri + "&"
            } else {
                details.app.launchUri = details.app.launchUri + "?"
            }

            window.location = details.app.launchUri +
                'iss=' + encodeURIComponent(details.iss) +
                '&launch=' + encodeURIComponent(details.context.launch_id);
        }
    }

    render () {
        return null
    }
}
