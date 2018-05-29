import React, { Component } from 'react';
import NavigationItems from '../NavigationItems';
import './styles.less';

export default class SideNavToggle extends Component {
    render () {
        let classes = 'side-nav' + (this.props.open ? ' open' : ' close');

        return <div className={classes}>
            <nav>
                <NavigationItems {...this.props} />
            </nav>
        </div>
    };
}
