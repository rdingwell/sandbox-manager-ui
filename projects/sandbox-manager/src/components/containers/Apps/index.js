import React, { Component } from 'react';
import { CircularProgress, Card, CardMedia, CardTitle, Dialog, CardActions, FlatButton } from 'material-ui';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AddIcon from "material-ui/svg-icons/content/add";
import LaunchIcon from "material-ui/svg-icons/action/launch";

import { app_setScreen, doLaunch, loadSandboxApps, createApp, updateApp, deleteApp, loadApp } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import AppDialog from './AppDialog';
import Personas from '../Persona';
import DohMessage from "../../../../../../lib/components/DohMessage";

import './styles.less';
import muiThemeable from "material-ui/styles/muiThemeable";

class Apps extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedApp: undefined,
            appToLaunch: undefined,
            registerDialogVisible: false,
            appIsLoading: false
        };
    }

    componentDidMount () {
        this.props.app_setScreen('apps');
        this.props.loadSandboxApps();
    }

    componentWillReceiveProps (nextProps) {
        ((this.props.appCreating && !nextProps.appCreating) || (this.props.appDeleting && !nextProps.appDeleting)) && this.props.loadSandboxApps();
        this.props.appLoading && !nextProps.appLoading && this.setState({ appIsLoading: false, selectedApp: nextProps.apps.find(i => i.id === this.state.selectedApp.id) });
    }

    render () {
        let textColor = this.props.muiTheme.palette.primary3Color;

        let apps = this.props.apps
            ? this.props.apps.map((app, index) => (
                <Card className={`app-card ${this.props.noActions ? 'small' : ''}`} key={index} onClick={() => this.props.onCardClick && this.props.onCardClick(app)}>
                    <CardMedia className='media-wrapper'>
                        <img style={{ height: 200 }} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo' />
                    </CardMedia>
                    <CardTitle className='card-title' style={{backgroundColor: 'rgba(0,87,120, 0.75)'}}>
                        <h3 className='app-name'>{app.authClient.clientName}</h3>
                        <div className='app-description'>{app.briefDescription}</div>
                    </CardTitle>
                    {!this.props.noActions && <CardActions className='card-actions-wrapper'>
                        <FlatButton labelStyle={{fontSize: '10px'}} style={{color: 'whitesmoke'}} onClick={() => this.handleAppLaunch(index)}
                                    icon={<LaunchIcon style={{width: '24px', height: '24px'}} />} label='Launch' />
                        <FlatButton labelStyle={{fontSize: '10px'}} style={{color: 'whitesmoke'}} onClick={() => this.handleAppSelect(index)}
                                    icon={<SettingsIcon style={{width: '24px', height: '24px'}} />} label='Settings' />
                    </CardActions>}
                </Card>
            ))
            : [];
        apps.unshift(<Card className='app-card' key='create'>
            <CardMedia className='media-wrapper register'>
                <div>
                    <FlatButton style={{color: textColor}} label='Register App' labelStyle={{display: 'block'}} onClick={() => this.setState({ registerDialogVisible: true })}
                                icon={<AddIcon style={{color: textColor, width: '40px', height: '40px'}} />} />
                </div>
            </CardMedia>
            <CardTitle>
                <span>Explore a demo app</span>
            </CardTitle>
        </Card>);

        let dialog = (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.authClient.clientId || 1} onSubmit={this.appSubmit} onDelete={this.delete}
                         app={this.state.selectedApp} open={!!this.state.selectedApp || this.state.registerDialogVisible} onClose={this.closeAll} />
            : this.state.appToLaunch
                ? <Dialog paperClassName='app-dialog' modal={false} open={!!this.state.appToLaunch} onRequestClose={this.handleAppLaunch}>
                    <Personas type='Patient' doLaunch={this.doLaunch} />
                </Dialog>
                : null;

        return <div className='apps-screen-wrapper'>
            {dialog}
            <div className='screen-title'>
                <h1>{this.props.title ? this.props.title : 'Registered Apps'}</h1>
            </div>
            <div>
                {!this.props.appDeleting && !this.props.appCreating && apps}
                {!this.props.appDeleting && !this.props.appCreating && apps.length === 0 && this.props.apps &&
                <DohMessage message='There are no apps in this sandbox platform yet.' />}
                {this.props.appDeleting || this.props.appCreating && <div className='loader-wrapper'><CircularProgress size={80} thickness={5} /></div>}
            </div>
        </div>
    }

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
        this.props.doLaunch(this.state.appToLaunch, persona);
        this.closeAll();
    };

    closeAll = () => {
        this.setState({ selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false });
    };

    handleAppSelect = (index) => {
        this.props.loadApp(this.props.apps[index]);
        this.setState({ selectedApp: this.props.apps[index], registerDialogVisible: false, appIsLoading: true });
    };

    handleAppLaunch = (index) => {
        this.setState({ appToLaunch: this.props.apps[index], registerDialogVisible: false });
    };
}

const mapStateToProps = state => {
    return {
        apps: state.apps.apps,
        appLoading: state.apps.loadingApp,
        appCreating: state.apps.creating,
        appDeleting: state.apps.deleting
    };
};


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Apps)))
