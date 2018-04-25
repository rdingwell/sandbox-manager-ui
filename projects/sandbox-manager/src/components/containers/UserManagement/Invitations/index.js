import React, { Component } from 'react';
import { Paper, RaisedButton, Dialog, TextField } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { inviteNewUser, removeInvitation } from '../../../../redux/action-creators';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles.less';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Invitations extends Component {

    constructor (props) {
        super(props);

        this.state = {
            open: false,
            email: ''
        };
    }

    handleSendInvite = () => {
        if (EMAIL_REGEX.test(String(this.state.email).toLowerCase())) {
            this.props.inviteNewUser(this.state.email);
            this.toggleModal();
            this.setState({
                email: ''
            });
        } else {
            this.setState({
                emailError: 'Please enter a valid email address!'
            });
        }
    };

    resendEmail = (email) => {
        EMAIL_REGEX.test(String(email).toLowerCase()) && this.props.inviteNewUser(email);
    };

    handleInviteEmailChange = (event) => {
        this.setState({ email: event.target.value, emailError: undefined });
    };

    toggleModal = () => {
        let open = !this.state.open;
        this.setState({ open });
    };

    revokeInvitation = (id) => {
        this.props.removeInvitation(id);
    };

    render () {
        const resendStyle = {
            margin: 10
        };

        let rows = this.props.pendingUsers.map((pendingUser, index) =>
            <TableRow key={index}>
                <TableRowColumn>{pendingUser.status}</TableRowColumn>
                <TableRowColumn>{pendingUser.invitee.email}</TableRowColumn>
                <TableRowColumn>
                    <RaisedButton label="Resend" style={resendStyle} primary onClick={() => this.resendEmail(pendingUser.invitee.email)} />
                    <RaisedButton label="Revoke" style={resendStyle} secondary onClick={() => this.revokeInvitation(pendingUser.id)} />
                </TableRowColumn>
            </TableRow>
        );

        const actions = [
            <RaisedButton key={2} label="Invite" primary keyboardFocused onClick={this.handleSendInvite} />,
            <RaisedButton key={1} label="Cancel" secondary onClick={this.toggleModal} />
        ];


        return (
            <Paper className="paper-card">
                <h3>Invitations<RaisedButton onClick={this.toggleModal} label="Invite" style={{ float: "right" }} /></h3>
                <Dialog title="Invite New User" actions={actions} modal={false} open={this.state.open} onRequestClose={this.toggleModal}
                        actionsContainerClassName='invite-actions-wrapper'>
                    <TextField fullWidth value={this.state.email} floatingLabelText="Email Address of New User" onChange={(event) => this.handleInviteEmailChange(event)}
                               errorText={this.state.emailError} />
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
    return bindActionCreators({ inviteNewUser, removeInvitation }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Invitations);
