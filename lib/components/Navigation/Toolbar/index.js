import React, { Component } from 'react';
import SandboxTitle from './SandboxTitle';
import SandboxSelector from './SandboxSelector';
import Logo from '../../Logo';
import User from '../Toolbar/User';
import './styles.less';
import muiThemeable from 'material-ui/styles/muiThemeable';
import SideNavToggle from "../SideNav/SideNavToggle";
import Help from "./Help";
import Notification from "./Notification";

class Toolbar extends Component {
    render () {
        let bgColor = this.props.muiTheme.palette.primary2Color;
        return <div>
            <header className='toolbar' style={{ backgroundColor: bgColor }}>
                {!this.props.isDashboard && <SideNavToggle click={this.props.click} />}
                <Logo />
                {this.props.sandbox && !this.props.isDashboard && <SandboxSelector {...this.props} />}
                {this.props.isDashboard && <SandboxTitle sandbox={this.props.sandbox} />}
                <User {...this.props} />
                <Notification invitations={this.props.invitations} />
                <Help {...this.props} />
            </header>
        </div>
    };
}

export default muiThemeable()(Toolbar);
