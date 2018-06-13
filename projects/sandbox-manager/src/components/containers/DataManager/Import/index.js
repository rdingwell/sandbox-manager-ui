import React, { Component } from 'react';
import { TextField, RaisedButton, Paper } from 'material-ui';
import ReactJson from 'react-json-view';

import './styles.less';

export default class Import extends Component {
    constructor (props) {
        super(props);

        this.state = {
            input: ''
        };
    }

    componentDidMount() {
        this.props.clearResults();
    }

    render () {
        return <div className='import-wrapper'>
            <div className='result-wrapper'>
                <div className='import-button'>
                    <RaisedButton label='Import' disabled={this.state.input.length === 0} primary onClick={() => this.props.importData(this.state.input)} />
                </div>
                <Paper zDepth={3}>
                    <h2>Import JSON Bundle</h2>
                    <h4>Paste JSON FHIR Bundle in the Text Area</h4>
                    <TextField value={this.state.input} id='input' className='import-field-wrapper' underlineShow={false} fullWidth multiLine
                               onChange={(_, input) => this.setState({ input })} />
                </Paper>
            </div>
            <div className='result-wrapper'>
                <Paper zDepth={3}>
                    <h2>Import Results</h2>
                    <h4>Responses sent from the server</h4>
                    <div>
                        {this.props.results && <ReactJson src={this.props.results} />}
                    </div>
                </Paper>
            </div>
        </div>;
    }
}
