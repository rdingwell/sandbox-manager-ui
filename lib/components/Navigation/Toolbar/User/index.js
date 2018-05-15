import React, { Component } from 'react';
import { Popover, Menu, MenuItem } from 'material-ui';
import strings from '../../../../strings';
import './styles.less';

export default class User extends Component {
    constructor (props) {
        super(props);

        this.state = {
            user: null,
            showUserDropdown: false,
            showLinksDropdown: false,
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
        return nextState.showUserDropdown !== this.state.showUserDropdown || nextState.showLinksDropdown !== this.state.showLinksDropdown;
    }

    render () {
        let onClick = this.handleSignIn;
        let buttonText = [<i key={1} className='fa fa-sign-in' />, <span key={2}> {strings.signInLabel}</span>];
        if (this.state.user) {
            onClick = this.handleUSerDropdown;
            buttonText = this.state.user.name;
        }

        return <div className='user-wrapper'>
            <div>
                <a><span /></a>
            </div>
            <div className='right'>
                <a onClick={onClick}>{buttonText}</a>
            </div>
            <div className='left'><a onClick={this.handleLinksDropdown}><i className='fa fa-th fa-lg' /></a></div>
            {this.state.showUserDropdown &&
            <Popover open={this.state.showUserDropdown} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleUSerDropdown}
                     className='sandbox-menu-item left-margin'>
                <Menu className='user-menu'>
                    <MenuItem disabled className='user-menu-item static' primaryText={this.state.user.name} />
                    <MenuItem disabled className='user-menu-item static' primaryText={this.state.user.email} />
                    <MenuItem className='user-menu-item active' onClick={() => this.openLink(this.props.settings.sandboxManager.userManagementUrl)}
                              primaryText={<span><i className='fa fa-gear fa-lg' />{strings.settingsLabel}</span>} />
                    <MenuItem className='user-menu-item active' onClick={this.props.signOut}
                              primaryText={<span><i className='fa fa-sign-out' />{strings.signOutLabel}</span>} />
                </Menu>
            </Popover>}
            <Popover open={this.state.showLinksDropdown} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleLinksDropdown}
                     className='sandbox-menu-item left-margin'>
                <Menu className='links-menu'>
                    <MenuItem className='links-menu-item image static' onClick={() => this.openLink('http://hspconsortium.org')}
                              primaryText={<span><img src={`${window.location.origin}\\img\\hspc-new-logo-md.png`} />
                              <div className='label'>Consortium</div></span>} />
                    <MenuItem className='links-menu-item image static' onClick={() => this.openLink('https://gallery.hspconsortium.org')}
                              primaryText={<span><img className='small' src={`${window.location.origin}\\img\\hspc-gallery-icon.png`} />
                              <div className='label'>Consortium</div></span>} />
                    <MenuItem className='links-menu-item image static' onClick={() => this.openLink('http://developers.hspconsortium.org')}
                              primaryText={<span><img className='small' src={`${window.location.origin}\\img\\hspc-developers-icon.png`} />
                              <div className='label'>Consortium</div></span>} />
                </Menu>
            </Popover>
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

    handleLinksDropdown = (event) => {
        console.log('click!');
        this.setState({
            showLinksDropdown: !this.state.showLinksDropdown,
            anchorEl: event.currentTarget
        });
    };

    openLink = (url) => {
        window.open(url, '_blank');
    };
}
