import React, { Component } from 'react';
import {
    Dialog, RaisedButton, IconButton, CircularProgress, TableRowColumn, TableRow, TableBody, Table, TableHeader, TableHeaderColumn, Popover, Menu, MenuItem, FloatingActionButton, TextField
} from 'material-ui';
import muiThemeable from "material-ui/styles/muiThemeable";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import Redo from 'material-ui/svg-icons/content/redo';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { inviteNewUser, removeInvitation, fetchSandboxInvites, removeUser, toggleUserAdminRights } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import './styles.less';
import { withRouter } from "react-router";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Users extends Component {

    constructor (props) {
        super(props);

        this.state = {
            userToRemove: '',
            email: '',
            open: false
        };
    }

    componentDidMount () {
        this.props.fetchSandboxInvites();
    }

    render () {
        let titleStyle = {
            backgroundColor: this.props.muiTheme.palette.primary2Color,
            color: this.props.muiTheme.palette.alternateTextColor
        };

        return <div className='users-wrapper'>
            <div>
                <div className='invitation-buttons-wrapper'>
                    <RaisedButton label='INVITE USER' primary onClick={this.showInviteModal}/>
                    <RaisedButton label='MANAGE INVITES' backgroundColor={this.props.muiTheme.palette.primary2Color} labelColor='#FFF' onClick={this.showInvitationsModal}/>
                </div>
                {this.state.inviteModal && <Dialog modal={false} open={this.state.inviteModal} onRequestClose={this.handleClose} actionsContainerClassName='invite-dialog-actions-wrapper'
                                                   paperClassName='invitations-modal' actions={[<RaisedButton label="Send" primary keyboardFocused onClick={this.handleSendInvite}/>]}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>INVITE</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-invite-modal'>
                        <TextField fullWidth value={this.state.email} floatingLabelText="Email Address of New User" onChange={(event) => this.handleInviteEmailChange(event)} errorText={this.state.emailError}/>
                    </div>
                </Dialog>}
                {this.state.invitationsModal && <Dialog modal={false} open={this.state.invitationsModal} onRequestClose={this.handleClose} actionsContainerClassName='invites-dialog-actions-wrapper'
                                                        actions={[<FloatingActionButton onClick={this.toggleCreateModal}><ContentAdd/></FloatingActionButton>]} paperClassName='invitations-modal'>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>INVITES</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-invites-modal'>
                        <Table className='sandbox-invitations-list'>
                            <TableHeader className='invitations-table-header' displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}
                                         style={{ backgroundColor: this.props.muiTheme.palette.primary7Color }}>
                                <TableRow>
                                    <TableHeaderColumn style={{ color: 'black', fontWeight: 'bold', fontSize: '12px' }}>Email</TableHeaderColumn>
                                    <TableHeaderColumn style={{ color: 'black', fontWeight: 'bold', fontSize: '12px' }}>Date Sent</TableHeaderColumn>
                                    <TableHeaderColumn/>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} selectable={false}>
                                {this.props.invitations && this.getInvitations()}
                            </TableBody>
                        </Table>
                    </div>
                </Dialog>}
                {this.state.userToRemove && <Dialog modal={false} open={this.state.open} onRequestClose={this.handleClose} actionsContainerClassName='user-remove-dialog-actions-wrapper'
                                                    actions={[<RaisedButton label="Remove" secondary keyboardFocused onClick={this.deleteSandboxUserHandler}/>]}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>Remove User from Sandbox</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-delete-modal'>
                        Are you sure you want to remove {this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.state.userToRemove).user.email}?
                    </div>
                </Dialog>}
                {!this.props.updatingUser && <Table className='sandbox-users-list'>
                    <TableHeader className='users-table-header' displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} style={{ backgroundColor: this.props.muiTheme.palette.primary7Color }}>
                        <TableRow>
                            <TableHeaderColumn style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Identifier</TableHeaderColumn>
                            <TableHeaderColumn style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Role</TableHeaderColumn>
                            <TableHeaderColumn style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Signed In</TableHeaderColumn>
                            <TableHeaderColumn/>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} selectable={false}>
                        {this.props.sandbox && this.getRows()}
                    </TableBody>
                </Table>}
                {this.props.updatingUser && <div className='loader-wrapper'>
                    <p>
                        Updating user
                    </p>
                    <CircularProgress size={80} thickness={5}/>
                </div>}
            </div>
        </div>;
    }

    toggleCreateModal = () => {
        this.setState({ inviteModal: true, invitationsModal: false });
    };

    showInviteModal = () => {
        this.setState({ inviteModal: true });
    };

    showInvitationsModal = () => {
        this.setState({ invitationsModal: true });
    };

    getRows = () => {
        let users = {};
        let currentIsAdmin = false;
        this.props.sandbox.userRoles.map(r => {
            users[r.user.id] = users[r.user.id] || {
                name: r.user.name,
                email: r.user.email,
                sbmUserId: r.user.sbmUserId,
                roles: []
            };
            r.user.sbmUserId === this.props.user.sbmUserId && r.role === 'ADMIN' && (currentIsAdmin = true);
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

            return <TableRow key={key} selectable={false}>
                <TableRowColumn>{user.name || ''}</TableRowColumn>
                <TableRowColumn>{user.email || ''}</TableRowColumn>
                <TableRowColumn>{!currentIsAdmin && isAdmin ? 'Admin' : ''}</TableRowColumn>
                <TableRowColumn>{!currentIsAdmin && isAdmin ? 'Admin' : ''}</TableRowColumn>
                <TableRowColumn>
                    <IconButton onClick={this.toggleMenu}>
                        <span className='anchor' ref={'anchor'}/>
                        <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                        {this.state.showMenu &&
                        <Popover open={this.state.showMenu} anchorEl={this.refs.anchor} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                 targetOrigin={{ horizontal: 'right', vertical: 'top' }} onRequestClose={this.toggleMenu}>
                            <Menu desktop autoWidth={false} width='100px'>
                                <MenuItem disabled={!canDelete} className='scenario-menu-item' primaryText={isAdmin ? 'Revoke admin' : 'Make admin'}
                                          onClick={() => this.toggleAdmin(key, isAdmin)}/>
                                <MenuItem disabled={!canDelete} className='scenario-menu-item' primaryText='Remove user'
                                          onClick={() => this.handleOpen(user.sbmUserId)}/>
                            </Menu>
                        </Popover>}
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        });
    };

    handleInviteEmailChange = (event) => {
        this.setState({ email: event.target.value, emailError: undefined });
    };

    getInvitations = () => {
        let buttonStyles = { width: '30px', height: '30px', color: this.props.muiTheme.palette.primary3Color };
        let style = { width: '55px', height: '55px' };

        return this.props.invitations.map((invitation, key) => {
            return <TableRow key={key}>
                <TableRowColumn>{invitation.invitee.email}</TableRowColumn>
                <TableRowColumn>Jul 2, 2018</TableRowColumn>
                <TableRowColumn className='invite-buttons-wrapper'>
                    <IconButton iconStyle={buttonStyles} style={style} onClick={() => this.resendEmail(invitation.invitee.email)} tooltip='Resend'>
                        <Redo/>
                    </IconButton>
                    <IconButton iconStyle={buttonStyles} style={style} onClick={() => this.revokeInvitation(invitation.id)} tooltip='Revoke'>
                        <DeleteIcon/>
                    </IconButton>
                </TableRowColumn>
            </TableRow>;
        });
    };

    resendEmail = (email) => {
        EMAIL_REGEX.test(String(email).toLowerCase()) && this.props.inviteNewUser(email);
        this.handleClose();
    };

    revokeInvitation = (id) => {
        this.props.removeInvitation(id);
        this.handleClose();
    };

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    toggleAdmin = (userId, toggle) => {
        this.props.toggleUserAdminRights(userId, !toggle);
    };

    handleOpen = (userId) => {
        this.setState({ open: true, userToRemove: userId });
        this.toggleMenu();
    };

    handleClose = () => {
        this.setState({ open: false, invitationsModal: false, inviteModal: false });
    };

    handleSendInvite = () => {
        if (EMAIL_REGEX.test(String(this.state.email).toLowerCase())) {
            this.props.inviteNewUser(this.state.email);
            this.setState({ email: '' });
            this.handleClose();
        } else {
            this.setState({ emailError: 'Please enter a valid email address!' });
        }
    };

    deleteSandboxUserHandler = () => {
        this.setState({ userToRemove: undefined });
        this.props.removeUser(this.state.userToRemove, this.props.history);
    };
}

const mapStateToProps = state => {
    return {
        invitations: state.sandbox.invitations,
        userInvitesLoading: state.sandbox.invitesLoading,
        inviting: state.sandbox.inviting,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        user: state.users.user,
        updatingUser: state.sandbox.updatingUser
    }
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ fetchSandboxInvites, removeUser, toggleUserAdminRights, inviteNewUser, removeInvitation }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(withRouter(Users))));
