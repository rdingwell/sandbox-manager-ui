import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import * as  actions from '../../../../redux/action-creators';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import { connect } from 'react-redux';

class Users extends Component {

    state = {
        userToRemove: '',
        open: false
    };

    deleteButton = (userId, email, canDelete) => {
        const actions = [
            <RaisedButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Remove"
                primary={true}
                keyboardFocused={true}
                onClick={this.deleteSandboxUserHandler}
            />,
        ];
        if (canDelete) {
            return (
                <TableRowColumn>
                    <RaisedButton label="Remove User" onClick={() => this.handleOpen(userId)} />
                    <Dialog
                        title="Remove User from Sandbox"
                        actions={actions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                    >
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

    render () {
        let role = this.props.sandbox.userRoles.filter(role => role.role === 'ADMIN');

        let canDelete = false;

        if (role.length > 1) {
            canDelete = true;
        }

        let rows = role.map(row => (
            <TableRow key={row.user.id}>
                <TableRowColumn>
                    {row.user.name}
                </TableRowColumn>
                <TableRowColumn>
                    {row.user.email}
                </TableRowColumn>
                <TableRowColumn>
                    Administrator
                </TableRowColumn>
                {this.deleteButton(row.user.id, row.user.email, canDelete)}
            </TableRow>
        ));

        return (
            <Paper className="PaperCard">
                <h3>Users</h3>
                <div className="PaperBody">
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false}
                                     enableSelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                                <TableHeaderColumn>Roles</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {rows}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[ 0 ]
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onRemoveUser: (userId) => dispatch(actions.removeUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
