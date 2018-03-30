import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, Dialog, Paper, CardActions, FlatButton, RaisedButton } from 'material-ui';
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import RegisteredApp from "./RegisteredApp/RegisteredApp";
import Personas from '../Persona';

import './styles.less';

class Apps extends Component {

    state = {
        selectedApp: null,
        appToLaunch: null
    };

    componentDidMount () {
        this.props.app_setScreen('apps');
    }

    handleAppSelect = (index) => {
        this.setState({ selectedApp: this.props.apps[index] });
    };

    handleAppLaunch = (index) => {
        this.setState({ appToLaunch: this.props.apps[index] });
    };

    render () {
        const apps = this.props.apps.map((app, index) => (
            <Card className="app-card" key={index}>
                <CardMedia>
                    <img style={{ height: 150 }} src={app.logoUri} alt="HSPC Logo" />
                </CardMedia>
                <CardTitle><span style={{ fontSize: 18 }}>{app.authClient.clientName}</span></CardTitle>
                <CardActions className="card-actions-wrapper">
                    <RaisedButton labelPosition="before" secondary={true} icon={<SettingsIcon />} onClick={() => this.handleAppSelect(index)} />
                    <RaisedButton labelPosition="before" primary={true} icon={<PlayArrowIcon />} onClick={() => this.handleAppLaunch(index)} />
                </CardActions>
            </Card>
        ));

        let dialog = this.state.selectedApp
            ? <Dialog paperClassName="app-dialog" modal={false} open={!!this.state.selectedApp} onRequestClose={this.handleAppSelect}
                      actions={[<FlatButton key={1} onClick={this.handleAppSelect} label="Cancel" />]}>
                <RegisteredApp app={this.state.selectedApp} />
            </Dialog>
            : this.state.appToLaunch
                ? <Dialog paperClassName="app-dialog" modal={false} open={!!this.state.appToLaunch} onRequestClose={() => this.handleAppLaunch()}>
                    <Personas type="Patient" doLaunch={this.state.appToLaunch} />
                </Dialog>
                : null;

        return <div className="apps-screen-wrapper">
            {dialog}
            <Paper className="paper-card">
                <h3>Registered Sandbox Apps</h3>
                <div className="paper-body">
                    {apps}
                </div>
            </Paper>
        </div>
    };
}

const mapStateToProps = state => {
    return {
        apps: state.apps.apps
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onSaveSandbox: (sandboxDetails) => dispatch(actions.updateSandbox(sandboxDetails)),
        app_setScreen: (screen) => dispatch(actions.app_setScreen(screen))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Apps))
