import React, {Component, Fragment} from 'react';
import {
    Tabs, Tab, Card, Button, List, ListItem, TextField, CircularProgress, Dialog, Switch, IconButton, Paper, Menu, MenuItem, Popover, Chip, withTheme, DialogActions, FormHelperText, FormControl
} from '@material-ui/core';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError
} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../../UI/Page';
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
        let palette = this.props.theme;
        let tab = this.state.activeTab;
        let validateDisabled = (this.state.activeTab === 'browse' && this.state.query.length <= 5)
            || (this.state.activeTab === 'existing' && this.state.query.length <= 5)
            || (this.state.activeTab === 'file' && !this.state.file)
            || (this.state.activeTab === 'json-input' && this.state.manualJson.length <= 5);
        let typeButton = <Switch className='view-toggle' label='Show as table' labelPosition='right' checked={this.state.resultsView} onChange={() => this.setState({resultsView: !this.state.resultsView})}/>;

        let profile = this.state.selectedProfile && this.props.profiles.find(i => i.profileId === this.state.selectedProfile) || {};

        return <Page title={<span>Profiles</span>} helpIcon={<HelpButton style={{marginLeft: '10px'}} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>}>
            {this.getModals()}
            <div className='profiles-wrapper'>
                <Card className='card profile-list-wrapper'>
                    <div className='card-title'>
                        <span>Profiles</span>
                    </div>
                    <div className='card-content import-button left-padding'>
                        <div className='file-load-wrapper'>
                            <input type='file' id='fileZip' ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/>
                            <Button variant='contained' color='primary' onClick={this.toggleInputModal}>
                                Import profile
                            </Button>
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
                        <Tabs className='validate-tabs' style={{backgroundColor: palette.p7}} value={this.state.activeTab} onChange={(_e, activeTab) => this.setActiveTab(activeTab)}>
                            <Tab label={<span><ListIcon style={{color: tab === 'browse' ? palette.p5 : palette.p3}}/> Browse</span>} id='browse' value='browse'/>
                            <Tab label={<span><ListIcon style={{color: tab === 'existing' ? palette.p5 : palette.p3}}/> URI</span>} id='existing' value='existing'/>
                            <Tab label={<span><ListIcon style={{color: tab === 'file' ? palette.p5 : palette.p3}}/> File</span>} id='file' value='file'/>
                            <Tab label={<span><ListIcon style={{color: tab === 'json-input' ? palette.p5 : palette.p3}}/> JSON</span>} id='json-input' value='json-input'/>
                        </Tabs>
                        <div>
                            {this.state.activeTab === 'browse' &&
                            <div className={'manual-input tab' + (tab === 'browse' ? ' active' : '')}>
                                <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)} selectPatient={this.selectPatient}
                                             cleanResults={this.props.cleanValidationResults}/>
                            </div>}
                            {this.state.activeTab === 'existing' &&
                            <div className={'manual-input tab' + (tab === 'existing' ? ' active' : '')}>
                                <div>
                                    <div className='tab-title'>Existing resource uri</div>
                                    <TextField fullWidth id='query' onChange={e => this.setState({query: e.target.value, manualJson: '', file: '', fileJson: ''})} placeholder='Patient/smart-613876'
                                               value={this.state.query}/>
                                </div>
                            </div>}
                            {this.state.activeTab === 'file' &&
                            <div className={'manual-input tab' + (tab === 'file' ? ' active' : '')}>
                                <input value='' type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile} accept='application/json'/>
                                <div className='tab-title'>Validate resource from file</div>
                                <Button variant='contained' color='primary' onClick={() => this.refs.file.click()}>
                                    Select file
                                </Button>
                                {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                            </div>}
                            {this.state.activeTab === 'json-input' &&
                            <div className={'manual-input tab' + (tab === 'json-input' ? ' active' : '')}>
                                <span className='tab-title'>JSON</span>
                                <Button variant='contained' className='clear-json-button' disabled={!this.state.manualJson} color='primary' onClick={() => this.setState({manualJson: ''})}>
                                    CLEAR
                                </Button>
                                <TextField className='manual-input' placeholder='Paste fhir resource json here' multiLine fullWidth value={this.state.manualJson}
                                           onChange={e => this.setState({query: '', file: '', fileJson: '', manualJson: e.target.value})}/>
                            </div>}
                        </div>
                        <Button variant='contained' className='validate-button' colo='primary' onClick={this.validate} disabled={validateDisabled}>
                            Validate
                        </Button>
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
        let palette = this.props.theme;
        let titleStyle = {
            backgroundColor: palette.p2,
            color: palette.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let actions = [
            <div className='warning-modal-action'>
                <Button variant='contained' color='primary' onClick={this.toggleWarningModal}>
                    OK
                </Button>
            </div>
        ];
        let inputActions = [
            <div className='warning-modal-action'>
                <Button variant='contained' color='primary' onClick={this.saveProfile}>
                    OK
                </Button>
            </div>
        ];
        let inputModalActions = [
            <div key={1} className='input-modal-action'>
                <Button variant='contained' color='primary' onClick={this.loadRemoteFile} disabled={!this.state.project || (this.state.project === 'manual' && this.state.simplifireProjectName.length < 2)}>
                    Load
                </Button>
            </div>
        ];
        !this.state.simplifierInputVisible && inputModalActions.shift();
        let closeInputModal = () => this.setState({profileInputModalVisible: false});


        this.state.showZipWarning &&
        modals.push(<Dialog open={this.state.showZipWarning} onClose={this.toggleWarningModal} style={{width: '350px'}} key={1}>
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
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>);

        this.state.inputModalVisible &&
        modals.push(
            <Dialog open={this.state.inputModalVisible} onClose={this.toggleInputModal} styl={{width: '412px'}} classes={{paper: 'project-input-modal'}} key={2}>
                <Paper className='paper-card'>
                    <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={this.toggleInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    {this.getModalContent(palette)}
                </Paper>
                <DialogActions>
                    {inputModalActions}
                </DialogActions>
            </Dialog>);

        this.state.profileInputModalVisible &&
        modals.push(<Dialog open={this.state.profileInputModalVisible} onClose={closeInputModal} style={{width: '412px'}} key={3}>
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
                    <FormControl error={!!this.state.nameError}>
                        <TextField id='profileName' label='Name' fullWidth onChange={this.setProfileName} value={this.state.profileName}/>
                        {!!this.state.nameError && <FormHelperText>{this.state.nameError}</FormHelperText>}
                    </FormControl>
                    <TextField id='profileId' label='Id' fullWidth disabled value={this.state.profileId}/>
                </div>
            </div>
            <DialogActions>
                {inputActions}
            </DialogActions>
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

    setProfileName = (e) => {
        let profileName = e.target.value;
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
                <Button variant='contained' color='primary' onClick={() => this.setState({simplifierInputVisible: true})}>
                    Simplifier.net
                </Button>
                <Button variant='contained' color='primary' onClick={() => this.refs.fileZip.click() || this.toggleInputModal()}>
                    Package
                </Button>
            </div>
            : <div style={{padding: '20px'}}>
                <Chip className={'chip' + (this.state.menuActive ? ' active' : '')} onClick={() => this.setState({menuActive: true})}
                      backgroundColor={this.state.menuActive ? palette.p2 : undefined} labelColor={this.state.menuActive ? palette.alternateTextColor : undefined}>
                    <span ref='project-menu'/>
                    <span className='title'>{this.state.project ? this.state.project : 'Select a project to import'}</span>
                    <span className='icon-wrapper'>
                        <DownIcon style={{position: 'relative', top: '5px'}} color={!this.state.menuActive ? palette.p3 : 'white'}/>
                    </span>
                </Chip>
                {this.state.project !== 'manual' && this.state.project !== '' && <a href={PROFILES.find(i => i.id === this.state.project).url} target='_blank'>Browse project on Simplifier.net</a>}
                {this.state.project === 'manual' && <TextField value={this.state.simplifireProjectName} onChange={(_, simplifireProjectName) => this.setState({simplifireProjectName})}
                                                               id='simplifireProjectName' label='Simplifier.net Project ID' className='project-name'/>}
                <Menu open={this.state.menuActive} anchorEl={this.refs['project-menu']} className='type-filter-menu' onClose={() => this.setState({menuActive: false})}>
                    {PROFILES.map(profile =>
                        <MenuItem className='type-filter-menu-item' onClick={() => this.setState({menuActive: false, project: profile.id})}>
                            profile.title
                        </MenuItem>
                    )}
                </Menu>
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
        return <div>
            <TextField id='profile-filter' placeholder='Filter profiles by name' onChange={e => this.delayFiltering(e.target.value)}/>
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
                                         <DeleteIcon color={palette.p4}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Profiles)));
