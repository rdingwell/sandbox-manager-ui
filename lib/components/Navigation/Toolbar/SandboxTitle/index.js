import React, { Component } from 'react';
import strings from '../../../../strings';
import './styles.less';

export default class SandboxTitle extends Component {
    constructor (props) {
        super(props);

        this.state = {
            onDashboard: false
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        let url = nextProps.location;
        if (url && url.pathname === '/dashboard') {
            this.setState({ onDashboard: true });
        }

        return nextState.onDashboard !== this.state.onDashboard;
    }


    render () {
        let title = strings.defaultSandboxTitle;

        if (this.state.onDashboard) {
            title = strings.dashboard;
        } else if (this.props.sandbox) {
            title = this.props.sandbox.name;
        }

        return (
            <div className='sandbox-title'>{title}</div>
        );
    }
}
