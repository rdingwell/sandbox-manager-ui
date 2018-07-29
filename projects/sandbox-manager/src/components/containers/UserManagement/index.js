import React, { Component } from 'react';
import {
    Dialog, RaisedButton, IconButton, CircularProgress, TableRowColumn, TableRow, TableBody, Table, TableHeader, TableHeaderColumn, Popover, Menu, MenuItem, FloatingActionButton, TextField, Snackbar
} from 'material-ui';
import muiThemeable from "material-ui/styles/muiThemeable";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import Redo from 'material-ui/svg-icons/content/redo';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { inviteNewUser, removeInvitation, fetchSandboxInvites, removeUser, toggleUserAdminRights } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
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
            action: '',
            open: false
        };
    }

    componentDidMount () {
        this.props.fetchSandboxInvites();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let titleStyle = {
            backgroundColor: palette.primary2Color,
            color: palette.alternateTextColor
        };
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        let sending = this.state.action === 'sending';

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
                        <TextField fullWidth value={this.state.email} floatingLabelText="Email Address of New User" onChange={(event) => this.handleInviteEmailChange(event)} errorText={this.state.emailError}
                                   underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
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
                                                    actions={<RaisedButton label="Remove" labelColor={this.props.muiTheme.palette.primary5Color} backgroundColor={this.props.muiTheme.palette.primary4Color}
                                                                           keyboardFocused onClick={this.deleteSandboxUserHandler}/>}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>Remove User from Sandbox</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-delete-modal'>
                        Are you sure you want to remove {(this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.state.userToRemove) || { user: { email: '"not found"' } }).user.email}?
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
            <Snackbar open={this.props.inviting} message={sending ? 'Sending invitation to user...' : 'Deleting user invitation...'} autoHideDuration={30000}
                      bodyStyle={{margin: '0 auto', backgroundColor: sending ? palette.primary2Color : palette.primary4Color}}/>
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
        let adminCount = 0;
        this.props.sandbox.userRoles.map(r => {
            users[r.user.id] = users[r.user.id] || {
                name: r.user.name,
                email: r.user.email,
                sbmUserId: r.user.sbmUserId,
                roles: []
            };
            r.user.sbmUserId === this.props.user.sbmUserId && r.role === 'ADMIN' && (currentIsAdmin = true);
            r.role === 'ADMIN' && (adminCount++);
            users[r.user.id].roles.push(r.role);
        });

        let keys = Object.keys(users);
        let canDelete = keys.length > 1 && adminCount > 1;

        return keys.map(key => {
            let user = users[key];
            let isAdmin = user.roles.indexOf('ADMIN') >= 0;

            let canRemoveUser = canDelete && (currentIsAdmin || user.sbmUserId === this.props.user.sbmUserId);
            let lastLogin = (this.props.loginInfo.find(i => i.sbmUserId === this.props.user.sbmUserId) || {}).accessTimestamp;
            lastLogin = lastLogin
                ? new moment(lastLogin).format('YYYY-MM-DD HH:MM')
                : 'unknown';

            return <TableRow key={key} selectable={false}>
                <TableRowColumn>{user.name || ''}</TableRowColumn>
                <TableRowColumn>{user.email || ''}</TableRowColumn>
                <TableRowColumn>{isAdmin ? 'Admin' : ''}</TableRowColumn>
                <TableRowColumn>Last signed in: {lastLogin}</TableRowColumn>
                <TableRowColumn>
                    <IconButton onClick={() => this.toggleMenu(key)}>
                        <span className='anchor' ref={'anchor_' + key}/>
                        <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                        {this.state.showMenu && key === this.state.menuItem &&
                        <Popover open={this.state.showMenu && key === this.state.menuItem} anchorEl={this.refs['anchor_' + key]} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                 targetOrigin={{ horizontal: 'right', vertical: 'top' }} onRequestClose={this.toggleMenu}>
                            <Menu desktop autoWidth={false} width='100px'>
                                <MenuItem disabled={!canDelete || !currentIsAdmin} className='scenario-menu-item' primaryText={isAdmin ? 'Revoke admin' : 'Make admin'}
                                          onClick={() => this.toggleAdmin(user.sbmUserId, isAdmin)}/>
                                <MenuItem disabled={!canRemoveUser} className='scenario-menu-item' primaryText='Remove user'
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
        let revokeStyle = { width: '30px', height: '30px', color: this.props.muiTheme.palette.primary4Color };

        return this.props.invitations.map((invitation, key) => {
            return <TableRow key={key}>
                <TableRowColumn>{invitation.invitee.email}</TableRowColumn>
                <TableRowColumn>Jul 2, 2018</TableRowColumn>
                <TableRowColumn className='invite-buttons-wrapper'>
                    <IconButton iconStyle={buttonStyles} style={style} onClick={() => this.resendEmail(invitation.invitee.email)} tooltip='Resend'>
                        <Redo/>
                    </IconButton>
                    <IconButton iconStyle={revokeStyle} style={style} onClick={() => this.revokeInvitation(invitation.id)} tooltip='Revoke'>
                        <DeleteIcon/>
                    </IconButton>
                </TableRowColumn>
            </TableRow>;
        });
    };

    resendEmail = (email) => {
        EMAIL_REGEX.test(String(email).toLowerCase()) && this.props.inviteNewUser(email);
        this.handleClose();
        this.setState({action: 'sending'});
    };

    revokeInvitation = (id) => {
        this.props.removeInvitation(id);
        this.handleClose();
        this.setState({action: 'rejecting'});
    };

    toggleMenu = (menuItem) => {
        this.setState({ showMenu: !this.state.showMenu, menuItem });
    };

    toggleAdmin = (userId, toggle) => {
        this.props.toggleUserAdminRights(userId, !toggle);
        this.toggleMenu();
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
            this.setState({ email: '', action: 'sending' });
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
        updatingUser: state.sandbox.updatingUser,
        loginInfo: state.sandbox.loginInfo
    }
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ fetchSandboxInvites, removeUser, toggleUserAdminRights, inviteNewUser, removeInvitation }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(withRouter(Users))));
