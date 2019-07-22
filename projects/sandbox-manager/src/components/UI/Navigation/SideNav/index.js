import React, { Component } from 'react';
import NavigationItems from '../NavigationItems';
import { Drawer } from "@material-ui/core";
import './styles.less';

export default class SideNav extends Component {
    render () {
        let drawerStyles = {backgroundColor: this.props.theme.p5};

        return <Drawer open={this.props.open} style={drawerStyles} classes={{root: 'side-nav', paper: 'sidenav-paper'}}>
            <span data-qa='side-nav' />
            <NavigationItems {...this.props} />
        </Drawer>
    };
}
