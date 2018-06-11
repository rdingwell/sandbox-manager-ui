import React, { Component } from 'react';
import { Divider, Popover, Menu, MenuItem } from 'material-ui';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import strings from '../../../../strings';
import './styles.less';

export default class User extends Component {
    constructor (props) {
        super(props);

        this.state = {
            user: null,
            showUserDropdown: false,
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
        return nextState.showUserDropdown !== this.state.showUserDropdown;
    }

    render () {
        let onClick = this.state.user ? this.handleUSerDropdown : this.handleSignIn;

        return <div className='user-wrapper'>
            <div>
                <a><span /></a>
            </div>
            <div className='right'>
                <a onClick={onClick}><AccountIcon color='whitesmoke' /></a>
            </div>
            {this.state.showUserDropdown &&
            <Popover open={this.state.showUserDropdown} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleUSerDropdown} className='sandbox-menu-item left-margin'>
                <Menu className='user-menu'>
                    <MenuItem disabled className='user-menu-item static' primaryText={this.state.user.name} />
                    <MenuItem disabled className='user-menu-item static' primaryText={this.state.user.email} />
                    <Divider />
                    <MenuItem className='user-menu-item active' onClick={() => this.openLink(this.props.settings.sandboxManager.userManagementUrl)}
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

    handleUSerDropdown = (event) => {
        this.setState({
            showUserDropdown: !this.state.showUserDropdown,
            anchorEl: event.currentTarget
        });
    };
}
