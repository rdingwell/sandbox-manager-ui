import React, { Component } from 'react';
import { Tabs, Tab, Card, CardTitle, RaisedButton, List, ListItem, TextField, CircularProgress, AutoComplete } from 'material-ui';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from "material-ui/styles/muiThemeable";
import Page from 'sandbox-manager-lib/components/Page';
import ListIcon from 'material-ui/svg-icons/action/list';
import ReactJson from 'react-json-view';

import './styles.less';
import HelpButton from '../../UI/HelpButton';
import TreeBrowser from './TreeBrowser';

class DataManager extends Component {
    timer = null;

    constructor (props) {
        super(props);

        this.state = {
            query: '',
            activeTab: 'existing',
            canFit: 2
        };
    }

    componentDidMount () {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.loadProfiles();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let tab = this.state.activeTab;
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        let styleProps = { underlineFocusStyle, floatingLabelFocusStyle };
        let validateDisabled = this.state.activeTab === 'browse'
            || (this.state.activeTab === 'existing' && this.state.query.length <= 5)
            || (this.state.activeTab === 'file' && !this.state.file)
            || (this.state.activeTab === 'json-input' && this.state.manualJson.length <= 5);

        return <Page title='Profiles' helpIcon={<HelpButton style={{ marginLeft: '10px' }} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>}>
            <div className='profiles-wrapper'>
                <Card className='card profile-list-wrapper'>
                    <CardTitle className='card-title'>
                        <span>Profiles</span>
                    </CardTitle>
                    <div className='card-content import-button'>
                        <div className='file-load-wrapper'>
                            <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip}/>
                            <RaisedButton label='Load Profile (zip file)' primary onClick={() => this.refs.fileZip.click()}/>
                        </div>
                        <div className='loaded-profiles-wrapper'>
                            {!this.props.profilesLoading && this.props.profiles && this.getList(palette)}
                            {this.props.profilesLoading && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '30px', margin: 0 }}>
                                <CircularProgress size={40} thickness={5}/>
                            </div>}
                        </div>
                    </div>
                </Card>
                <Card className='card validate-card'>
                    <CardTitle className='card-title'>
                        <span>Validation</span>
                    </CardTitle>
                    <div className='validate-wrapper'>
                        <Tabs className='validate-tabs' contentContainerClassName={`validate-tabs-container ${this.state.activeTab === 'browse' ? 'no-padding' : ''}`}
                              inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }} value={this.state.activeTab}>
                            <Tab label={<span><ListIcon style={{ color: tab === 'existing' ? palette.primary5Color : palette.primary3Color }}/> URI</span>}
                                 className={'manual-input tab' + (tab === 'existing' ? ' active' : '')} onActive={() => this.setActiveTab('existing')} value='existing'>
                                <div>
                                    <div className='tab-title'>Existing resource uri</div>
                                    <TextField fullWidth id='query' {...styleProps} onChange={(_, query) => this.setState({ query, manualJson: '', file: '', fileJson: '' })}
                                               hintText='Patient/smart-613876' value={this.state.query}/>
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{ color: tab === 'file' ? palette.primary5Color : palette.primary3Color }}/> File</span>}
                                 className={'manual-input tab' + (tab === 'file' ? ' active' : '')} onActive={() => this.setActiveTab('file')} value='file'>
                                <div>
                                    <input value='' type='file' id='file' ref='file' style={{ display: 'none' }} onChange={this.readFile}/>
                                    <div className='tab-title'>Validate resource from file</div>
                                    <RaisedButton label='Select file' primary onClick={() => this.refs.file.click()}/>
                                    {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{ color: tab === 'json-input' ? palette.primary5Color : palette.primary3Color }}/> JSON</span>}
                                 className={'manual-input tab' + (tab === 'json-input' ? ' active' : '')} onActive={() => this.setActiveTab('json-input')} value='json-input'>
                                <div>
                                    <span className='tab-title'>JSON</span>
                                    <TextField className='manual-input' hintText='Paste fhir resource json here' {...styleProps} multiLine fullWidth value={this.state.manualJson}
                                               onChange={(_, manualJson) => this.setState({ query: '', file: '', fileJson: '', manualJson })}/>
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{ color: tab === 'browse' ? palette.primary5Color : palette.primary3Color }}/> Browse</span>}
                                 className={'manual-input tab' + (tab === 'browse' ? ' active' : '')} onActive={() => this.setActiveTab('browse')} value='browse'>
                                <TreeBrowser onValidate={query => this.setState({ query, manualJson: '', file: '', fileJson: '' }, this.validate)}/>
                            </Tab>
                        </Tabs>
                        <RaisedButton className='validate-button' label='Validate' primary onClick={this.validate} disabled={validateDisabled}/>
                    </div>
                </Card>
                <Card className='card result-card'>
                    <CardTitle className='card-title'>
                        <span>Validation result</span>
                        <span className='validate-by-title'>{this.state.selectedProfile ? `Validate by: ${this.props.profiles.find(i => i.url === this.state.selectedProfile).name}` : ''}</span>
                    </CardTitle>
                    <div className='validate-result-wrapper'>
                        {this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                        {this.props.executing && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                    </div>
                </Card>
            </div>
        </Page>
    }

    readFile = () => {
        let fr = new FileReader();
        let file = this.refs.file.files.item(0);

        fr.onload = (e) => {
            let fileJson = e.target.result;
            this.setState({ query: '', manualJson: '', fileJson, file: file.name });
        };

        fr.readAsText(file);
    };

    validate = () => {
        this.state.fileJson
            ? this.props.validate(this.prepareJSON(JSON.parse(this.state.fileJson)))
            : this.state.manualJson
            ? this.props.validate(this.prepareJSON(JSON.parse(this.state.manualJson)))
            : this.props.validateExisting(this.state.query, this.state.selectedProfile);
    };

    prepareJSON = (json) => {
        if (this.state.selectedProfile) {
            !json.meta && (json.meta = {});
            json.meta.profile = [this.state.selectedProfile];
        }
        return json;
    };

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({ activeTab: tab, query: '', manualJson: '', fileJson: '', file: '' });
    };

    getList = (palette) => {
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };

        return <div>
            <TextField id='profile-filter' hintText='Filter profiles by name' onChange={(_, value) => this.delayFiltering(value)}
                       underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
            <List>
                {this.props.profiles.map((profile, key) => {
                    if (this.state.filter && profile.url.indexOf(this.state.filter) === -1) {
                        return;
                    }
                    let classes = 'profile-list-item' + (this.state.selectedProfile === profile.url ? ' active' : '');
                    return <ListItem key={key} className={classes} primaryText={profile.name} hoverColor='transparent' onClick={() => this.toggleProfile(profile.url)}/>;
                })}
            </List>
        </div>
    };

    delayFiltering = (value) => {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.filter(value);
            this.timer = null;
        }, 500);
    };

    filter = (value) => {
        this.setState({ filter: value });
    };

    toggleProfile = (url) => {
        let selectedProfile = this.state.selectedProfile === url ? undefined : url;
        this.setState({ selectedProfile });
    };

    loadZip = () => {
        this.props.uploadProfile(this.refs.fileZip.files[0]);
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

const mapStateToProps = state => {

    return {
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        executing: state.fhir.executing,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles,
        profilesLoading: state.fhir.profilesLoading
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DataManager)));
