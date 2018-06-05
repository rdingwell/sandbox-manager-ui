import React, { Component } from 'react';
import NavigationItems from '../NavigationItems';
import SideNavToggle from "./SideNavToggle";
import { Divider } from "material-ui";
import './styles.less';

export default class SideNav extends Component {
    render () {
        let classes = 'side-nav' + (this.props.open ? ' open' : ' close');

        return <div className={classes}>
            <nav>
                <NavigationItems {...this.props} />
                <div className='toggle'>
                    <Divider />
                    <SideNavToggle click={this.props.click} />
                </div>
            </nav>
        </div>
    };
}
