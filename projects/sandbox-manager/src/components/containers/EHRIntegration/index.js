import React, { Component } from 'react';
import CapabilitiesMatrix from './CapabilitiesMatrix';
import SMART from './SMART';
import EHRProviders from "./EHRProviders";

import './styles.less';

export default class EHRIntegration extends Component {
    render () {
        return <div className='integration-wrapper'>
            <EHRProviders />
            <SMART />
            <CapabilitiesMatrix />
        </div>
    }
}
