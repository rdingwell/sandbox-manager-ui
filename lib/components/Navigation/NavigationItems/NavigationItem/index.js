import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './styles.less';

export default class NavigationItem extends Component {
    render () {
        let color = this.props.theme.palette.primary3Color;
        let icon = React.isValidElement(this.props.icon) ? this.props.icon : React.createElement(this.props.icon, {style: {color, fill: color, marginRight: '24px'}});
        return <li className='navigation-item'>
            <NavLink to={this.props.link} activeStyle={{color: this.props.theme.palette.selectedTextColor }} style={{ color: this.props.theme.palette.primary3Color }}>
                {icon}{this.props.text}
            </NavLink>
        </li>
    };
}
