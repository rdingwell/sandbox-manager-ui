import React, { Component } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

import './styles.less';

export default class SideNavToggle extends Component {
    render () {
        let classes = 'navbar-toggle-button' + (this.props.topRight ? ' float' : '');

        return <div className={classes}>
            <IconButton onClick={this.props.click} data-qa='side-nav-toggle'>
                {this.props.topRight ? <CloseIcon style={{color: 'gray'}} /> : <MenuIcon style={{color: 'whitesmoke'}} />}
            </IconButton>
        </div>
    };
}
