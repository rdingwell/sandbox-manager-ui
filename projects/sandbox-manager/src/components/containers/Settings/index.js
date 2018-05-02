import React, { Component } from 'react';
import SandboxDetails from './SandboxDetails';
import SandboxReset from './SandboxReset/SandboxReset';
import DeleteSandbox from './DeleteSandbox/DeleteSandbox';
import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { bindActionCreators } from "redux";

class Settings extends Component {

    componentWillMount () {
        this.props.app_setScreen('settings');
    }


    render () {
        return <div>
            <SandboxDetails sandbox={this.props.sandbox} />
            <SandboxReset sandbox={this.props.sandbox} />
            <DeleteSandbox sandbox={this.props.sandbox} />
        </div>
    };
}


const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[0]
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Settings));
