import React, {Component} from 'react';
import {TextField, Button, Card, IconButton, withTheme} from '@material-ui/core';
import Find from '@material-ui/icons/FindInPage';
import Link from '@material-ui/icons/Link';
import Folder from '@material-ui/icons/Folder';
import Align from '@material-ui/icons/FormatAlignLeft';
import Close from '@material-ui/icons/Close';
import TreeBrowser from '../TreeBrowser';
import Modal from './Modal';

import './styles.less';

class Validation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            activeTab: 'browse',
            selectedType: undefined
        }
    }

    componentWillUpdate(nextProps) {
        !this.props.deselectValidation && nextProps.deselectValidation && this.toggleScreen();
    }

    render() {
        let validateDisabled = (this.state.activeTab === 'browse' && this.state.query.length <= 5)
            || (this.state.activeTab === 'existing' && this.state.query.length <= 5)
            || (this.state.activeTab === 'file' && !this.state.file)
            || (this.state.activeTab === 'json-input' && this.state.manualJson.length <= 5);

        return <div className='validation-wrapper'>
            {this.state.validationModalVisible && <Modal {...this.props} close={this.toggleValidationModal} onValidate={this.validate} profile={this.props.profile}/>}
            {!this.state.selectedType && <div className='validation-cards'>
                <p>
                    Chose a way to provide the resource for validation
                </p>
                <Card onClick={() => this.toggleScreen('browse')}>
                    <div>
                        <Find/> Browse
                    </div>
                </Card>
                <Card onClick={() => this.toggleScreen('uri')}>
                    <div>
                        <Link/> URI
                    </div>
                </Card>
                <Card onClick={() => this.toggleScreen('file')}>
                    <div>
                        <Folder/> File
                    </div>
                </Card>
                <Card onClick={() => this.toggleScreen('json')}>
                    <div>
                        <Align/> JSON
                    </div>
                </Card>
            </div>}
            {this.state.selectedType && <div className='validation-title'>
                <span>{this.state.selectedType.toUpperCase()}</span>
                <IconButton onClick={() => this.toggleScreen()}>
                    <Close/>
                </IconButton>
            </div>}
            {this.state.selectedType &&
            <Button variant='contained' className={`validate-button ${this.props.modal ? 'modal' : ''}`} color='primary' onClick={this.toggleValidationModal} disabled={validateDisabled}>
                Validate
            </Button>}
            <div className='validation-content'>
                {this.state.selectedType === 'browse' &&
                <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)} selectPatient={this.selectPatient}
                             cleanResults={this.props.cleanValidationResults}/>}
                {this.state.selectedType === 'uri' && <div>
                    <div className='tab-title'>Existing resource uri</div>
                    <TextField fullWidth id='query' onChange={e => this.setState({query: e.target.value, manualJson: '', file: '', fileJson: ''})} placeholder='Patient/smart-613876' value={this.state.query}/>
                </div>}
                {this.state.selectedType === 'file' && <div>
                    <input value='' type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile} accept='application/json'/>
                    <div className='tab-title'>Validate resource from file</div>
                    <div style={{textAlign: 'center'}}>
                        <Button color='primary' onClick={() => this.refs.file.click()}>
                            Select file
                        </Button>
                    </div>
                    {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                </div>}
                {this.state.selectedType === 'json' && <div>
                    <span className='tab-title'>JSON</span>
                    <div style={{textAlign: 'center'}}>
                        <Button className='clear-json-button' disabled={!this.state.manualJson} color='primary' onClick={() => this.setState({manualJson: ''})}>
                            CLEAR
                        </Button>
                    </div>
                    <TextField className='manual-input' placeholder='Paste fhir resource json here' multiline fullWidth value={this.state.manualJson}
                               onChange={e => this.setState({query: '', file: '', fileJson: '', manualJson: e.target.value})}/>
                </div>}
            </div>
        </div>
    }

    toggleScreen = (screen) => {
        this.setState({selectedType: screen});
        this.props.onScreenSelect && this.props.onScreenSelect(screen);

    };

    toggleValidationModal = () => {
        this.setState({validationModalVisible: !this.state.validationModalVisible});
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

    validate = (profile) => {
        let manualJSON = this.state.fileJson || this.state.manualJson;
        manualJSON && (manualJSON = this.prepareJSON(JSON.parse(manualJSON)));
        manualJSON && this.props.validate(manualJSON);
        !manualJSON && this.state.query && this.props.validateExisting(this.state.query, profile);
        this.state.activeTab === 'browse' && this.setState({query: ''});
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