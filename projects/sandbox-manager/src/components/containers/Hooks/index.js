import React, { Component } from 'react';

import Apps from '../Apps';

class Hooks extends Component {
    render () {
        return <Apps {...this.props} hooks title='Registered Hooks' />;
    }
}

export default Hooks;
