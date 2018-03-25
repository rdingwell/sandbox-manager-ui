import React, { Component } from 'react';
import CapabilitiesMatrix from './CapabilitiesMatrix/CapabilitiesMatrix';
import SMART from './SMART/SMART';
import EHRProviders from "./EHRProviders/EHRProviders";


class EHRIntegration extends Component {





    render() {
        return(
                <div>
                    <CapabilitiesMatrix />
                    <EHRProviders />
                    <SMART/>
                </div>
        );
    }
}

export default EHRIntegration;