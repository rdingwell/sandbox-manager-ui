import React from 'react';
import {Dialog, IconButton, Button, withTheme} from "@material-ui/core";

import './styles.less';

class ConfirmModal extends React.Component {

    render() {
        let titleStyle = {
            backgroundColor: this.props.theme.p2,
            color: this.props.theme.p8,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let props = {label: this.props.confirmLabel, secondary: true, onClick: this.props.onConfirm};
        if (this.props.red) {
            props.labelColor = this.props.theme.p5;
            props.backgroundColor = this.props.theme.p4;
            props.secondary = false;
        }

        let actions = <Button variant='contained' {...props}/>;

        return <Dialog paperClassName='confirm-dialog' overlayClassName='confirm-dialog' modal={false} open={this.props.open} onRequestClose={this.props.onCancel} actions={actions}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onCancel}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
                <h1 style={titleStyle}>{this.props.title}</h1>
            </div>
            <div className='screen-content confirm-dialog-content'>
                {this.props.children}
            </div>
        </Dialog>
    }
}

export default withTheme(ConfirmModal);