import React, { Component } from 'react';

export default class SandboxTitle extends Component {

    state = {
        onDashboard: false
    };

    shouldComponentUpdate (nextProps, nextState) {
        let url = nextProps.location;
        if (url && url.pathname === '/dashboard') {
            this.setState({ onDashboard: true });
        }

        return nextState.onDashboard !== this.state.onDashboard;
    }


    render () {
        const sandboxTitleStyle = {
            textAlign: 'center',
            margin: '0 auto',
            paddingTop: '0px',
            left: '50%',
            color: '#FFF',
            fontSize: '28px',
            fontWeight: 100,
            display: 'inline-block',
            position: 'absolute',
            transform: 'translate(-50%, 0)'
        };

        let title = "The Healthcare Innovation Ecosystem";

        if (this.state.onDashboard) {
            title = "Dashboard";
        } else if (this.props.selectedSandbox) {
            title = this.props.sandbox.name;
        }

        return (
            <div style={sandboxTitleStyle}>{title}</div>
        );
    }
}
