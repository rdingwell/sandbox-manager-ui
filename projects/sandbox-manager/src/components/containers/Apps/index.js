import React, {Component} from 'react';
import {CircularProgress, Card, CardMedia, CardTitle, Dialog, CardActions, FlatButton, IconButton} from 'material-ui';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AddIcon from "material-ui/svg-icons/content/add";
import LaunchIcon from "material-ui/svg-icons/action/launch";

import {app_setScreen, doLaunch, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import AppDialog from './AppDialog';
import Personas from '../Persona';
import DohMessage from "../../../../../../lib/components/DohMessage";

import './styles.less';
import muiThemeable from "material-ui/styles/muiThemeable";

class Apps extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedApp: undefined,
            appToLaunch: undefined,
            registerDialogVisible: false,
            appIsLoading: false
        };
    }

    componentDidMount() {
        this.props.app_setScreen('apps');
        this.props.loadSandboxApps();
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    componentWillReceiveProps(nextProps) {
        ((this.props.appCreating && !nextProps.appCreating) || (this.props.appDeleting && !nextProps.appDeleting)) && this.props.loadSandboxApps();
        this.state.selectedApp && !nextProps.appLoading && this.setState({appIsLoading: false, selectedApp: nextProps.apps.find(i => i.id === this.state.selectedApp.id)});
    }

    render() {
        let textColor = this.props.muiTheme.palette.primary3Color;

        let appsList = this.props.apps ? this.props.apps.slice() : [];
        appsList.sort((a, b) => a.authClient.clientName.localeCompare(b.authClient.clientName));

        let apps = appsList.map((app, index) => (
            <Card className={`app-card ${this.props.modal ? 'small' : ''} ${this.state.toggledApp === app.id ? 'active' : ''}`} key={index}
                  onTouchStart={() => this.appCardClick(app)} onClick={() => this.props.onCardClick && this.props.onCardClick(app)}>
                <CardMedia className='media-wrapper'>
                    <img style={{height: 200}} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                </CardMedia>
                <CardTitle className='card-title' style={{backgroundColor: 'rgba(0,87,120, 0.75)'}}>
                    <h3 className='app-name'>{app.authClient.clientName}</h3>
                    <div className='app-description'>{app.briefDescription}</div>
                </CardTitle>
                {!this.props.modal && <CardActions className='card-actions-wrapper'>
                    <FlatButton labelStyle={{fontSize: '10px'}} style={{color: 'whitesmoke'}} onClick={(e) => this.handleAppLaunch(e, index)}
                                icon={<LaunchIcon style={{width: '24px', height: '24px'}}/>} label='Launch'/>
                    <FlatButton labelStyle={{fontSize: '10px'}} style={{color: 'whitesmoke'}} onClick={(e) => this.handleAppSelect(e, index)}
                                icon={<SettingsIcon style={{width: '24px', height: '24px'}}/>} label='Settings'/>
                </CardActions>}
            </Card>
        ));

        !this.props.modal && apps.push(<Card className='app-card' key='create'>
            <CardMedia className='media-wrapper register'>
                <div>
                    <FlatButton style={{color: textColor}} label='Register App' labelStyle={{display: 'block'}} onClick={() => this.setState({registerDialogVisible: true})}
                                icon={<AddIcon style={{color: textColor, width: '40px', height: '40px'}}/>}/>
                </div>
            </CardMedia>
        </Card>);

        let dialog = (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.authClient.clientId || 1} onSubmit={this.appSubmit} onDelete={this.delete}
                         muiTheme={this.props.muiTheme} app={this.state.selectedApp} open={!!this.state.selectedApp || this.state.registerDialogVisible}
                         onClose={this.closeAll} doLaunch={this.doLaunch}/>
            : this.state.appToLaunch
                ? <Dialog modal={false} open={!!this.state.appToLaunch} onRequestClose={this.handleAppLaunch}>
                    {this.props.defaultUser && <Personas title='Select a patient' modal muiTheme={this.props.muiTheme} type='Patient' doLaunch={this.doLaunch}/>}
                    {!this.props.defaultUser && <DohMessage message='Please create at least one user persona.'/>}
                </Dialog>
                : null;
        let titleStyle = this.props.modal
            ? {
                backgroundColor: this.props.muiTheme.palette.primary2Color,
                color: this.props.muiTheme.palette.alternateTextColor
            }
            : undefined;

        return <div className={'apps-screen-wrapper' + (this.props.modal ? ' modal' : '')}>
            {dialog}
            <div className='screen-title' style={titleStyle}>
                <h1 style={titleStyle}>{this.props.title ? this.props.title : 'Registered Apps'}</h1>
            </div>
            <div className='screen-content'>
                {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps}
                {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps.length === 0 && this.props.apps &&
                <DohMessage message='There are no apps in this sandbox platform yet.'/>}
                {(this.props.appDeleting || this.props.appCreating || this.props.appLoading) && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
            </div>
        </div>
    }

    appCardClick = (app) => {
        let toggledApp = this.state.toggledApp && this.state.toggledApp === app.id ? undefined : app.id;
        this.setState({toggledApp});
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
        this.props.doLaunch(this.state.appToLaunch || this.state.selectedApp, persona);
        this.closeAll();
    };

    closeAll = () => {
        this.setState({selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false});
    };

    handleAppSelect = (event, index) => {
        event.preventDefault();
        event.stopPropagation();
        let app = this.props.apps[index]
            ? this.props.apps[index]
            : {
                "isDefault": true,
                "authClient": {
                    "clientName": "Bilirubin Chart",
                    "clientId": "bilirubin_chart",
                    "redirectUri": "https://bilirubin-risk-chart-test.hspconsortium.org/index.html"
                },
                "appUri": "https://bilirubin-risk-chart-test.hspconsortium.org/",
                "launchUri": "https://bilirubin-risk-chart-test.hspconsortium.org/launch.html",
                "logoUri": "https://content.hspconsortium.org/images/bilirubin/logo/bilirubin.png",
                "samplePatients": "Patient?_id=BILIBABY,SMART-1288992",
                "briefDescription": "The HSPC Bilirubin Risk Chart is a sample app that demonstrates many of the features of the SMART on FHIR app launch specification and HL7 FHIR standard."
            };
        this.props.apps[index] && this.props.loadApp(app);
        this.setState({selectedApp: app, registerDialogVisible: false, appIsLoading: !!this.props.apps[index]});
    };

    handleAppLaunch = (event, index) => {
        event && event.preventDefault();
        event && event.stopPropagation();
        this.setState({appToLaunch: this.props.apps[index], registerDialogVisible: false});
    };
}

const mapStateToProps = state => {
    return {
        apps: state.apps.apps,
        appLoading: state.apps.loading,
        appCreating: state.apps.creating,
        appDeleting: state.apps.deleting,
        defaultUser: state.sandbox.defaultUser
    };
};


const mapDispatchToProps = dispatch => {
    return bindActionCreators({doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox}, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Apps)))
