import React, { Component } from 'react';
import { TextField, FloatingActionButton, List, ListItem, Dialog, Paper, IconButton, AutoComplete } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { parseEntry } from '../../../../../../../lib/utils';
import ReactJson from 'react-json-view';
import './styles.less';

// There are stored in a table at the BE but are not changed so I've hardcoded them
// until we have time to build an algorithm to suggest based on the FHIR implementation
const SUGGESTIONS = [
    "Patient", "Patient?name=s", "Patient?birthdate=>2010-01-01&birthdate=<2011-12-31", "Observation",
    "Observation?category=vital-signs", "Observation?date=>2010-01-01&date=<2011-12-31", "Condition", "Condition?onset=>2010-01-01&onset=<2011-12-31",
    "Condition?code:text=diabetes", "Procedure", "Procedure?date=>2010-01-01&date=<2011-12-31", "AllergyIntolerance", "AllergyIntolerance?date=>1999-01-01&date=<2011-12-31"
];

export default class QueryBrowser extends Component {

    constructor( props ) {
        super(props);

        this.state = {
            showDialog: false,
            selectedEntry: undefined,
            query: ''
        };
    }

    componentDidMount() {
        this.refs.query.refs.searchTextField.input.addEventListener('keypress', this.submitMaybe);
    }

    componentWillUnmount() {
        this.refs.query.refs.searchTextField.input.removeEventListener('keypress', this.submitMaybe);
    }

    render() {
        return <div className='query-browser-wrapper'>
            <Dialog paperClassName='query-result-dialog' open={this.state.showDialog} onRequestClose={this.toggle}>
                <Paper className='paper-card'>
                    <h3>
                        Details
                    </h3>
                    <IconButton className="close-button" onClick={this.toggle}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <div className='paper-body'>
                        <div className='result-wrapper'>
                            {this.state.selectedEntry && <ReactJson src={this.state.selectedEntry}/>}
                        </div>
                    </div>
                </Paper>
            </Dialog>
            <div className='fhir-query-wrapper'>
                <div className='input-wrapper'>
                    {/*<TextField ref='query' id='query' value={this.state.query} fullWidth floatingLabelText='FHIR Query' onChange={(_, query) => this.setState({ query })} />*/}
                    <AutoComplete ref='query' id='query' searchText={this.state.query} fullWidth floatingLabelText='FHIR Query' onUpdateInput={query => this.setState({ query })}
                                  dataSource={SUGGESTIONS} filter={AutoComplete.caseInsensitiveFilter} onNewRequest={() => this.props.search(this.state.query)} />
                </div>
                {this.state.query.length > 0 &&
                <FloatingActionButton onClick={this.clearQuery} className='clear-query-button' mini secondary>
                    <CloseIcon/>
                </FloatingActionButton>}
                <FloatingActionButton onClick={() => this.props.search(this.state.query)} mini>
                    <SearchIcon/>
                </FloatingActionButton>
            </div>
            <div className='result-wrapper'>
                <div>
                    <h2 className='title'>Summary</h2>
                    {this.props.results && this.props.results.entry && <span className='query-size'>
                        <span>Showing <span className='number'>{this.props.results.entry.length}</span></span>
                        <span> of <span className='number'>{this.props.results.total}</span></span>
                    </span>}
                    <div className='query-result-wrapper'>
                        <List>
                            {this.props.results && this.props.results.entry && this.props.results.entry.map(( e, i ) => {
                                let entry = parseEntry(e);
                                return <ListItem key={i} onClick={() => this.setState({ showDialog: true, selectedEntry: e })} className='result-list-item'>
                                    {entry.props.map(( item, index ) => {
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
            </div>
            <div className='result-wrapper'>
                <div>
                    <h2>Result JSON Bundle</h2>
                    <div>
                        {this.props.results && <ReactJson src={this.props.results} name={false}/>}
                    </div>
                </div>
            </div>
        </div>;
    }

    clearQuery = () => {
        this.setState({ query: '' });
        this.props.clearResults(null);
    };

    toggle = () => {
        let showDialog = !this.state.showDialog;
        let props = { showDialog };
        !showDialog && (props.selectedEntry = undefined);
        this.setState(props);
    };

    submitMaybe = ( event ) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.props.search(this.state.query);
    };
}
