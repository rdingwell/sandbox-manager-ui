import React, { Component } from 'react';
import { TextField, FloatingActionButton, List, ListItem, Dialog, Paper } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { parseEntry } from '../../../../../../../lib/utils';
import ReactJson from 'react-json-view';
import './styles.less';

export default class QueryBrowser extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showDialog: false,
            selectedEntry: undefined,
            query: ''
        };
    }

    componentDidMount () {
        this.refs.query.input.addEventListener('keypress', this.submitMaybe);
    }

    componentWillUnmount () {
        this.refs.query.input.removeEventListener('keypress', this.submitMaybe);
    }

    render () {
        return <div className='query-browser-wrapper'>
            <Dialog paperClassName='query-result-dialog' open={this.state.showDialog} onRequestClose={this.toggle}>
                <Paper className='paper-card'>
                    <h3>
                        Details
                    </h3>
                    <div className='paper-body'>
                        <div className='result-wrapper'>
                            {this.state.selectedEntry && <ReactJson src={this.state.selectedEntry} />}
                        </div>
                    </div>
                </Paper>
            </Dialog>
            <div className='fhir-query-wrapper'>
                <div className='input-wrapper'>
                    <TextField ref='query' id='query' value={this.state.query} fullWidth floatingLabelText='FHIR Query' onChange={(_, query) => this.setState({query})} />
                </div>
                {this.state.query.length > 0 &&
                <FloatingActionButton onClick={this.clearQuery} className='clear-query-button' mini secondary>
                    <CloseIcon />
                </FloatingActionButton>}
                <FloatingActionButton onClick={() => this.props.search(this.state.query)} mini>
                    <SearchIcon />
                </FloatingActionButton>
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
            {this.props.results &&
            <div className='result-wrapper'>
                <div>
                    <h2>Result JSON Bundle</h2>
                    <div>
                        {this.props.results && <ReactJson src={this.props.results} />}
                    </div>
                </div>
            </div>}
        </div>;
    }

    clearQuery = () => {
        this.setState({query: ''});
        this.props.clearResults(null);
    };

    toggle = () => {
        let showDialog = !this.state.showDialog;
        let props = { showDialog };
        !showDialog && (props.selectedEntry = undefined);
        this.setState(props);
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.props.search(this.state.query);
    };
}
