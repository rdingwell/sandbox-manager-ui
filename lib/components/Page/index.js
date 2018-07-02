import React, { Component } from 'react';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

class Page extends Component {
    render () {

        let titleStyles = { color: this.props.muiTheme.palette.primary6Color };

        return <div className='page-wrapper'>
            <div className='page-title-wrapper' style={titleStyles}>
                <span className='page-title'>{this.props.title}</span>
            </div>
            <div className='page-content-wrapper'>
                {this.props.children}
            </div>
        </div>;
    }
}

export default muiThemeable()(Page);