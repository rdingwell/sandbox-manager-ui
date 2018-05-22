import React, { Component } from 'react';
import { TextField, Paper, SelectField, MenuItem } from 'material-ui';
import './styles.less';

export default class ExternalBrowser extends Component {
    render () {
        return <div className='external-browser-wrapper'>
            <div className='external-endpoint-wrapper'>
                <SelectField floatingLabelText="FHIR Endpoint">
                    <MenuItem value={1} primaryText="HSPC with Synthea" />
                </SelectField>
                <TextField id='endpoint' value='https://api3.hspconsortium.org/HSPCplusSynthea/open' disabled fullWidth />
            </div>
            <div className='external-query-wrapper'>
                <TextField id='query' fullWidth floatingLabelText='FHIR Query' />
            </div>
            <div className='result-wrapper'>
                <Paper zDepth={3}>
                    <h2>Summary</h2>
                </Paper>
            </div>
        </div>;
    }
}
