import React, { Component } from 'react';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import './styles.less';

export default class SideNavToggle extends Component {
    render () {
        return <div className='navbar-toggle-button' onClick={this.props.click}>
            <Arrow />
        </div>
    };
}
