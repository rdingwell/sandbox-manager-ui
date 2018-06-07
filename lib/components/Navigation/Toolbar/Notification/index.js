import React, { Component } from 'react';
import { Divider, Popover, Menu, MenuItem } from 'material-ui';
import strings from '../../../../strings';
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

    // shouldComponentUpdate (_n, nextState) {
        // let user = JSON.parse(localStorage.getItem('oauthUser'));
        // if (user != null) {
        //     if (!this.state.notification || this.state.notification.name !== user.name) {
        //         this.setState({ user: user });
        //         return true;
        //     }
        // }
        // return nextState.showDropdown !== this.state.showDropdown;
    // }

    render () {
        let onClick = this.state.notification ? this.showDropdown : null;

        return <div className='notification-wrapper'>
            <div>
                <a><span /></a>
            </div>
            <div className='right'>
                <a onClick={onClick}><SocialNotifications color='whitesmoke' /></a>
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
