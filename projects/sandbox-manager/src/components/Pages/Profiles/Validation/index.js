import React, {Component} from 'react';
import {FormControlLabel, Switch, TextField, Button, Card, IconButton, withTheme, Dialog, DialogActions, Paper, Step, StepButton, Stepper, CircularProgress} from '@material-ui/core';
import Find from '@material-ui/icons/FindInPage';
import Link from '@material-ui/icons/Link';
import Folder from '@material-ui/icons/Folder';
import Align from '@material-ui/icons/FormatAlignLeft';
import TreeBrowser from '../TreeBrowser';

import './styles.less';
import ReactJson from "react-json-view";
import ResultsTable from "../ResultsTable";

class Validation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            resultsView: false,
            selectedType: undefined,
            showValidationResults: false
        }
    }

    componentDidMount() {
        this.props.loadProfileSDs(this.props.profile.id);
        // this.props.onValidate && this.props.onValidate(this.props.profile);
    }

    componentWillUpdate(nextProps) {
        !this.props.deselectValidation && nextProps.deselectValidation && this.toggleScreen();
    }

    render() {
        let validateDisabled = (this.state.selectedType === 'browse' && this.state.query.length <= 5)
            || (this.state.selectedType === 'existing' && this.state.query.length <= 5)
            || (this.state.selectedType === 'file' && !this.state.file)
            || (this.state.selectedType === 'json-input' && this.state.manualJson.length <= 5);
        let st = this.state.selectedType;

        return <Dialog open={true} classes={{root: 'validation-dialog', paper: 'validation-content'}} onClose={this.props.onClose}>
            <Paper className='paper-card'>
                <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>Validate</h3>
                <div className='validation-wrapper'>
                    <Stepper activeStep={!st ? 0 : this.state.showValidationResults ? 2 : 1}>
                        <Step>
                            <StepButton onClick={() => this.setState({selectedType: undefined, showValidationResults: false, resultsView: false})}>Validation type</StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({showValidationResults: false, resultsView: false})}>Provide data</StepButton>
                        </Step>
                        <Step>
                            <StepButton>Validation results</StepButton>
                        </Step>
                    </Stepper>
                    {this.state.showValidationResults && this.props.validationResults &&
                    <FormControlLabel className='view-toggle' label='Show as table'
                                      control={<Switch color='secondary' checked={this.state.resultsView} value='resultsView' onChange={() => this.setState({resultsView: !this.state.resultsView})}/>}/>}
                    {!this.state.selectedType && <div className='validation-cards'>
                        <p>
                            Chose a way to provide the resource for validation
                        </p>
                        <Card className='validation-card' onClick={() => this.toggleScreen('browse')}>
                            <div>
                                <Find/> Browse
                            </div>
                        </Card>
                        <Card className='validation-card' onClick={() => this.toggleScreen('uri')}>
                            <div>
                                <Link/> URI
                            </div>
                        </Card>
                        <Card className='validation-card' onClick={() => this.toggleScreen('file')}>
                            <div>
                                <Folder/> File
                            </div>
                        </Card>
                        <Card className='validation-card' onClick={() => this.toggleScreen('json')}>
                            <div>
                                <Align/> JSON
                            </div>
                        </Card>
                    </div>}
                    <div className={`scroll-wrapper${this.state.showValidationResults ? ' bigger' : ''}`}>
                        {!this.state.showValidationResults && this.state.selectedType === 'browse' &&
                        <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)}
                                     selectPatient={this.selectPatient} cleanResults={this.props.cleanValidationResults}/>}
                        {!this.state.showValidationResults && this.state.selectedType === 'uri' && <div>
                            <div className='tab-title'>Existing resource uri</div>
                            <TextField fullWidth id='query' onChange={e => this.setState({query: e.target.value, manualJson: '', file: '', fileJson: ''})} placeholder='Patient/smart-613876'
                                       value={this.state.query}/>
                        </div>}
                        {!this.state.showValidationResults && this.state.selectedType === 'file' && <div>
                            <input value='' type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile} accept='application/json'/>
                            <div className='tab-title'>Validate resource from file</div>
                            <div style={{textAlign: 'center'}}>
                                <Button variant='contained' color='primary' onClick={() => this.refs.file.click()}>
                                    Select file
                                </Button>
                            </div>
                            {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                        </div>}
                        {!this.state.showValidationResults && this.state.selectedType === 'json' && <div>
                            <span className='tab-title'>JSON</span>
                            <div style={{textAlign: 'center'}}>
                                <Button className='clear-json-button' disabled={!this.state.manualJson} color='primary' onClick={() => this.setState({manualJson: ''})}>
                                    CLEAR
                                </Button>
                            </div>
                            <TextField className='manual-input' placeholder='Paste fhir resource json here' multiline fullWidth value={this.state.manualJson}
                                       onChange={e => this.setState({query: '', file: '', fileJson: '', manualJson: e.target.value})}/>
                        </div>}
                        {this.state.showValidationResults && <div className='validate-result-wrapper'>
                            {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                            {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                            {this.props.validationExecuting && <div className='loader-wrapper-small'>
                                <CircularProgress size={60} thickness={5}/>
                            </div>}
                        </div>}
                    </div>
                </div>
                {!this.state.showValidationResults && <DialogActions>
                    <Button variant='contained' className={`validate-button ${this.props.modal ? 'modal' : ''}`} color='primary' onClick={this.validate} disabled={validateDisabled}>
                        Validate
                    </Button>
                </DialogActions>}
            </Paper>
        </Dialog>
    }

    toggleScreen = (screen) => {
        this.setState({selectedType: screen});
        this.props.onScreenSelect && this.props.onScreenSelect(screen);

    };

    selectPatient = (selectedPersona) => {
        this.setState({selectedPersona});
    };

    toggleTree = (query) => {
        query = this.state.query !== query ? query : '';
        this.setState({query, manualJson: '', file: '', fileJson: ''});
    };

    readFile = () => {
        let fr = new FileReader();
        let file = this.refs.file.files.item(0);

        fr.onload = (e) => {
            let fileJson = e.target.result;
            this.setState({query: '', manualJson: '', fileJson, file: file.name});
        };

        fr.readAsText(file);
    };

    validate = () => {
        let manualJSON = this.state.fileJson || this.state.manualJson;
        manualJSON && (manualJSON = this.prepareJSON(JSON.parse(manualJSON)));
        manualJSON && this.props.validate(manualJSON);
        !manualJSON && this.state.query && this.props.validateExisting(this.state.query, this.props.profile);
        this.setState({query: '', showValidationResults: true});
    };

    prepareJSON = (json) => {
        if (!json.resourceType) {
            this.props.setGlobalError('No "resourceType" found in the provided object!');
            return;
        }

        if (this.state.selectedProfile) {
            let type = json.resourceType;
            let SD = this.props.sds.find(i => i.profileType === type);

            if (!SD) {
                this.props.setGlobalError(`Unable to validate resource "${type}" against this profile.`);
                return;
            }

            !json.meta && (json.meta = {});
            json.meta.profile = [SD.fullUrl];
        }
        return json;
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

export default withTheme(Validation);