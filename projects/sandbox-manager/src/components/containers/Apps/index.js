import React, { Component } from 'react';
import { CircularProgress, Card, CardMedia, CardTitle, Dialog, CardActions, FlatButton, IconButton, FloatingActionButton, RadioButton } from 'material-ui';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ContentAdd from 'material-ui/svg-icons/content/add';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import Page from 'sandbox-manager-lib/components/Page';
import ConfirmModal from 'sandbox-manager-lib/components/ConfirmModal';

import { lookupPersonasStart, app_setScreen, doLaunch, fetchPersonas, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';

import AppDialog from './AppDialog';
import PersonaList from "../Persona/List";
import DohMessage from "sandbox-manager-lib/components/DohMessage";

import './styles.less';
import muiThemeable from "material-ui/styles/muiThemeable";

class Apps extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedApp: undefined,
            appToLaunch: undefined,
            registerDialogVisible: false,
            showConfirmModal: false,
            appIsLoading: false
        };
    }

    componentDidMount () {
        this.props.app_setScreen('apps');
        this.props.loadSandboxApps();
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.fetchPersonas(PersonaList.TYPES.patient);
    }

    componentWillReceiveProps (nextProps) {
        ((this.props.appCreating && !nextProps.appCreating) || (this.props.appDeleting && !nextProps.appDeleting)) && this.props.loadSandboxApps();
        this.state.selectedApp && !nextProps.appLoading && this.setState({ appIsLoading: false, selectedApp: nextProps.apps.find(i => i.id === this.state.selectedApp.id) });
    }

    render () {
        let appsList = this.props.apps ? this.props.apps.slice() : [];
        appsList.sort((a, b) => a.authClient.clientName.localeCompare(b.authClient.clientName));

        let apps = appsList.map((app, index) => (
            <Card className={`app-card ${this.props.modal ? 'small' : ''} ${this.state.toggledApp === app.id ? 'active' : ''}`} key={index}
                  onTouchStart={() => this.appCardClick(app)} onClick={() => this.props.onCardClick && this.props.onCardClick(app)}>
                <CardMedia className='media-wrapper'>
                    <img style={{ height: '100%' }} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                </CardMedia>
                <CardTitle className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                    <h3 className='app-name'>{app.authClient.clientName}</h3>
                    {this.props.modal && <RadioButton className='app-radio' value="selected" checked={this.props.selectedApp ? app.id === this.props.selectedApp.id : false}/>}
                    <div className='app-description'>{app.briefDescription}</div>
                </CardTitle>
                {!this.props.modal && <CardActions className='card-actions-wrapper'>
                    <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleAppLaunch(e, app)}
                                icon={<LaunchIcon style={{ width: '24px', height: '24px' }}/>} label='Launch'/>
                    <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleAppSelect(e, app)}
                                icon={<SettingsIcon style={{ width: '24px', height: '24px' }}/>} label='Settings'/>
                </CardActions>}
            </Card>
        ));

        let props = {
            type: 'Patient', click: this.doLaunch, personaList: this.props.personas, modal: true, theme: this.props.muiTheme.palette, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.props.fetchPersonas, loading: this.props.personaLoading, close: this.handleAppLaunch
        };

        let dialog = (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.authClient.clientId || 1} onSubmit={this.appSubmit} onDelete={this.toggleConfirmation}
                         muiTheme={this.props.muiTheme} app={this.state.selectedApp} open={!!this.state.selectedApp || this.state.registerDialogVisible}
                         onClose={this.closeAll} doLaunch={this.doLaunch}/>
            : this.state.appToLaunch
                ? <Dialog modal={false} open={!!this.state.appToLaunch} onRequestClose={this.handleAppLaunch} className='launch-app-dialog' autoScrollBodyContent>
                    {this.props.defaultUser && <PersonaList {...props} titleLeft scrollContent/>}
                    {!this.props.defaultUser && <DohMessage message='Please create at least one user persona.'/>}
                </Dialog>
                : null;

        return <Page noTitle={this.props.modal} title={this.props.title ? this.props.title : 'Registered Apps'}>
            <div className='apps-page-wrapper'>
                {!this.props.modal && <div className='filter-wrapper'>
                    <div className='actions'>
                        <span className='dummy-expander' />
                        <FloatingActionButton onClick={() => this.setState({ registerDialogVisible: true })}>
                            <ContentAdd/>
                        </FloatingActionButton>
                    </div>
                </div>}
                <div className={'apps-screen-wrapper' + (this.props.modal ? ' modal' : '')}>
                    {dialog}
                    <div className='screen-content'>
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps}
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps.length === 0 && this.props.apps &&
                        <DohMessage message='There are no apps in this sandbox platform yet.'/>}
                        {(this.props.appDeleting || this.props.appCreating || this.props.appLoading) && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                    </div>
                </div>
            </div>
            {this.state.showConfirmModal && <ConfirmModal red open={this.state.showConfirmModal} confirmLabel='Delete' onConfirm={this.delete} onCancel={this.toggleConfirmation} title='Confirm'>
                <p>
                    Are you sure you want to delete app "{this.state.selectedApp ? this.state.selectedApp.authClient.clientName : ''}"?<br/>
                    Deleting this app will result in the deletion of all the launch scenarios connected to it.
                </p>
            </ConfirmModal>}
        </Page>
    }

    toggleConfirmation = () => {
        this.setState({ showConfirmModal: !this.state.showConfirmModal });
    };

    appCardClick = (app) => {
        let toggledApp = this.state.toggledApp && this.state.toggledApp === app.id ? undefined : app.id;
        this.setState({ toggledApp });
    };

    delete = () => {
        this.props.deleteApp(this.state.selectedApp);
        this.closeAll();
        setTimeout(this.props.loadSandboxApps, 2000);
    };

    appSubmit = (app) => {
        this.state.selectedApp ? this.props.updateApp(app, this.state.selectedApp) : this.props.createApp(app);
        this.closeAll();
    };

    register = () => {
        this.closeAll();
    };

    doLaunch = (persona) => {
        this.props.doLaunch(this.state.appToLaunch || this.state.selectedApp, persona.id);
        this.closeAll();
    };

    closeAll = () => {
        this.setState({ selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false, showConfirmModal: false });
    };

    handleAppSelect = (event, app) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.loadApp(app);
        this.setState({ selectedApp: app, registerDialogVisible: false, appIsLoading: true });
    };

    handleAppLaunch = (event, app) => {
        event && event.preventDefault();
        event && event.stopPropagation();
        this.setState({ appToLaunch: app, registerDialogVisible: false });
    };
}

const mapStateToProps = state => {
    return {
        apps: state.apps.apps,
        appLoading: state.apps.loading,
        selecting: state.sandbox.selecting,
        appCreating: state.apps.creating,
        appDeleting: state.apps.deleting,
        defaultUser: state.sandbox.defaultUser,
        personas: state.persona.patients,
        personaLoading: state.persona.loading
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPersonas, doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, lookupPersonasStart }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Apps)))
