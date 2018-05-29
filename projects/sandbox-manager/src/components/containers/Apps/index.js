import React, { Component } from 'react';
import { CircularProgress, Card, CardMedia, CardTitle, Dialog, Paper, CardActions, RaisedButton, FloatingActionButton } from 'material-ui';
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import { app_setScreen, doLaunch, loadSandboxApps, createApp, updateApp, deleteApp, loadApp } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import AppDialog from './AppDialog';
import Personas from '../Persona';
import DohMessage from "../../../../../../lib/components/DohMessage";

import './styles.less';

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
        const apps = this.props.apps
            ? this.props.apps.map((app, index) => (
                <Card className={`app-card ${this.props.noActions ? 'small' : ''}`} key={index} onClick={() => this.props.onCardClick && this.props.onCardClick(app)}>
                    <CardMedia>
                        <img style={{ height: 200 }} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo' />
                    </CardMedia>
                    <CardTitle>
                        <span className='card-title'>{app.authClient.clientName}</span>
                    </CardTitle>
                    {!this.props.noActions && <CardActions className='card-actions-wrapper'>
                        <FloatingActionButton mini secondary onClick={() => this.handleAppSelect(index)}><SettingsIcon /></FloatingActionButton>
                        <FloatingActionButton mini onClick={() => this.handleAppLaunch(index)}><PlayArrowIcon /></FloatingActionButton>
                    </CardActions>}
                </Card>
            ))
            : [];

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
            <Paper className='paper-card'>
                <h3>{this.props.title ? this.props.title : 'Registered Sandbox Apps'}</h3>
                {!this.props.noActions && <div className='actions'>
                    <RaisedButton primary label='Register App' onClick={() => this.setState({ registerDialogVisible: true })} />
                </div>}
                <div className='paper-body'>
                    {!this.props.appDeleting && !this.props.appCreating && apps}
                    {!this.props.appDeleting && !this.props.appCreating && apps.length === 0 && this.props.apps &&
                    <DohMessage message='There are no apps in this sandbox platform yet.' />}
                    {this.props.appDeleting || this.props.appCreating && <div className='loader-wrapper'><CircularProgress size={80} thickness={5} /></div>}
                </div>
            </Paper>
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


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Apps))
