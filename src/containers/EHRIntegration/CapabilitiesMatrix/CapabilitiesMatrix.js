import React from 'react';

import Paper from 'material-ui/Paper';

const matrixLocation = 'http://docs.smarthealthit.org/fhir-support/';

const capabilitiesMatrix = () => (
    <Paper className="PaperCard">
        <h3>Capabilities Matrix</h3>
        <div className="PaperBody">
            <p>SMART on FHIR EHR Capabilities Matrix</p>
            <p>
                <span className="Answer"><a href={matrixLocation}>{matrixLocation}</a></span>
            </p>
        </div>
    </Paper>

);

export default capabilitiesMatrix;