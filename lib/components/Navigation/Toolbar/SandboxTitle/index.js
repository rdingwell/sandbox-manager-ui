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


    render () {
        let title = strings.defaultSandboxTitle;
        let url = this.props.location;
        let onDashboard = url && url.pathname === '/dashboard';

        if (onDashboard) {
            title = strings.dashboard;
        } else if (this.props.sandbox) {
            title = this.props.sandbox.name;
        }

        return <div className='sandbox-title'>{title}</div>;
    }
}
