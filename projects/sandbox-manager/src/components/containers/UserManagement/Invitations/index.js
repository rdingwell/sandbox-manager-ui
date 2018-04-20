import React, { Component } from 'react';
import { Paper, RaisedButton, Dialog, TextField } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { inviteNewUser } from '../../../../redux/action-creators';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Invitations extends Component {

    constructor (props) {
        super(props);

        this.state = {
            open: false,
            email: ''
        };
    }

    handleSendInvite = () => {
        this.props.inviteNewUser(this.state.email);
        this.toggleModal();
    };

    handleInviteEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    toggleModal = () => {
        let open = !this.state.open;
        this.setState({open});
    };

    render () {
        const resendStyle = {
            margin: 10
        };

        let rows = this.props.pendingUsers.map(pendingUser => (
            <TableRow>
                <TableRowColumn>{pendingUser.status}</TableRowColumn>
                <TableRowColumn>{pendingUser.invitee.email}</TableRowColumn>
                <TableRowColumn>
                    <RaisedButton label="Resend" style={resendStyle} primary />
                    <RaisedButton label="Revoke" style={resendStyle} secondary />
                </TableRowColumn>
            </TableRow>
        ));

        const actions = [
            <RaisedButton label="Cancel" primary onClick={this.toggleModal} />,
            <RaisedButton label="Invite" primary keyboardFocused onClick={this.handleSendInvite} />
        ];


        return (
            <Paper className="paper-card">
                <h3>Invitations<RaisedButton onClick={this.toggleModal} label="Invite" style={{ float: "right" }} /></h3>
                <Dialog title="Invite New User" actions={actions} modal={false} open={this.state.open} onRequestClose={this.toggleModal}>
                    <TextField fullWidth value={this.state.email} floatingLabelText="Email Address of New User" onChange={(event) => this.handleInviteEmailChange(event)} />
                </Dialog>
                <div className="paper-body">
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>Status</TableHeaderColumn>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                                <TableHeaderColumn />
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
        pendingUsers: state.sandbox.invitations
    }
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ inviteNewUser }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Invitations);
