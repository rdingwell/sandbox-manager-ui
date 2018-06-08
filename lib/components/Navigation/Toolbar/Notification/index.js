import React, { Component } from 'react';
import { Divider, Popover, Menu, Badge } from 'material-ui';
import './styles.less';
import { SocialNotifications } from "material-ui/svg-icons/index";

export default class Notification extends Component {
    constructor (props) {
        super(props);

        this.state = {
            notification: null,
            showDropdown: false,
            anchorEl: undefined
        }
    }

    render () {
        let onClick = this.state.notification ? this.showDropdown : null;
        let icon = <a onClick={onClick}>
            <SocialNotifications color='whitesmoke' />
        </a>;
        let badge = this.props.invitations.length
            ? <Badge badgeContent={this.props.invitations.length} primary badgeStyle={{ top: 12, right: 12 }}>
                {icon}
            </Badge>
            : icon;
        let classes = 'notification-wrapper' + (this.props.invitations.length > 0 ? '' : ' no-badge');

        return <div className={classes}>
            <div>
                <a><span /></a>
            </div>
            <div className='right'>
                {badge}
            </div>
            {this.state.showDropdown &&
            <Popover open={this.state.showDropdown} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.showDropdown} className='left-margin'>
                <Menu className='notification-menu'>
                    <Divider />
                </Menu>
            </Popover>}
        </div>;
    };

    handleSignIn = () => {
        let url = this.props.location;
        this.props.onAuthInit(url);
    };

    showDropdown = (event) => {
        this.setState({
            showDropdown: !this.state.showDropdown,
            anchorEl: event.currentTarget
        });
    };
}
