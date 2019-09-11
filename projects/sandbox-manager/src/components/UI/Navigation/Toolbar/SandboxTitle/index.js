import React, { Component } from 'react';
import strings from '../../../../../assets/strings';
import './styles.less';

export default class SandboxTitle extends Component {
    render () {
        return <div className='sandbox-title'>{strings.defaultSandboxTitle}</div>;
    }
}
