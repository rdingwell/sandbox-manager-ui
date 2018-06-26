import React, { Component } from 'react';
import { RaisedButton, Dialog, TextField, List, ListItem, IconButton } from 'material-ui';
import { inviteNewUser, removeInvitation } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles.less';
import { ActionAutorenew } from "material-ui/svg-icons/index";
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import muiThemeable from "material-ui/styles/muiThemeable";

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
        let items = this.props.pendingUsers.map((pendingUser, index) =>
            <ListItem key={index}>
                <span className='email-wrapper'>{pendingUser.invitee.email}</span>
                <span className='action-buttons-wrapper'>
                    <IconButton iconStyle={{ width: '30px', height: '30px', color: this.props.muiTheme.palette.primary1Color }} disabled={false}
                                style={{ width: '55px', height: '55px' }} onClick={() => this.resendEmail(pendingUser.invitee.email)} tooltip='Resend'>
                        <ActionAutorenew />
                    </IconButton>
                    <IconButton iconStyle={{ width: '30px', height: '30px', color: this.props.muiTheme.palette.primary4Color }} disabled={false}
                                style={{ width: '55px', height: '55px' }} onClick={() => this.revokeInvitation(pendingUser.id)} tooltip='Revoke'>
                        <DeleteIcon />
                    </IconButton>
                </span>
            </ListItem>
        );

        const actions = [
            <RaisedButton key={2} label="Invite" primary keyboardFocused onClick={this.handleSendInvite} />,
            <RaisedButton key={1} label="Cancel" secondary onClick={this.toggleModal} />
        ];
        let titleStyle = {
            backgroundColor: this.props.muiTheme.palette.primary2Color,
            color: this.props.muiTheme.palette.alternateTextColor,
            paddingLeft: '10px'
        };

        return <div className='invitations-wrapper'>
            <div className='actions'>
                <RaisedButton onClick={this.toggleModal} primary label="Invite" style={{ float: "right", transform: 'translate(0, -20%)' }} />
            </div>
            <Dialog actions={actions} modal={false} open={this.state.open} onRequestClose={this.toggleModal}
                    bodyClassName='invite-dialog-wrapper' actionsContainerClassName='invite-dialog-actions-wrapper'>
                <div className='screen-title invitations' style={titleStyle}>
                    <h3 style={titleStyle}>Invite a new user</h3>
                    <IconButton className="close-button" onClick={this.toggleModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                </div>
                <div className='screen-content'>
                    <TextField fullWidth value={this.state.email} floatingLabelText="Email Address of New User" onChange={(event) => this.handleInviteEmailChange(event)}
                               errorText={this.state.emailError} />
                </div>
            </Dialog>
            <div className='invitations-list-wrapper'>
                <List>
                    {items}
                </List>
            </div>
        </div>;
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


export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(Invitations));
