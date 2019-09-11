import React, {Component} from 'react';

import './styles.less';
import {IconButton} from "@material-ui/core";

class Page extends Component {
    render() {

        let titleStyles = {color: '#3D3D3D'};

        return <div className={'page-wrapper' + (this.props.scrollContent ? ' scroll' : '')}>
            {!this.props.noTitle && <div className={'page-title-wrapper' + (this.props.titleLeft ? ' left' : '')} style={titleStyles}>
                <span className='page-title'>{this.props.title}</span>
                {this.props.helpIcon && this.props.helpIcon}
            </div>}
            {this.props.close && <IconButton style={{color: '#757575'}} className="close-button" onClick={this.props.close}>
                <i className="material-icons" data-qa="modal-close-button">close</i>
            </IconButton>}
            <div className='page-content-wrapper'>
                {this.props.children}
            </div>
        </div>;
    }
}

export default Page;
