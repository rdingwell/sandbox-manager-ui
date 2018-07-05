import React from 'react';
import { Dialog, IconButton, RaisedButton } from "material-ui";
import muiThemeable from "material-ui/styles/muiThemeable";

class ConfirmModal extends React.Component {

    render () {
        let actions = [
            <RaisedButton key={1} label={this.props.confirmLabel} secondary onClick={this.props.onConfirm}/>,
            <RaisedButton key={2} label='Cancel' primary onClick={this.props.onCancel} className='cancel-button'/>
        ];

        let titleStyle = {
            backgroundColor: this.props.muiTheme.palette.primary2Color,
            color: this.props.muiTheme.palette.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <Dialog paperClassName='confirm-dialog' modal={false} open={this.props.open} onRequestClose={this.props.onCancel} actions={actions}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onCancel}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h1 style={titleStyle}>{this.props.title}</h1>
            </div>
            <div className='screen-content confirm-dialog-content'>
                {this.props.children}
            </div>
        </Dialog>
    }
}

export default muiThemeable()(ConfirmModal);