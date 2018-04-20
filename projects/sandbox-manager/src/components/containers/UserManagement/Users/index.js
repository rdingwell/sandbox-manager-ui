import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import { fetchSandboxInvites, removeUser } from '../../../../redux/action-creators';

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
                        {this.state.sandbox && this.getRows()}
                    </TableBody>
                </Table>
            </div>
        </Paper>;
    }

    getRows = () => {
        let role = this.props.sandbox.userRoles.filter(role => role.role === 'ADMIN');

        let canDelete = false;

        if (role.length > 1) {
            canDelete = true;
        }

        return role.map(row => (
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
    };

    deleteButton = (userId, email, canDelete) => {
        const actions = [
            <RaisedButton label="Cancel" primary onClick={this.handleClose} />,
            <RaisedButton label="Remove" primary keyboardFocused onClick={this.deleteSandboxUserHandler} />,
        ];
        if (canDelete) {
            return (
                <TableRowColumn>
                    <RaisedButton label="Remove User" onClick={() => this.handleOpen(userId)} />
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
    return bindActionCreators({ fetchSandboxInvites, removeUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Users));
