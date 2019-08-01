import React, { Component } from 'react';

import './styles.less';

export default class DohMessage extends Component {
    render () {
        return <div className={'doh-apps-wrapper' + (this.props.topMargin ? ' margin' : '')}>
            <img src={`${window.location.origin}\\img\\robot.png`} />
            <div>{this.props.message}</div>
        </div>
    }
}
