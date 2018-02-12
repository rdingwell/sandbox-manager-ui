import React from 'react';

import classes from './SideNav.css';

import NavigationItems from '../NavigationItems/NavigationItems';

const sideNav = (props) => {
    let attachedClasses = [classes.SideNav, classes.Close];

    if(props.open){
        attachedClasses = [classes.SideNav, classes.Open];
    }

    return (
        <div className={attachedClasses.join(' ')}>
            <nav>
                <NavigationItems/>
            </nav>
        </div>
    );
};

export default sideNav;