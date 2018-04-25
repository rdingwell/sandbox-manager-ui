import React, { Component } from 'react';
import './styles.less';

export default class SideNavToggle extends Component {
    render () {
        return <div className='navbar-toggle-button' onClick={this.props.click}>
            <i className='fa fa-bars' aria-hidden='true' />
        </div>
    };
}
