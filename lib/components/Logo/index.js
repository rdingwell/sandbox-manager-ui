import React, { Component } from 'react';
import strings from '../../strings';
import './styles.less';

export default class Logo extends Component {
    render () {
        return <div className='logo'>
            <img src='./img/hspc-sndbx-logo-wh@2x.png' alt={strings.logoAltText} />
        </div>
    };
}
