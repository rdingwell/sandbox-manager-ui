import React, { Component } from 'react';

import './Toolbar.less';
import SideNavToggle from '../SideNav/SideNavToggle/SideNavToggle';
import SandboxTitle from './SandboxTitle/SandboxTitle';
import Logo from '../../Logo/Logo';
import User from '../Toolbar/User/User';


export default class Toolbar extends Component {
    render () {
        const style = {
            display: 'inline-flex',
            width: 48,
            backgroundColor: '#1564bf',
            height: '100%',
            boxSizing: 'border-box'
        };

        let sideNavToggle = null;
        let sandboxSelector = "";
        let menuSelection = "";

        let sandboxId = localStorage.getItem("sandboxId");
        sandboxId = 'yes';
        if (sandboxId) {
            sideNavToggle = (<SideNavToggle click={this.props.click} />);
            // sandboxSelector = (<SandboxSelector style={selectorStyle}/>);
            menuSelection = (<div style={style}> {sideNavToggle} </div>)
        }

        return (
            <header className="toolbar">
                {menuSelection}
                <Logo />
                {sandboxSelector}
                <SandboxTitle />
                <User user={this.props.user}></User>
            </header>
        );
    };
}
