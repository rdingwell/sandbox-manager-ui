import React, { Component } from 'react';

const smartGalery = 'https://apps.smarthealthit.org/';
const smartSandbox = 'https://sandbox.smarthealthit.org';

export default class Smart extends Component {
    render () {
        return <div>
            <h3>SMART</h3>
            <div>
                <p>Where can I learn about the SMART sandbox?</p>
                <p>
                    <span className='Answer'><a href={smartSandbox}>{smartSandbox}</a></span></p>
                <p>Which FHIR versions does the SMART sandbox support?</p>
                <p>
                    <span className='Answer'>DSTU2</span></p>
                <p>Where can I see the SMART Gallery?</p>
                <p>
                    <span className='Answer'><a href={smartGalery}>{smartGalery}</a></span>
                </p>
            </div>
        </div>
    }
}
