import React, {Component, Fragment} from 'react';
import {Tabs, Tab, Card, Button, List, ListItem, TextField, CircularProgress, Dialog, Switch, IconButton, Paper, Menu, MenuItem, Popover, Chip} from '@material-ui/core';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError
} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from 'sandbox-manager-lib/components/Page';
import ListIcon from '@material-ui/icons/List';
import DownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactJson from 'react-json-view';

import './styles.less';
import HelpButton from '../../UI/HelpButton';
import TreeBrowser from './TreeBrowser';
import ResultsTable from './ResultsTable';

const PROFILES = [
    {
        title: 'US-Core',
        id: 'US-Core',
        url: 'https://simplifier.net/US-Core'
    },
    // {
    //     title: 'QiCore',
    //     id: 'QiCore',
    //     url: 'https://simplifier.net/QiCore'
    // },
    {
        title: 'Custom',
        id: 'manual',
        url: 'Manual'
    }
];

class Profiles extends Component {
    timer = null;

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            project: '',
            profileName: '',
            profileId: '',
            simplifireProjectName: '',
            activeTab: 'browse',
            canFit: 2,
            resultsView: true,
            selectedPersona: undefined,
            showZipWarning: false,
            menuActive: false,
            simplifierInputVisible: false,
            profileInputModalVisible: false
        };
    }

    componentDidMount() {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);

        let canFit = this.calcCanFit();

        this.setState({canFit});
        this.props.loadProfiles();

        // let element = document.getElementsByClassName('profiles-list')[0];
        // element.addEventListener('scroll', this.scroll);
    }

    componentWillUnmount() {
        // let element = document.getElementsByClassName('profiles-list')[0];
        // element && element.removeEventListener('scroll', this.scroll);
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let tab = this.state.activeTab;
        let underlineFocusStyle = {borderColor: palette.primary2Color};
        let floatingLabelFocusStyle = {color: palette.primary2Color};
        let styleProps = {underlineFocusStyle, floatingLabelFocusStyle};
        let validateDisabled = (this.state.activeTab === 'browse' && this.state.query.length <= 5)
            || (this.state.activeTab === 'existing' && this.state.query.length <= 5)
            || (this.state.activeTab === 'file' && !this.state.file)
            || (this.state.activeTab === 'json-input' && this.state.manualJson.length <= 5);
        let typeButton = <Switch className='view-toggle' label='Show as table' labelPosition='right' toggled={this.state.resultsView} thumbStyle={{backgroundColor: palette.primary5Color}}
                                 trackStyle={{backgroundColor: palette.primary7Color}} thumbSwitchedStyle={{backgroundColor: palette.primary2Color}}
                                 trackSwitchedStyle={{backgroundColor: palette.primary2Color}} onToggle={() => this.setState({resultsView: !this.state.resultsView})}/>;

        let profile = this.state.selectedProfile && this.props.profiles.find(i => i.profileId === this.state.selectedProfile) || {};

        return <Page title={<span>Profiles</span>}
                     helpIcon={<HelpButton style={{marginLeft: '10px'}} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>}>
            {this.getModals()}
            <div className='profiles-wrapper'>
                <Card className='card profile-list-wrapper'>
                    <div className='card-title'>
                        <span>Profiles</span>
                    </div>
                    <div className='card-content import-button left-padding'>
                        <div className='file-load-wrapper'>
                            <input type='file' id='fileZip' ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/>
                            <Button variant='contained' label='Import profile' primary onClick={this.toggleInputModal}/>
                            {/*<Button variant='contained label='Import profile' primary onClick={() => {*/}
                            {/*    this.setState({ profileName: '', profileId: '' }, () => {*/}
                            {/*        this.refs.fileZip.value = [];*/}
                            {/*        this.refs.fileZip.click();*/}
                            {/*    });*/}
                            {/*}}/>*/}
                        </div>
                        <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                            {this.getList(palette)}
                        </div>
                        <div className='white-shadow'/>
                    </div>
                </Card>
                <Card className='card validate-card'>
                    <div className='card-title'>
                        <span>Validation target</span>
                    </div>
                    <div className='validate-wrapper'>
                        <Tabs className='validate-tabs' contentContainerClassName={`validate-tabs-container ${this.state.activeTab === 'browse' ? 'no-padding' : ''}`}
                              inkBarStyle={{backgroundColor: palette.primary2Color}} style={{backgroundColor: palette.canvasColor}} value={this.state.activeTab}>
                            <Tab label={<span><ListIcon style={{color: tab === 'browse' ? palette.primary5Color : palette.primary3Color}}/> Browse</span>}
                                 className={'manual-input tab' + (tab === 'browse' ? ' active' : '')} onActive={() => this.setActiveTab('browse')} value='browse'>
                                <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)}
                                             selectPatient={this.selectPatient} cleanResults={this.props.cleanValidationResults}/>
                            </Tab>
                            <Tab label={<span><ListIcon style={{color: tab === 'existing' ? palette.primary5Color : palette.primary3Color}}/> URI</span>}
                                 className={'manual-input tab' + (tab === 'existing' ? ' active' : '')} onActive={() => this.setActiveTab('existing')} value='existing'>
                                <div>
                                    <div className='tab-title'>Existing resource uri</div>
                                    <TextField fullWidth id='query' {...styleProps} onChange={(_, query) => this.setState({query, manualJson: '', file: '', fileJson: ''})}
                                               hintText='Patient/smart-613876' value={this.state.query}/>
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{color: tab === 'file' ? palette.primary5Color : palette.primary3Color}}/> File</span>}
                                 className={'manual-input tab' + (tab === 'file' ? ' active' : '')} onActive={() => this.setActiveTab('file')} value='file'>
                                <div>
                                    <input value='' type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile} accept='application/json'/>
                                    <div className='tab-title'>Validate resource from file</div>
                                    <Button variant='contained' label='Select file' primary onClick={() => this.refs.file.click()}/>
                                    {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{color: tab === 'json-input' ? palette.primary5Color : palette.primary3Color}}/> JSON</span>}
                                 className={'manual-input tab' + (tab === 'json-input' ? ' active' : '')} onActive={() => this.setActiveTab('json-input')} value='json-input'>
                                <div>
                                    <span className='tab-title'>JSON</span>
                                    <Button variant='contained' className='clear-json-button' disabled={!this.state.manualJson} label='CLEAR' primary onClick={() => this.setState({manualJson: ''})}/>
                                    <TextField className='manual-input' hintText='Paste fhir resource json here' {...styleProps} multiLine fullWidth value={this.state.manualJson}
                                               onChange={(_, manualJson) => this.setState({query: '', file: '', fileJson: '', manualJson})}/>
                                </div>
                            </Tab>
                        </Tabs>
                        <Button variant='contained' className='validate-button' label='Validate' primary onClick={this.validate} disabled={validateDisabled}/>
                    </div>
                </Card>
                <Card className='card result-card'>
                    <div className='card-title'>
                        <span>Validation result {this.props.validationResults && typeButton}</span>
                        <span className='validate-by-title'>
                            {this.props.validationResults && <span>Validated <strong>{this.props.validationResults.validatedObject}</strong> </span>}
                            {this.props.validationResults && this.props.validationResults.validatedProfile
                                ? <span>against <strong>{profile.profileName}</strong></span>
                                : ''}
                        </span>
                    </div>
                    <div className='validate-result-wrapper'>
                        {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                        {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                        {this.props.validationExecuting && <div className='loader-wrapper'><CircularProgress size={60} thickness={5}/></div>}
                    </div>
                </Card>
            </div>
        </Page>
    }

    getModals = () => {
        let modals = [];
        let palette = this.props.muiTheme.palette;
        let titleStyle = {
            backgroundColor: palette.primary2Color,
            color: palette.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let actions = [
            <div className='warning-modal-action'>
                <Button variant='contained' label='OK' primary onClick={this.toggleWarningModal}/>
            </div>
        ];
        let inputActions = [
            <div className='warning-modal-action'>
                <Button variant='contained' label='OK' primary onClick={this.saveProfile}/>
            </div>
        ];
        let inputModalActions = [
            <div key={1} className='input-modal-action'>
                <Button variant='contained' label='Load' primary onClick={this.loadRemoteFile}
                        disabled={!this.state.project || (this.state.project === 'manual' && this.state.simplifireProjectName.length < 2)}/>
            </div>
        ];
        !this.state.simplifierInputVisible && inputModalActions.shift();
        let closeInputModal = () => this.setState({profileInputModalVisible: false});


        this.state.showZipWarning &&
        modals.push(<Dialog open={this.state.showZipWarning} modal={false} onRequestClose={this.toggleWarningModal} actions={actions} contentStyle={{width: '350px'}} key={1}>
            <div className='sandbox-edit-modal'>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={this.toggleWarningModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Incorrect file type</h1>
                </div>
                <div>
                    <p>
                        Only zip files are allowed!
                    </p>
                </div>
            </div>
        </Dialog>);

        this.state.inputModalVisible &&
        modals.push(
            <Dialog open={this.state.inputModalVisible} modal={false} onRequestClose={this.toggleInputModal} actions={inputModalActions} contentStyle={{width: '412px'}} bodyClassName='project-input-modal'
                    key={2}>
                <Paper className='paper-card'>
                    <IconButton style={{color: this.props.muiTheme.palette.primary5Color}} className="close-button" onClick={this.toggleInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    {this.getModalContent(palette)}
                </Paper>
            </Dialog>);

        this.state.profileInputModalVisible &&
        modals.push(<Dialog open={this.state.profileInputModalVisible} modal={false} onRequestClose={closeInputModal} actions={inputActions} contentStyle={{width: '412px'}} key={3}>
            <div className='sandbox-edit-modal'>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={closeInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Profile name</h1>
                </div>
                <div>
                    <div style={{textAlign: 'center', fontSize: '.8rem', marginTop: '5px'}}>
                        <span>{this.refs.fileZip.files[0] ? this.refs.fileZip.files[0].name : this.state.sfProject}</span>
                    </div>
                    <TextField id='profileName' floatingLabelText='Name' fullWidth onChange={this.setProfileName} value={this.state.profileName} errorText={this.state.nameError}/>
                    <TextField id='profileId' floatingLabelText='Id' fullWidth disabled value={this.state.profileId}/>
                </div>
            </div>
        </Dialog>);

        return modals;
    };

    saveProfile = () => {
        if (this.state.profileName && this.state.profileName.length >= 2) {
            !this.state.sfProject && this.props.uploadProfile(this.refs.fileZip.files[0], this.state.canFit, this.state.profileName, this.state.profileId);
            this.state.sfProject && this.props.loadProject(this.state.sfProject, this.state.canFit, this.state.profileName, this.state.profileId);
            this.setState({profileInputModalVisible: false, sfProject: undefined});
        } else {
            this.setState({nameError: 'The profile name has to be at least 2 characters!'})
        }
    };

    setProfileName = (_, profileName) => {
        let profileId = profileName.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (profileId.length > 20) {
            profileId = value.substring(0, 20);
        }
        this.setState({profileName, profileId});
    };

    getModalContent = (palette) => {
        let title = this.state.simplifierInputVisible ? 'Import profile from Simplifier.net' : 'Import profile';
        let content = !this.state.simplifierInputVisible
            ? <div className='buttons-wrapper'>
                <Button variant='contained' label='Simplifier.net' primary onClick={() => this.setState({simplifierInputVisible: true})}/>
                <Button variant='contained' label='Package' primary onClick={() => this.refs.fileZip.click() || this.toggleInputModal()}/>
            </div>
            : <div style={{padding: '20px'}}>
                <Chip className={'chip' + (this.state.menuActive ? ' active' : '')} onClick={() => this.setState({menuActive: true})}
                      backgroundColor={this.state.menuActive ? palette.primary2Color : undefined} labelColor={this.state.menuActive ? palette.alternateTextColor : undefined}>
                    <span ref='project-menu'/>
                    <span className='title'>{this.state.project ? this.state.project : 'Select a project to import'}</span>
                    <span className='icon-wrapper'>
                                   <DownIcon style={{position: 'relative', top: '5px'}} color={!this.state.menuActive ? palette.primary3Color : 'white'}/>
                                </span>
                </Chip>
                {this.state.project !== 'manual' && this.state.project !== '' && <a href={PROFILES.find(i => i.id === this.state.project).url} target='_blank'>Browse project on Simplifier.net</a>}
                {this.state.project === 'manual' && <TextField value={this.state.simplifireProjectName} onChange={(_, simplifireProjectName) => this.setState({simplifireProjectName})}
                                                               id='simplifireProjectName' floatingLabelText='Simplifier.net Project ID' className='project-name'/>}
                <Popover open={this.state.menuActive} anchorEl={this.refs['project-menu']} anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                         targetOrigin={{horizontal: 'left', vertical: 'top'}} className='left-margin' onRequestClose={() => this.setState({menuActive: false})}>
                    <Menu className='type-filter-menu' width='200px' desktop autoWidth={false}>
                        {PROFILES.map(profile =>
                            <MenuItem className='type-filter-menu-item' primaryText={profile.title} onClick={() => this.setState({menuActive: false, project: profile.id})}/>
                        )}
                    </Menu>
                </Popover>
            </div>;

        return <Fragment>
            <h3>{title}</h3>
            <div className="client-details">
                {content}
            </div>
        </Fragment>
    };

    toggleInputModal = () => {
        this.refs.fileZip.value = '';
        this.setState({profileName: '', profileId: '', inputModalVisible: !this.state.inputModalVisible, simplifierInputVisible: false, nameError: ''});
    };

    loadRemoteFile = () => {
        let sfProject = this.state.project !== 'manual' ? this.state.project : this.state.simplifireProjectName;
        this.setState({profileInputModalVisible: true, sfProject, simplifierInputVisible: false, inputModalVisible: false});
        // this.props.loadProject(project, this.state.canFit);
        // this.toggleInputModal();
    };

    calcCanFit = () => {
        let containerHeight = document.getElementsByClassName('profiles-list')[0].clientHeight;
        // we calculate how much patients we can show on the screen and get just that much plus two so that we have content below the fold
        return Math.ceil(containerHeight / 55) + 2;
    };

    toggleTree = (query) => {
        query = this.state.query !== query ? query : '';
        this.setState({query, manualJson: '', file: '', fileJson: ''});
    };

    selectPatient = (selectedPersona) => {
        this.setState({selectedPersona});
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
        !manualJSON && this.state.query && this.props.validateExisting(this.state.query, this.state.selectedProfile);
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

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({activeTab: tab, query: '', manualJson: '', fileJson: '', file: '', selectedPersona: undefined});
    };

    getList = (palette) => {
        let underlineFocusStyle = {borderColor: palette.primary2Color};
        let floatingLabelFocusStyle = {color: palette.primary2Color};

        return <div>
            <TextField id='profile-filter' hintText='Filter profiles by name' onChange={(_, value) => this.delayFiltering(value)}
                       underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
            <List className='profiles-list'>
                {(this.props.fetchingFile || this.props.profilesUploading) && <div className='loader-wrapper' style={{height: '110px', paddingTop: '20px', margin: 0}}>
                    <CircularProgress size={40} thickness={5}/>
                    {!!this.props.profilesUploadingStatus.resourceSavedCount && <div>
                        {this.props.profilesUploadingStatus.resourceSavedCount} resources processed
                    </div>}
                    {this.props.fetchingFile && <div>
                        Fetching project
                    </div>}
                </div>}
                {!this.props.profilesUploading && !this.props.fetchingFile && this.props.profiles && this.props.profiles.map((profile, key) => {
                    if (this.state.filter && profile.profileName.toLowerCase().indexOf(this.state.filter.toLowerCase()) === -1) {
                        return;
                    }
                    let classes = 'profile-list-item' + (this.state.selectedProfile === profile.profileId ? ' active' : '');
                    return <ListItem key={key} className={classes} primaryText={profile.profileName} hoverColor='transparent' onClick={() => this.toggleProfile(profile.profileId)}
                                     rightIconButton={<IconButton tooltip='DELETE' onClick={() => this.props.deleteDefinition(profile.id, this.state.canFit)}>
                                         <DeleteIcon color={palette.primary4Color}/>
                                     </IconButton>}/>;
                })}
                {this.props.profilesLoading && <div className='loader-wrapper' style={{height: '110px', paddingTop: '20px', margin: 0}}>
                    <CircularProgress size={40} thickness={5}/>
                </div>}
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
        this.props.loadProfiles(this.state.canFit, value);
    };

    toggleProfile = (id) => {
        let selectedProfile = this.state.selectedProfile === id ? undefined : id;
        this.setState({selectedProfile});
        this.props.cleanValidationResults();
        if (selectedProfile) {
            let profile = this.props.profiles.find(i => i.profileId === id);
            profile && this.props.loadProfileSDs(profile.id);
        }
    };

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.setState({profileInputModalVisible: true})
        } else {
            this.toggleWarningModal();
        }
    };

    toggleWarningModal = () => {
        this.setState({showZipWarning: !this.state.showZipWarning});
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

const mapStateToProps = state => {
    return {
        sds: state.fhir.sds,
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles,
        profilePagination: state.fhir.profilePagination,
        profilesLoading: state.fhir.profilesLoading,
        profilesUploading: state.fhir.profilesUploading,
        validationExecuting: state.fhir.validationExecuting,
        profilesUploadingStatus: state.fhir.profilesUploadingStatus,
        fetchingFile: state.fhir.fetchingFile
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Profiles));
