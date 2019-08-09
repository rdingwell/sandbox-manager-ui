import React, {Component} from 'react';
import {CircularProgress, Dialog, IconButton, Paper, Checkbox, FormControlLabel} from '@material-ui/core';
import ReactJson from 'react-json-view';
import ResultsTable from '../../ResultsTable';

import './styles.less';

class ValidationModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            screen: 'profiles'
        };
    }

    componentDidMount() {
        this.setState({selectedProfile: this.props.profile, screen: 'results'});
        this.props.loadProfileSDs(this.props.profile.id);
        this.props.onValidate && this.props.onValidate(this.props.profile);
    }

    render() {
        let typeButton = <FormControlLabel label='Show as table' className='view-toggle'
                                           control={<Checkbox onChange={() => this.setState({resultsView: !this.state.resultsView})} value='open' color='primary' toggled={this.state.resultsView}/>}/>;

        return <Dialog modal={false} open onRequestClose={this.props.close} className='validation-results-modal'>
            <Paper className='paper-card'>
                <IconButton style={{color: this.props.palette.p5}} className="close-button" onClick={this.props.close}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>Validation</h3>
                {this.props.validationResults && typeButton}
                {this.getContent()}
            </Paper>
        </Dialog>;
    }

    getContent = () => {
        // switch (this.state.screen) {
        // case 'profiles':
        //     return <Manage {...this.props} modal onProfileSelected={this.onProfileSelected}/>;
        // case 'results':
        return <div>
            <div className='validate-result-wrapper'>
                {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                {this.props.validationExecuting && <div className='loader-wrapper'><CircularProgress size={60} thickness={5}/></div>}
            </div>
        </div>;
        // }
    };

    // onProfileSelected = (profile) => {
    //     this.setState({ selectedProfile: profile, screen: 'results' });
    //     this.props.loadProfileSDs(profile.id);
    //     this.props.onValidate && this.props.onValidate(profile);
    // }
}

export default ValidationModal;
