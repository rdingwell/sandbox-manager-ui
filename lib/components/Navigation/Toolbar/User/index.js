import React, { Component } from 'react';
import { Popover, Menu, MenuItem } from 'material-ui';
import strings from '../../../../strings';
import './styles.less';

export default class User extends Component {
    constructor (props) {
        super(props);

        this.state = {
            user: null,
            showDropdown: false,
            anchorEl: undefined
        }
    }

    shouldComponentUpdate (_n, nextState) {
        let user = JSON.parse(localStorage.getItem('oauthUser'));
        if (user != null) {
            if (!this.state.user || this.state.user.name !== user.name) {
                this.setState({ user: user });
                return true;
            }
        }
        return nextState.showDropdown !== this.state.showDropdown;
    }

    render () {
        let onClick = this.handleSignIn;
        let buttonText = [<i key={1} className='fa fa-sign-in' />, <span key={2}> {strings.signInLabel}</span>];
        if (this.state.user) {
            onClick = this.handleDropDown;
            buttonText = this.state.user.name;
        }

        return <div className='user-wrapper'>
            <div>
                <a><span /></a>
            </div>
            <div className='right'>
                <a onClick={onClick}>{buttonText}</a>
            </div>
            <div className='left'><a><i className='fa fa-th fa-lg' /></a></div>
            {this.state.showDropdown &&
            <Popover open={this.state.showDropdown} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleDropDown}
                     className='sandbox-menu-item left-margin'>
                <Menu className='user-menu'>
                    <MenuItem disabled className='user-menu-item static' primaryText={this.state.user.name} />
                    <MenuItem disabled className='user-menu-item static' primaryText={this.state.user.email} />
                    <MenuItem className='user-menu-item active' onClick={this.openSettings}
                              primaryText={<span><i className='fa fa-gear fa-lg' />{strings.settingsLabel}</span>} />
                    <MenuItem className='user-menu-item active' onClick={this.props.signOut}
                              primaryText={<span><i className='fa fa-sign-out' />{strings.signOutLabel}</span>} />
                </Menu>
            </Popover>}
        </div>;
    };

    handleSignIn = () => {
        let url = this.props.location;
        this.props.onAuthInit(url);
    };

    handleDropDown = (event) => {
        this.setState({
            showDropdown: !this.state.showDropdown,
            anchorEl: event.currentTarget
        });
    };

    openSettings = () => {
        window.open(this.props.settings.sandboxManager.userManagementUrl, '_blank');
    };
}
