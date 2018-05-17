import React, { Component } from 'react';

import './styles.less';

export default class DohMessage extends Component {
    render () {
        return <div className='doh-apps-wrapper'>
            <img src={`${window.location.origin}\\img\\homer.png`} />
            <div className='doh'>D'OH</div>
            <div>{this.props.message}</div>
        </div>
    }
}
