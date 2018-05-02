import React, { Component } from 'react';
import SideNavToggle from '../SideNav/SideNavToggle';
import SandboxTitle from './SandboxTitle';
import SandboxSelector from './SandboxSelector';
import Logo from '../../Logo';
import User from '../Toolbar/User';
import './styles.less';

export default class Toolbar extends Component {
    render () {
        return (
            <header className='toolbar'>
                {this.props.showSideNav && <div className='menu-selection'>
                    <SideNavToggle click={this.props.click} />
                </div>}
                <Logo />
                <SandboxSelector {...this.props} />
                <SandboxTitle sandbox={this.props.sandbox} />
                <User user={this.props.user} />
            </header>
        );
    };
}
