import React, { Component } from 'react';
import NavigationItems from '../NavigationItems';
import { Drawer } from "material-ui";
import './styles.less';

export default class SideNav extends Component {
    render () {
        let drawerStyles = {backgroundColor: this.props.theme.palette.primary5Color};

        return <Drawer open={this.props.open} className='side-nav' docked style={drawerStyles} overlayStyle={drawerStyles} containerStyle={drawerStyles}>
            <NavigationItems {...this.props} />
        </Drawer>
    };
}
