import React, { Component } from 'react';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';
import { IconButton } from "material-ui";

class Page extends Component {
    render () {

        let titleStyles = { color: this.props.muiTheme.palette.primary6Color };

        return <div className={'page-wrapper' + (this.props.scrollContent ? ' scroll' : '')}>
            {!this.props.noTitle && <div className={'page-title-wrapper' + (this.props.titleLeft ? ' left' : '')} style={titleStyles}>
                <span className='page-title'>{this.props.title}</span>
            </div>}
            {this.props.close && <IconButton style={{ color: this.props.muiTheme.palette.primary3Color }} className="close-button" onClick={this.props.close}>
                <i className="material-icons">close</i>
            </IconButton>}
            <div className='page-content-wrapper'>
                {this.props.children}
            </div>
        </div>;
    }
}

export default muiThemeable()(Page);