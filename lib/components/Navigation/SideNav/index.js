import React, { Component } from 'react';
import NavigationItems from '../NavigationItems';
import { Drawer } from "material-ui";
import './styles.less';
import SideNavToggle from "./SideNavToggle";

export default class SideNav extends Component {
    render () {
        return <Drawer open={this.props.open} className='side-nav' docked>
            <NavigationItems {...this.props} />
        </Drawer>
    };
}
