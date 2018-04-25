import React, { Component } from 'react';
import CapabilitiesMatrix from './CapabilitiesMatrix';
import SMART from './SMART';
import EHRProviders from "./EHRProviders";

export default class EHRIntegration extends Component {
    render () {
        return <div>
            <CapabilitiesMatrix />
            <EHRProviders />
            <SMART />
        </div>
    }
}
