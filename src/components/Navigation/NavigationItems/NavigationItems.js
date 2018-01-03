import React from 'react';

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem';


const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link={"/apps"}><i className="fa fa-th fa-lg"></i>Apps</NavigationItem>
        <NavigationItem link={"/launch"} active><i className="fa fa-list fa-lg"></i>Launch Scenarios</NavigationItem>
        <NavigationItem link={"/patients"}><i className="fa fa-bed fa-lg"></i>Patients</NavigationItem>
        <NavigationItem link={"/practitioners"}><i className="fa fa-user-md fa-lg"></i>Practitioners</NavigationItem>
        <NavigationItem link={"/personas"}><i className="fa fa-users fa-lg"></i>Personas</NavigationItem>
        <NavigationItem link={"/data-manager"}><i className="fa fa-database fa-lg"></i>Data Manager</NavigationItem>
        <NavigationItem link={"/user-management"}><i className="fa fa-users"></i>User Management</NavigationItem>
        <NavigationItem link={"/integration"}><i className="fa fa-gears fa-lg"></i>EHR Integration</NavigationItem>
        <li className="NavigationItem">
                <a href="https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox">
                        <i className="fa fa-book"></i>Documentation
                </a>
        </li>
        <NavigationItem link={"/settings"}><i className="fa fa-gear fa-lg"></i>Settings</NavigationItem>
    </ul>
);

export default navigationItems;