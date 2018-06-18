import React, {Component} from 'react';
import {Popover, Menu, Badge, MenuItem, IconButton} from 'material-ui';
import './styles.less';
import {SocialNotifications, NavigationCheck, NavigationClose} from "material-ui/svg-icons/index";

export default class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: null,
            showDropdown: false,
            anchorEl: undefined
        }
    }

    render() {
        let pendingInvitations = this.props.invitations.filter(i => i.status === "PENDING");
        let icon = <a><SocialNotifications color='whitesmoke'/></a>;

        let badge = pendingInvitations.length
            ? <Badge badgeContent={pendingInvitations.length} onClick={this.showDropdown}
                     badgeStyle={{top: 12, right: 12, backgroundColor: this.props.theme.primary4Color, color: this.props.theme.alternateTextColor}}>
                {icon}
            </Badge>
            : icon;
        let classes = 'notification-wrapper' + (pendingInvitations.length > 0 ? '' : ' no-badge');

        return <div className={classes}>
            <div className={'right' + (pendingInvitations.length > 0 ? '' : ' disabled')}>
                {badge}
            </div>
            {this.state.showDropdown &&
            <Popover open={this.state.showDropdown && pendingInvitations.length > 0} anchorEl={this.state.anchorEl} anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                     targetOrigin={{horizontal: 'left', vertical: 'top'}} onRequestClose={this.showDropdown} className='left-margin'>
                <Menu className='notification-menu'>
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
                                          <IconButton tooltip='Accept' iconStyle={{color: this.props.theme.primary1Color}}
                                                      onClick={() => this.props.updateSandboxInvite(p, 'ACCEPTED')}>
                                              <NavigationCheck/>
                                          </IconButton>
                                          <IconButton tooltip='Reject' iconStyle={{color: this.props.theme.primary4Color}}
                                                      onClick={() => this.props.updateSandboxInvite(p, 'REJECTED')}>
                                              <NavigationClose/>
                                          </IconButton>
                                      </div>
                                  </div>}/>
                    )}
                </Menu>
            </Popover>}
        </div>;
    };

    showDropdown = (event) => {
        this.setState({
            showDropdown: !this.state.showDropdown,
            anchorEl: event.currentTarget
        });
    };
}
