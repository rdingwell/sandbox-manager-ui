import React, {Component, Fragment} from 'react';
import {Chip, Dialog, Fab, IconButton, Menu, MenuItem, Paper, Button, TextField, DialogActions, withTheme} from '@material-ui/core';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import ContentAdd from '@material-ui/icons/Add';

import './styles.less';

const PROFILES = [
    {
        title: 'US-Core',
        id: 'US-Core',
        url: 'https://simplifier.net/US-Core'
    },
    {
        title: 'QiCore',
        id: 'QiCore',
        url: 'https://simplifier.net/QiCore'
    },
    {
        title: 'Custom',
        id: 'manual',
        url: 'Manual'
    }
];

class ProfilesModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canFit: 10,
            project: '',
            profileId: '',
            profileName: '',
            menuActive: false,
            showZipWarning: false,
            showProfileName: false,
            simplifierProjectName: '',
            simplifierInputVisible: false,
            profileInputModalVisible: false
        }
    }

    render() {
        let modals = [];
        let palette = this.props.theme;
        let titleStyle = {
            backgroundColor: palette.p2,
            color: palette.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let actions = [
            <div className='warning-modal-action' key={1}>
                <Button variant='contained' color='primary' onClick={this.toggleWarningModal}>
                    OK
                </Button>
            </div>
        ];
        let inputActions = [
            <div className='warning-modal-action' key={2}>
                <Button variant='contained' color='primary' onClick={this.saveProfile}>
                    OK
                </Button>
            </div>
        ];
        let inputModalActions = [
            <div key={3} className='input-modal-action'>
                <Button variant='contained' color='primary' onClick={this.loadRemoteFile} disabled={!this.state.project || (this.state.project === 'manual' && this.state.simplifierProjectName.length < 2)}>
                    Load
                </Button>
            </div>
        ];
        !this.state.simplifierInputVisible && inputModalActions.shift();
        let closeInputModal = () => this.setState({profileInputModalVisible: false});


        this.state.showZipWarning &&
        modals.push(<Dialog open={this.state.showZipWarning} onClose={this.toggleWarningModal} key={1} classes={{paper: 'wrong-file-type-modal'}}>
            <div className='profiles-modal'>
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
                <DialogActions>
                    {actions}
                </DialogActions>
            </div>
        </Dialog>);

        this.state.inputModalVisible &&
        modals.push(<Dialog open={this.state.inputModalVisible} onClose={this.toggleInputModal} classes={{paper: 'project-input-modal'}} key={2}>
            <Paper className='paper-card'>
                <IconButton style={{color: palette.p5}} className="close-button" onClick={this.toggleInputModal}>
                    <i className="material-icons">close</i>
                </IconButton>
                {this.getModalContent(palette)}
            </Paper>
            <DialogActions>
                {inputModalActions}
            </DialogActions>
        </Dialog>);

        this.state.profileInputModalVisible &&
        modals.push(<Dialog open={this.state.profileInputModalVisible} onClose={closeInputModal} key={3}>
            <div className='profiles-modal'>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={closeInputModal} style={{color: 'whitesmoke'}}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Profile name</h1>
                </div>
                <div style={{paddingTop: '80px', paddingLeft: '16px', paddingRight: '16px'}}>
                    <div style={{textAlign: 'center', fontSize: '.8rem', marginTop: '5px'}}>
                        <span>{this.refs.fileZip.files.length ? this.refs.fileZip.files[0].name : this.state.project !== 'manual' ? this.state.project : this.state.simplifierProjectName}</span>
                    </div>
                    <TextField id='profileName' label='Name' fullWidth onChange={this.setProfileName} value={this.state.profileName} style={{marginBottom: '16px'}} onKeyPress={this.submitMaybe}/>
                    <TextField id='profileId' label='Id' fullWidth disabled value={this.state.profileId}/>
                </div>
            </div>
            <DialogActions>
                {inputActions}
            </DialogActions>
        </Dialog>);

        this.props.selectedResource &&
        modals.push(<Dialog open={!!this.props.selectedResource} onClose={this.props.selectResource} key={4} classes={{paper: 'profiles-modal'}}>
            <div>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={closeInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>{this.props.selectedResource.relativeUrl}</h1>
                </div>
                <div className='resource-info'>

                </div>
            </div>
        </Dialog>);

        return <Fragment>
            <div className='file-load-wrapper'>
                <Fab onClick={this.toggleInputModal} color='primary' className='add-button'>
                    <ContentAdd/>
                </Fab>
            </div>
            {modals}
            <input accept='application/x-bzip application/x-bzip2 application/gzip application/x-rar-compressed application/x-tar application/zip application/x-7z-compressed' type='file' id='fileZip'
                   ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/>
        </Fragment>;
    }

    toggleProfileToBrowse = () => {
        this.props.toggleProfileToBrowse();
        this.setState({toggledRes: undefined, showValidation: false});
    };

    toggleInputModal = () => {
        this.refs.fileZip.value = [];
        this.setState({inputModalVisible: !this.state.inputModalVisible, simplifierInputVisible: false, profileName: '', profileId: '', showProfileName: false});
    };

    getModalContent = (palette) => {
        let title = this.state.simplifierInputVisible ? 'Import profile from Simplifier.net' : 'Import profile';
        let content = this.state.showProfileName
            ? <div style={{padding: '0 13px'}}>
                <TextField id='profileName' label='Name' fullWidth onChange={this.setProfileName} value={this.state.profileName} style={{marginBottom: '16px'}} onKeyPress={e => this.submitMaybe(e, true)}/>
                <TextField id='profileId' label='Id' fullWidth disabled value={this.state.profileId}/>
            </div>
            : !this.state.simplifierInputVisible
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
                          label={<Fragment>
                              <span ref='project-menu'/>
                              <span className='title'>{this.state.project ? this.state.project : 'Select a project to import'}</span>
                              <span className='icon-wrapper'>
                              <DownIcon style={{position: 'relative', top: '2px', color: !this.state.menuActive ? palette.p3 : 'white'}}/>
                          </span>
                          </Fragment>}
                    />
                    {this.state.project !== 'manual' && this.state.project !== '' && <a href={PROFILES.find(i => i.id === this.state.project).url} target='_blank'>Browse project on Simplifier.net</a>}
                    {this.state.project === 'manual' && <TextField value={this.state.simplifierProjectName} onChange={e => this.setState({simplifierProjectName: e.target.value})} id='simplifierProjectName'
                                                                   label='Simplifier.net Project ID' className='project-name' fullWidth/>}
                    <Menu open={this.state.menuActive} anchorEl={this.refs['project-menu']} className='type-filter-menu' onClose={() => this.setState({menuActive: false})}>
                        {PROFILES.map(profile => <MenuItem key={profile.id} className='type-filter-menu-item' onClick={() => this.setState({menuActive: false, project: profile.id})}>
                            {profile.title}
                        </MenuItem>)}
                    </Menu>
                </div>;

        return <Fragment>
            <h3>{title}</h3>
            <div className="client-details">
                {content}
            </div>
        </Fragment>
    };

    toggleWarningModal = () => {
        this.setState({showZipWarning: !this.state.showZipWarning});
    };

    saveProfile = () => {
        this.props.uploadProfile(this.refs.fileZip.files[0], this.state.canFit, this.state.profileName, this.state.profileId);
        this.setState({profileInputModalVisible: false});
    };

    loadRemoteFile = () => {
        if (this.state.profileName && this.state.profileId) {
            let project = this.state.project !== 'manual' ? this.state.project : this.state.simplifierProjectName;
            this.props.loadProject(project, this.state.canFit, this.state.profileName, this.state.profileId);
            this.toggleInputModal();
        } else {
            this.setState({showProfileName: true});
        }
    };

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.setState({profileInputModalVisible: true});
        } else {
            this.toggleWarningModal();
        }
    };

    setProfileName = (e) => {
        let profileName = e.target.value;
        let profileId = profileName.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (profileId.length > 20) {
            profileId = profileId.substring(0, 20);
        }
        this.setState({profileName, profileId});
    };

    submitMaybe = (event, remote) => {
        [10, 13].indexOf(event.charCode) >= 0 && (!remote ? this.saveProfile() : this.loadRemoteFile());
    };
}

export default withTheme(ProfilesModal);
