import React, { Component } from 'react';

const matrixLocation = 'http://docs.smarthealthit.org/fhir-support/';

export default class CapabilitiesMatrix extends Component {
    render () {
        return <div>
            <h3>Capabilities Matrix</h3>
            <div className='paper-body'>
                <p>SMART on FHIR EHR Capabilities Matrix</p>
                <p>
                    <span className='Answer'><a href={matrixLocation}>{matrixLocation}</a></span>
                </p>
            </div>
        </div>
    }
}
