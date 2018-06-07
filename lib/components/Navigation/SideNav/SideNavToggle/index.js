import React, { Component } from 'react';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { IconButton } from 'material-ui';

import './styles.less';

export default class SideNavToggle extends Component {
    render () {
        let classes = 'navbar-toggle-button' + (this.props.topRight ? ' float' : '');

        return <div className={classes}>
            <IconButton onClick={this.props.click}>
                {this.props.topRight ? <CloseIcon color='gray' /> : <MenuIcon color='whitesmoke' />}
            </IconButton>
        </div>
    };
}
