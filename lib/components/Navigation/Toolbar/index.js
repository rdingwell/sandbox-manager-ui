import React, { Component } from 'react';
import SandboxTitle from './SandboxTitle';
import SandboxSelector from './SandboxSelector';
import Logo from '../../Logo';
import User from '../Toolbar/User';
import './styles.less';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Toolbar extends Component {
    render () {
        let bgColor = this.props.muiTheme.palette.primary1Color;
        return <div>
            <header className='toolbar' style={{backgroundColor: bgColor}}>
                <Logo />
                {this.props.sandbox && <SandboxSelector {...this.props} />}
                <SandboxTitle sandbox={this.props.sandbox} />
                <User {...this.props} />
            </header>
        </div>
    };
}

export default muiThemeable()(Toolbar);
