import React, { Component } from 'react';
import SandboxTitle from './SandboxTitle';
import SandboxSelector from './SandboxSelector';
import Logo from '../../Logo';
import User from '../Toolbar/User';
import './styles.less';

export default class Toolbar extends Component {
    render () {
        return <div>
            <header className='toolbar'>
                <Logo />
                {this.props.sandbox && <SandboxSelector {...this.props} />}
                <SandboxTitle sandbox={this.props.sandbox} />
                <User {...this.props} />
            </header>
        </div>
    };
}
