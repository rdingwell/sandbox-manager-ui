import React, { Component } from 'react';
import { Popover, Menu, Badge, MenuItem, IconButton } from 'material-ui';
import './styles.less';
import { SocialNotifications, NavigationCheck, NavigationClose } from "material-ui/svg-icons/index";

export default class Notification extends Component {
    constructor (props) {
        super(props);

        this.state = {
            notification: null,
            showDropdown: false
        }
    }

    render () {
        let pendingInvitations = this.props.invitations.filter(i => i.status === "PENDING");
        let icon = <a className={this.state.showDropdown ? 'active' : ''} onClick={this.showDropdown}>
            <SocialNotifications color={this.props.theme.primary5Color}/>
        </a>;

        let badge = pendingInvitations.length
            ? <Badge badgeContent={pendingInvitations.length} onClick={this.showDropdown} className='badge'
                badgeStyle={{ top: 12, right: 12, width: 18, height: 18, backgroundColor: this.props.theme.primary4Color, color: this.props.theme.alternateTextColor }}>
                {icon}
            </Badge>
            : icon;
        let classes = 'notification-wrapper' + (pendingInvitations.length > 0 ? '' : ' no-badge');

        return <div className={classes}>
            <div className='right'>
                <span className='anchor' ref='anchor'/>
                {badge}
            </div>
            {this.state.showDropdown &&
            <Popover open={this.state.showDropdown} anchorEl={this.refs.anchor} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'right', vertical: 'top' }} onRequestClose={this.showDropdown} className='notification-popover-wrapper'>
                {this.getPopoverContent(pendingInvitations)}
            </Popover>}
        </div>;
    };

    getPopoverContent = (pendingInvitations) => {
        return pendingInvitations.length > 0
            ? <Menu className='notification-menu'>
                <MenuItem className='notification-menu-item title' disabled key='first'>
                    <div>Invitations</div>
                </MenuItem>
                {pendingInvitations.map((p, key) =>
                    <MenuItem className='notification-menu-item' key={key}
                              primaryText={<div>
                                  <div>
                                      You are invited to <span className='bold'>{p.sandbox.name}</span> <br/>by <span className='bold'>{p.invitedBy.name} / {p.invitedBy.email}</span>
                                  </div>
                                  <div className='actions'>
                                      <IconButton tooltip='Accept' iconStyle={{ color: this.props.theme.primary1Color }}
                                                  onClick={() => this.props.updateSandboxInvite(p, 'ACCEPTED')}>
                                          <NavigationCheck/>
                                      </IconButton>
                                      <IconButton tooltip='Reject' iconStyle={{ color: this.props.theme.primary4Color }}
                                                  onClick={() => this.props.updateSandboxInvite(p, 'REJECTED')}>
                                          <NavigationClose/>
                                      </IconButton>
                                  </div>
                              </div>}/>
                )}
            </Menu>
            : <Menu className='notification-menu no-padding'>
                <MenuItem className='notification-menu-item title' disabled key='first'>
                    <div>No notifications<br/>to show</div>
                </MenuItem>
            </Menu>
    };

    showDropdown = (e) => {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();

        this.setState({
            showDropdown: !this.state.showDropdown
        });
    };
}
