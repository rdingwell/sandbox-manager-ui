import React, { Component } from 'react';
import SandboxDetails from './SandboxDetails';
import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { bindActionCreators } from "redux";
import muiThemeable from "material-ui/styles/muiThemeable";
import { Tab, Tabs } from 'material-ui';
import UserManagement from '../UserManagement';

import './styles.less';

class Settings extends Component {

    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'details'
        };
    }

    componentWillMount () {
        this.props.app_setScreen('settings');
    }

    render () {
        return <div className='settings-wrapper'>
            <Tabs className='settings-tabs' contentContainerClassName='settings-tabs-container' inkBarStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color }}
                  tabItemContainerStyle={{ backgroundColor: this.props.muiTheme.palette.canvasColor, borderBottom: '1px solid ' + this.props.muiTheme.palette.primary7Color }}>
                <Tab label="Sandbox" className={'sandbox-details tab' + (this.state.activeTab === 'details' ? ' active' : '')} onActive={() => this.setActiveTab('details')}
                     buttonStyle={{ backgroundColor: 'transparent' }}>
                    <SandboxDetails theme={this.props.muiTheme.palette} sandbox={this.props.sandbox}/>
                </Tab>
                <Tab label="Users" className={'sandbox-reset tab' + (this.state.activeTab === 'reset' ? ' active' : '')} onActive={() => this.setActiveTab('reset')}>
                    <UserManagement/>
                </Tab>
            </Tabs>
        </div>;
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };
}


const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId)
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Settings)));
