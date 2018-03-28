import React, { Component } from 'react';
import AvailableSandboxes from './AvailableSandboxes/AvailableSandboxes';
import SandboxInvites from "./SandboxInvites/SandboxInvites";

class Dashboard extends Component {
    render () {
        return (
            <div>
                <AvailableSandboxes />
                <SandboxInvites />
            </div>
        );
    }
}

export default Dashboard;
