import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './styles.less';

export default class NavigationItem extends Component {
    render () {
        return <li className='navigation-item'>
            <NavLink to={this.props.link} activeStyle={{color: this.props.theme.palette.selectedTextColor }} style={{ color: this.props.theme.palette.primary3Color }}>
                {this.props.children}
            </NavLink>
        </li>
    };
}
