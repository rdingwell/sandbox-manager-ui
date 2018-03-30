import React from 'react';
import './SideNav.less';
import NavigationItems from '../NavigationItems';

export default (props) => {
    let classes = "side-nav" + (props.open ? " open" : " close");

    return <div className={classes}>
        <nav>
            <NavigationItems />
        </nav>
    </div>;
};
