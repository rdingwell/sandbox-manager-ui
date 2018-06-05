import React, { Component } from 'react';
import { Paper, RaisedButton, CircularProgress, List, ListItem, Avatar } from 'material-ui';
import { fetchSandboxes, selectSandbox } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import { withRouter } from 'react-router';
import './styles.less';
import { ActionLock, ActionLockOpen } from "material-ui/svg-icons/index";

class Index extends Component {

    componentDidMount () {
        this.fetchSandboxes();
    }

    componentDidUpdate (prevProps) {
        !this.props.creatingSandbox && prevProps.creatingSandbox && window.fhirClient && this.props.fetchSandboxes();
    }

    render () {
        let sandboxes = null;
        if (!this.props.loading) {
            sandboxes = this.props.sandboxes.map((sandbox, index) => {
                let avatarClasses = 'sandbox-avatar' + (index % 2 === 0 ? ' three' : '');
                let leftAvatar = <Avatar className={avatarClasses}>DSTU2</Avatar>;
                let rightIcon = index % 2 === 0 ? <ActionLock /> : <ActionLockOpen />;
                return <ListItem key={index} primaryText={sandbox.name} secondaryText={sandbox.description || 'no description available'}
                                 leftIcon={leftAvatar} rightIcon={rightIcon} onClick={() => this.selectSandbox(index)} />
            });

        }

        return <Paper className='sandboxes-wrapper paper-card'>
            <h3>My Sandboxes
                <RaisedButton primary className='create-sandbox-button' label='New Sandbox' onClick={this.handleCreate} labelColor='#fff' />
            </h3>
            <div className='paper-body'>
                <List>
                    {sandboxes}
                </List>
            </div>
        </Paper>;
    }

    handleCreate = () => {
        this.props.onToggleModal && this.props.onToggleModal();
    };

    selectSandbox = (row) => {
        let sandbox = this.props.sandboxes[row];
        localStorage.setItem('sandboxId', sandbox.sandboxId);
        this.props.selectSandbox(sandbox);
    };

    fetchSandboxes () {
        window.fhirClient && this.props.fetchSandboxes();
    }
}

const mapStateToProps = state => {
    return {
        sandboxes: state.sandbox.sandboxes,
        loading: state.sandbox.loading,
        creatingSandbox: state.sandbox.creatingSandbox
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchSandboxes, selectSandbox }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index)));
