import React, { Component } from 'react';
import AvailableSandboxes from './AvailableSandboxes/AvailableSandboxes';
import SandboxInvites from "./SandboxInvites/SandboxInvites";
import withErrorHandler from "../../../../../../lib/hoc/withErrorHandler";
import { app_setScreen } from "../../../redux/action-creators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class Dashboard extends Component {
    componentDidMount () {
        this.props.app_setScreen('dashboard');
    }

    render () {
        return (
            <div>
                <AvailableSandboxes />
                <SandboxInvites />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ app_setScreen }, dispatch);

export default connect(undefined, mapDispatchToProps)(withErrorHandler(Dashboard));
