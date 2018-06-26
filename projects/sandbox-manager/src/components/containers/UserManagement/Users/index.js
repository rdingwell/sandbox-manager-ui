import React, { Component } from 'react';
import { List, ListItem, Dialog, RaisedButton, Toggle, IconButton, CircularProgress } from 'material-ui';
import muiThemeable from "material-ui/styles/muiThemeable";
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { fetchSandboxInvites, removeUser, toggleUserAdminRights } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import './styles.less';
import { withRouter } from "react-router";

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
        let titleStyle = {
            backgroundColor: this.props.muiTheme.palette.primary2Color,
            color: this.props.muiTheme.palette.alternateTextColor
        };

        return <div>
            {this.state.userToRemove &&
            <Dialog modal={false} open={this.state.open} onRequestClose={this.handleClose} actionsContainerClassName='invite-dialog-actions-wrapper'
                    actions={[
                        <RaisedButton label="Remove" secondary keyboardFocused onClick={this.deleteSandboxUserHandler}/>,
                        <RaisedButton label="Cancel" primary onClick={this.handleClose}/>
                    ]}>
                <div className='screen-title invitations' style={titleStyle}>
                    <h1 style={titleStyle}>Remove User from Sandbox</h1>
                    <IconButton className="close-button" onClick={this.handleClose}>
                        <i className="material-icons">close</i>
                    </IconButton>
                </div>
                <div className='screen-content'>
                    Are you sure you want to
                    remove {this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.state.userToRemove).user.email}?
                </div>
            </Dialog>}
            {!this.props.updatingUser && <List className='sandbox-users-list'>
                {this.props.sandbox && this.getRows()}
            </List>}
            {this.props.updatingUser && <div className='loader-wrapper'>
                <p>
                    Updating user
                </p>
                <CircularProgress size={80} thickness={5}/>
            </div>}
        </div>;
    }

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

            return <ListItem key={key}>
                <span>{user.name}</span>
                <div className='actions'>
                    {currentIsAdmin && <Toggle label='Admin' labelPosition='right' toggled={isAdmin} onToggle={() => this.toggleAdmin(user.sbmUserId, isAdmin)}
                                               thumbStyle={{ backgroundColor: this.props.muiTheme.palette.primary5Color }}
                                               disabled={!currentIsAdmin} trackStyle={{ backgroundColor: this.props.muiTheme.palette.primary3Color }}
                                               labelStyle={{ position: 'absolute', bottom: '-20px', left: '0' }} className='toggle'/>}
                    {!currentIsAdmin && isAdmin ? <span className='admin-label'>Admin</span> : ''}
                    <div>
                        {currentIsAdmin && <IconButton iconStyle={{ width: '35px', height: '35px', color: this.props.muiTheme.palette.primary4Color }}
                                                       disabled={!currentIsAdmin || !canDelete} style={{ width: '70px', height: '70px' }} onClick={() => this.handleOpen(user.sbmUserId)} tooltip='Remove User'>
                            <DeleteIcon/>
                        </IconButton>}
                    </div>
                </div>
                <span className='subscript'>{user.email}</span>
            </ListItem>
        });
    };

    toggleAdmin = (userId, toggle) => {
        this.props.toggleUserAdminRights(userId, !toggle);
    };

    handleOpen = (userId) => {
        this.setState({ open: true });
        this.setState({ userToRemove: userId });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    deleteSandboxUserHandler = () => {
        this.setState({ userToRemove: undefined });
        this.props.removeUser(this.state.userToRemove, this.props.history);
    };
}

const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        user: state.users.user,
        updatingUser: state.sandbox.updatingUser
    }
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ fetchSandboxInvites, removeUser, toggleUserAdminRights }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(withRouter(Users))));
