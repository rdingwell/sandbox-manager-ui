import React, { Component } from 'react';
import { TextField, Paper } from 'material-ui';
import './styles.less';

export default class Import extends Component {
    render () {
        return <div className='import-wrapper'>
            <div className='result-wrapper'>
                <Paper zDepth={3}>
                    <h2>Import JSON Bundle</h2>
                    <h4>Paste JSON FHIR Bundle in the Text Area</h4>
                    <TextField className='inport-field-wrapper' underlineShow={false} fullWidth multiLine />
                </Paper>
            </div>
            <div className='result-wrapper'>
                <Paper zDepth={3}>
                    <h2>Import Results</h2>
                </Paper>
            </div>
        </div>;
    }
}
