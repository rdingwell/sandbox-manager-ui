import React, { Component } from 'react';
import Apps from '../Apps';

export default class Hooks extends Component {
    render () {
        return <Apps {...this.props} hooks title='Registered CDS Services'/>
    }
}
