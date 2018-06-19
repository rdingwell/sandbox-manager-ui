import React, { Component } from 'react';
import SandboxDetails from './SandboxDetails';
import SandboxReset from './SandboxReset';
import DeleteSandbox from './DeleteSandbox';
import { app_setScreen, resetCurrentSandbox, deleteCurrentSandbox } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { bindActionCreators } from "redux";
import { CircularProgress, Tab, Tabs } from 'material-ui';
import muiThemeable from "material-ui/styles/muiThemeable";

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
            {!this.props.resetting && !this.props.deleting
                ? <Tabs className='settings-tabs' contentContainerClassName='settings-tabs-container'>
                    <Tab label="Settings" className={'sandbox-details tab' + (this.state.activeTab === 'details' ? ' active' : '')} onActive={() => this.setActiveTab('details')}>
                        <SandboxDetails sandbox={this.props.sandbox}/>
                    </Tab>
                    <Tab label="Reset" className={'sandbox-reset tab' + (this.state.activeTab === 'reset' ? ' active' : '')} onActive={() => this.setActiveTab('reset')}>
                        <SandboxReset sandbox={this.props.sandbox} resetCurrentSandbox={this.props.resetCurrentSandbox} theme={this.props.muiTheme.palette}/>
                    </Tab>
                    <Tab label="Delete" className={'sandbox-delete tab' + (this.state.activeTab === 'delete' ? ' active' : '')} onActive={() => this.setActiveTab('delete')}>
                        <DeleteSandbox sandbox={this.props.sandbox} deleteCurrentSandbox={this.props.deleteCurrentSandbox} theme={this.props.muiTheme.palette}/>
                    </Tab>
                </Tabs>
                : <div className='loader-wrapper'>
                    <p>
                        {this.props.deleting ? 'Deleting' : 'Resetting'} sandbox
                    </p>
                    <CircularProgress size={80} thickness={5}/>
                </div>}
        </div>;
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };
}


const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        resetting: state.sandbox.resetting,
        deleting: state.sandbox.deleting
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, resetCurrentSandbox, deleteCurrentSandbox }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Settings)));
