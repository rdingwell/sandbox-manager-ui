import React, { Component } from 'react';
import { TextField, Paper, FloatingActionButton, List, ListItem } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import './styles.less';
import { parseEntry } from "../../../../../../../lib/utils";

export default class ExternalBrowser extends Component {
    constructor (props) {
        super(props);

        this.state = {
            query: '',
            endpoint: 'https://api3.hspconsortium.org/HSPCplusSynthea/open'
        };
    }

    componentDidMount () {
        this.refs.query.input.addEventListener('keypress', this.submitMaybe);
    }

    componentWillUnmount () {
        this.refs.query.input.removeEventListener('keypress', this.submitMaybe);
    }

    render () {
        let clearClasses = 'clear-query-button' + (this.state.query.length > 0 ? '' : ' hidden');

        return <div className='external-browser-wrapper'>
            <div className='external-endpoint-wrapper'>
                <TextField id='endpoint' value={this.state.endpoint} fullWidth onChange={(_, endpoint) => this.setState({ endpoint })} />
            </div>
            <div className='external-query-wrapper'>
                <div className='input-wrapper'>
                    <TextField ref='query' value={this.state.query} id='query' fullWidth floatingLabelText='FHIR Query' onChange={(_, query) => this.setState({ query })} />
                </div>
                <div>
                    <FloatingActionButton onClick={() => this.props.search(this.state.query, this.state.endpoint)} mini>
                        <SearchIcon />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={this.clearQuery} className={clearClasses} mini secondary>
                        <CloseIcon />
                    </FloatingActionButton>
                </div>
            </div>
            {this.props.results && this.props.results.entry &&
            <div className='result-wrapper'>
                <div>
                    <h2 className='title'>Summary</h2>
                    <span className='query-size'>
                        <span>Total: <span className='number'>{this.props.results.total}</span></span>
                        <span>Current set: <span className='number'>{this.props.results.entry.length}</span></span>
                    </span>
                    <div className='query-result-wrapper'>
                        <List>
                            {this.props.results.entry.map((e, i) => {
                                let entry = parseEntry(e);
                                return <ListItem key={i} onClick={() => this.setState({ showDialog: true, selectedEntry: e })}>
                                    {entry.props.map((item, index) => {
                                        return <div className='result-item' key={index}>
                                            <span>{item.label}: </span>
                                            <span>{item.value}</span>
                                        </div>
                                    })}
                                </ListItem>
                            })}
                        </List>
                    </div>
                </div>
            </div>}
        </div>;
    }

    clearQuery = () => {
        this.setState({ query: '' });
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.props.search(this.state.query);
    };
}
