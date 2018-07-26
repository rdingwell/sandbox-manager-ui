import React, { Component } from 'react';
import { Dialog, IconButton, RaisedButton, TextField } from "material-ui";

import './styles.less';

export default class Edit extends Component {

    constructor (props) {
        super(props);

        this.state = {
            value: props.value || ''
        }
    }

    componentWillReceiveProps (nextProps) {
        nextProps.value !== this.state.value && this.setState({ value: nextProps.value });
    }

    render () {
        let actions = [
            <RaisedButton key={1} label='Save' primary onClick={() => this.props.onConfirm(this.state.value)}/>
        ];

        let titleStyle = {
            backgroundColor: this.props.muiTheme.palette.primary2Color,
            color: this.props.muiTheme.palette.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        let underlineFocusStyle = { borderColor: this.props.muiTheme.palette.primary2Color };
        let floatingLabelFocusStyle = { color: this.props.muiTheme.palette.primary2Color };

        return <Dialog className='edit-launch-scenario-modal' actionsContainerClassName='edit-launch-actions' modal={false} open={this.props.open} onRequestClose={this.props.onCancel} actions={actions}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onCancel}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h1 style={titleStyle}>Edit launch scenario</h1>
            </div>
            <div className='screen-content edit-scenario-dialog-content'>
                <TextField id='description' floatingLabelText='Description' value={this.state.value} fullWidth onChange={(_, value) => this.setState({ value })} errorText={this.props.descriptionError}
                           underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
            </div>
        </Dialog>
    }
}

