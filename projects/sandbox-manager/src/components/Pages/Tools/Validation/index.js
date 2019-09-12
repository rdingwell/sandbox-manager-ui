import React, {Component, Fragment} from 'react';
import {TextField, Button, Card, withTheme, Tabs, Tab, Paper, Step, StepButton, Stepper, CircularProgress} from '@material-ui/core';
import Find from '@material-ui/icons/FindInPage';
import Link from '@material-ui/icons/Link';
import Folder from '@material-ui/icons/Folder';
import Align from '@material-ui/icons/FormatAlignLeft';
import TreeBrowser from './TreeBrowser';
import ResultsTable from "./ResultsTable";
import ReactJson from "react-json-view";

import './styles.less';
import ProfileSelection from "./ProfileSelection";

class Validation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            manualJson: '',
            activeStep: 0,
            activeTab: 'table',
            selectedType: undefined
        }
    }

    componentWillUpdate(nextProps) {
        !this.props.deselectValidation && nextProps.deselectValidation && this.toggleScreen();
    }

    render() {
        let st = this.state.selectedType;
        let sv = this.state.activeStep === 2;
        let sp = this.state.activeStep === 1;
        let validateDisabled = (this.state.selectedType === 'uri' && this.state.query.length <= 5) || (this.state.selectedType === 'file' && !this.state.file) || (this.state.selectedType === 'json' && this.state.manualJson.length <= 5);
        let clearDisabled = (this.state.selectedType === 'json' && this.state.manualJson.length < 5);

        return <div className='validation-content'>
            <Paper className='paper-card'>
                <div className='validation-wrapper'>
                    <Stepper activeStep={this.state.activeStep}>
                        <Step>
                            <StepButton onClick={this.goToStart}>Select resource</StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({activeTab: 'table', activeStep: 1})}>Select profile</StepButton>
                        </Step>
                        <Step>
                            <StepButton>Validation results</StepButton>
                        </Step>
                    </Stepper>
                    {!st && <div className='validation-cards'>
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
                    <div className={`scroll-wrapper${sv ? ' bigger' : ''}`}>
                        {!sv && st === 'browse' && !sp && <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)}
                                                                       selectPatient={this.selectPatient} cleanResults={this.props.cleanValidationResults}/>}
                        {!sv && st === 'uri' && !sp && <div>
                            <div className='tab-title'>Existing resource uri</div>
                            <TextField fullWidth id='query' onChange={e => this.setState({query: e.target.value, manualJson: '', file: '', fileJson: ''})} placeholder='Patient/smart-613876'
                                       value={this.state.query} onKeyPress={this.submitMaybe}/>
                        </div>}
                        {!sv && st === 'file' && !sp && <div>
                            <input value='' type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile} accept='application/json'/>
                            <div className='tab-title'>Validate resource from file</div>
                            <div style={{textAlign: 'center'}}>
                                <Button variant='contained' color='primary' onClick={() => this.refs.file.click()}>
                                    Select file
                                </Button>
                            </div>
                            {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                        </div>}
                        {!sv && st === 'json' && !sp && <div>
                            <span className='tab-title'>JSON</span>
                            <TextField className='manual-input' placeholder='Paste FHIR resource JSON here' multiline fullWidth value={this.state.manualJson} onKeyPress={e => this.submitMaybe(e, true)}
                                       onChange={e => this.setState({query: '', file: '', fileJson: '', manualJson: e.target.value})}/>
                        </div>}
                        {!sv && sp && <ProfileSelection {...this.state} {...this.props} profileSelected={this.profileSelected} continue={this.continueWithoutProfile}/>}
                        {sv && <div className='validate-result-wrapper'>
                            {this.props.validationResults && (() => {
                                return <Fragment>
                                    <Tabs value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})}>
                                        <Tab id='table' label='Table' value='table'/>
                                        <Tab id='json' label='JSON' value='json'/>
                                    </Tabs>
                                    {this.state.activeTab === 'json' && <ReactJson src={this.props.validationResults} name={false}/>}
                                    {this.state.activeTab === 'table' && <ResultsTable results={this.props.validationResults}/>}
                                </Fragment>;
                            })()}
                            {this.props.validationExecuting && <div className='loader-wrapper-small' style={{position: 'relative', top: '80px'}}>
                                <CircularProgress size={60} thickness={5}/>
                            </div>}
                        </div>}
                        {st && st !== 'browse' && this.state.activeStep < 1 && <div style={{textAlign: 'center'}}>
                            {this.state.selectedType === 'json' && this.state.activeStep < 1 &&
                            <Button variant='contained' className='validate-button' color='primary' onClick={() => this.setState({manualJson: ''})} disabled={clearDisabled}>
                                clear
                            </Button>}
                            <Button variant='contained' className='validate-button' color='primary' onClick={() => this.setState({activeStep: 1})} disabled={validateDisabled}>
                                next
                            </Button>
                        </div>}
                    </div>
                </div>
            </Paper>
        </div>
    }

    goToStart = () => {
        this.setState({selectedType: undefined, selectedPersona: undefined, query: '', activeTab: 'table', activeStep: 0, fileJson: undefined, file: ''});
    };

    submitMaybe = (event, checkForCtrl) => {
        [10, 13].indexOf(event.charCode) >= 0 && (!checkForCtrl || event.ctrlKey) && this.setState({activeStep: 1});
    };

    profileSelected = (selectedProfile) => {
        this.setState({selectedProfile}, () => {
            this.validate();
        })
    };

    continueWithoutProfile = () => {
        this.validate();
    };

    toggleScreen = (screen) => {
        this.setState({selectedType: screen});
        this.props.onScreenSelect && this.props.onScreenSelect(screen);

    };

    selectPatient = (selectedPersona) => {
        this.setState({selectedPersona});
    };

    toggleTree = (query) => {
        this.setState({query, manualJson: '', file: '', fileJson: '', activeStep: 1});
    };

    readFile = () => {
        let fr = new FileReader();
        let file = this.refs.file.files.item(0);

        fr.onload = (e) => {
            let fileJson = e.target.result;
            this.setState({query: '', manualJson: '', fileJson, file: file.name});
            this.refs.file.value = undefined;
        };

        fr.readAsText(file);
    };

    validate = () => {
        let manualJSON = this.state.fileJson || this.state.manualJson;
        manualJSON && (manualJSON = this.prepareJSON(JSON.parse(manualJSON)));
        manualJSON && this.props.validate(manualJSON);
        !manualJSON && this.state.query && this.props.validateExisting(this.state.query, this.state.selectedProfile);
        this.setState({activeStep: 2});
    };

    prepareJSON = (json) => {
        if (!json.resourceType) {
            this.props.setGlobalError('No "resourceType" found in the provided object!');
            return;
        }

        if (this.state.selectedProfile) {
            !json.meta && (json.meta = {});
            json.meta.profile = [this.state.selectedProfile.profile.fullUrl];
        }
        return json;
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

export default withTheme(Validation);