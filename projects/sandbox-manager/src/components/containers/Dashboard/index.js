import React, { Component } from 'react';
import { Dialog } from 'material-ui';
import AvailableSandboxes from './AvailableSandboxes';
import SandboxInvites from "./SandboxInvites/SandboxInvites";
import CreateSandbox from '../CreateSandbox';
import withErrorHandler from "../../../../../../lib/hoc/withErrorHandler";
import { app_setScreen, fetchSandboxes } from "../../../redux/action-creators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../redux/action-creators";
import './styles.less';

class Dashboard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            open: false
        }
    }

    componentDidMount () {
        this.props.app_setScreen('dashboard');
    }

    render () {
        let dialog = this.state.open
            ? <Dialog paperClassName="create-sandbox-dialog" modal={true} open={this.state.open}>
                <CreateSandbox onCancel={this.toggle.bind(this)} />
            </Dialog>
            : null;

        return <div>
            {dialog}
            <AvailableSandboxes onToggleModal={this.toggle.bind(this)} />
            {/*<SandboxInvites />*/}
        </div>;
    }

    toggle () {
        this.setState({ open: !this.state.open });
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ app_setScreen, fetchSandboxes }, dispatch);

export default connect(undefined, mapDispatchToProps)(withErrorHandler(Dashboard));
