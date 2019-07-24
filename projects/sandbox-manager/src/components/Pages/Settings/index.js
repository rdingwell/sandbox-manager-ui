import React, {Component} from 'react';
import SandboxDetails from './SandboxDetails';
import {app_setScreen, getUserLoginInfo, getDefaultUserForSandbox} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {bindActionCreators} from "redux";
import {Tab, Tabs, withTheme} from '@material-ui/core';
import UserManagement from '../UserManagement';

import './styles.less';

class Settings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'details'
        };
    }

    componentDidMount() {
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.getUserLoginInfo();
    }

    componentWillMount() {
        this.props.app_setScreen('settings');
    }

    render() {
        return <div className='settings-wrapper' data-qa='settings-wrapper'>
            <Tabs className={(this.props.sandbox && this.props.sandbox.visibility === 'PRIVATE' ? 'settings-tabs' : 'settings-tabs-public-app')} classes={{paper: 'settings-tabs-container'}}
                  value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})}>
                <Tab label="Sandbox" className={'sandbox-details tab' + (this.state.activeTab === 'details' ? ' active' : '')} id='details' value='details'/>
                {this.props.sandbox && this.props.sandbox.visibility === 'PRIVATE' &&
                <Tab label="Users" className={'sandbox-reset tab' + (this.state.activeTab === 'reset' ? ' active' : '')} id='reset' value='reset'/>}
            </Tabs>
            {this.state.activeTab === 'details' && <SandboxDetails theme={this.props.theme} sandbox={this.props.sandbox}/>}
            {this.state.activeTab === 'reset' && <UserManagement/>}
        </div>;
    };
}


const mapStateToProps = state => {
    let configLoaded = state.config.xsettings.status === "ready";
    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        configLoaded,
        rehydrated: state.config.rehydrated
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({app_setScreen, getUserLoginInfo, getDefaultUserForSandbox}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Settings)));
