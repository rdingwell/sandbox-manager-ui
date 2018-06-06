import React, { Component } from 'react';
import SandboxTitle from './SandboxTitle';
import SandboxSelector from './SandboxSelector';
import Logo from '../../Logo';
import User from '../Toolbar/User';
import './styles.less';
import muiThemeable from 'material-ui/styles/muiThemeable';
import LinksPopover from "./LinksPopover";

class Toolbar extends Component {
    render () {
        let bgColor = this.props.muiTheme.palette.primary3Color;
        return <div>
            <header className='toolbar' style={{ backgroundColor: bgColor }}>
                <LinksPopover />
                <Logo />
                {this.props.sandbox && !this.props.isDashboard && <SandboxSelector {...this.props} />}
                {this.props.isDashboard && <SandboxTitle sandbox={this.props.sandbox} />}
                <User {...this.props} />
            </header>
        </div>
    };
}

export default muiThemeable()(Toolbar);
