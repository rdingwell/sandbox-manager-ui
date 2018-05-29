import React, { Component } from 'react';
import EHRProvider from './EHRProvider';

export default class EHRProviders extends Component {
    constructor (props) {
        super(props);

        this.state = {
            providers: [
                {
                    id: 1,
                    provider: 'Allscripts',
                    devLocation: 'https://developer.allscripts.com/',
                    regLocation: 'https://developer.allscripts.com/Account/MyDashboard',
                    dstu2Location: 'https://developer.allscripts.com/'
                },
                {
                    id: 2,
                    provider: 'Cerner',
                    devLocation: 'https://code.cerner.com/',
                    regLocation: 'https://code.cerner.com/developer/smart-on-fhir/apps',
                    dstu2Location: 'http://fhir.cerner.com/millennium/dstu2/'
                },
                {
                    id: 3,
                    provider: 'Epic',
                    devLocation: 'https://open.epic.com/',
                    regLocation: 'https://open.epic.com/MyApps',
                    dstu2Location: 'https://open.epic.com/Interface/FHIR'
                }
            ]
        };
    }

    render () {
        return this.state.providers.map((provider) => {
            return <EHRProvider key={provider.id} providerName={provider.provider} devLocation={provider.devLocation}
                                regLocation={provider.regLocation} dstu2Location={provider.dstu2Location} />
        });
    };
}
