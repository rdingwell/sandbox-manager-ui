import React, { Component } from 'react';
import { Paper, Dialog, RaisedButton, Toggle } from 'material-ui';

import { fetchSandboxInvites, removeUser, toggleUserAdminRights } from '../../../../redux/action-creators';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from "../../../../../../../lib/hoc/withErrorHandler";

class Users extends Component {

    constructor (props) {
        super(props);

        this.state = {
            userToRemove: '',
            open: false
        };
    }

    componentDidMount () {
        this.props.fetchSandboxInvites();
    }

    render () {
        return <Paper className="paper-card">
            <h3>Users</h3>
            <div className="paper-body">
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Email</TableHeaderColumn>
                            <TableHeaderColumn>Roles</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.props.sandbox && this.getRows()}
                    </TableBody>
                </Table>
            </div>
        </Paper>;
    }

    getRows = () => {
        let users = {};
        this.props.sandbox.userRoles.map(r => {
            users[r.user.id] = users[r.user.id] || {
                name: r.user.name,
                email: r.user.email,
                sbmUserId: r.user.sbmUserId,
                roles: []
            };
            users[r.user.id].roles.push(r.role);
        });

        let keys = Object.keys(users);
        let canDelete = false;
        if (keys.length > 1) {
            canDelete = true;
        }

        return keys.map(key => {
            let user = users[key];
            let isAdmin = user.roles.indexOf('ADMIN') >= 0;

            return <TableRow key={key}>
                <TableRowColumn>
                    {user.name}
                </TableRowColumn>
                <TableRowColumn>
                    {user.email}
                </TableRowColumn>
                <TableRowColumn>
                    <Toggle label='Administrator' labelPosition='right' toggled={isAdmin}
                            onToggle={() => this.toggleAdmin(user.sbmUserId, isAdmin)} />
                </TableRowColumn>
                {this.deleteButton(user.id, user.email, canDelete)}
            </TableRow>
        });
    };

    toggleAdmin = (userId, toggle) => {
        this.props.toggleUserAdminRights(userId, !toggle);
    };

    deleteButton = (userId, email, canDelete) => {
        const actions = [
            <RaisedButton label="Remove" secondary keyboardFocused onClick={this.deleteSandboxUserHandler} />,
            <RaisedButton label="Cancel" primary onClick={this.handleClose} />
        ];
        if (canDelete) {
            return (
                <TableRowColumn>
                    <RaisedButton label="Remove User" onClick={() => this.handleOpen(userId)} secondary />
                    <Dialog title="Remove User from Sandbox" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
                        Are you sure you want to remove {email}?
                    </Dialog>
                </TableRowColumn>
            )
        } else {
            return null;
        }
    };

    handleOpen = (userId) => {
        this.setState({ open: true });
        this.setState({ userToRemove: userId });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    deleteSandboxUserHandler = () => {
        this.props.onRemoveUser(this.state.userToRemove);
    };
}

const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === state.sandbox.selectedSandbox)
    }
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ fetchSandboxInvites, removeUser, toggleUserAdminRights }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Users));
