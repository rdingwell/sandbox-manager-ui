import React, { Component } from 'react';
import { Dialog } from 'material-ui';
import AvailableSandboxes from './AvailableSandboxes';
import CreateSandbox from '../CreateSandbox';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { app_setScreen, fetchSandboxes } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
            ? <Dialog paperClassName='create-sandbox-dialog' modal open={this.state.open}>
                <CreateSandbox onCancel={this.toggle} />
            </Dialog>
            : null;

        return <div>
            {dialog}
            <AvailableSandboxes onToggleModal={this.toggle} />
        </div>;
    }

    toggle = () => {
        this.setState({ open: !this.state.open });
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, fetchSandboxes }, dispatch);

export default connect(undefined, mapDispatchToProps)(withErrorHandler(Dashboard));
