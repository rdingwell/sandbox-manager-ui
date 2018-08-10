import React, { Component } from 'react';
import { Dialog, IconButton, RaisedButton, TextField } from "material-ui";

import './styles.less';

export default class Edit extends Component {

    constructor (props) {
        super(props);

        this.state = {
            title: props.scenario.title || '',
            description: props.scenario.description || ''
        }
    }

    componentWillReceiveProps (nextProps) {
        nextProps.scenario.description !== this.state.description && this.setState({ description: nextProps.scenario.description });
        nextProps.scenario.title !== this.state.title && this.setState({ title: nextProps.scenario.title });
    }

    render () {
        let actions = [
            <RaisedButton key={1} label='Save' primary onClick={() => this.props.onConfirm(this.state)}/>
        ];

        let titleStyle = {
            backgroundColor: this.props.muiTheme.palette.primary2Color,
            color: this.props.muiTheme.palette.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        let underlineFocusStyle = { borderColor: this.props.muiTheme.palette.primary2Color };
        let floatingLabelFocusStyle = { color: this.props.muiTheme.palette.primary2Color };

        return <Dialog className='edit-launch-scenario-modal' actionsContainerClassName='edit-launch-actions' modal={false} open={this.props.open} onRequestClose={this.props.onCancel}
                       actions={actions}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onCancel}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h1 style={titleStyle}>Edit launch scenario</h1>
            </div>
            <div className='screen-content edit-scenario-dialog-content'>
                <div className='summary-item'>
                    <TextField id='title' fullWidth underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} floatingLabelText='Launch Scenario Title'
                               onChange={(_, title) => this.setState({ title: title.substr(0, 75) })} errorText={this.props.titleError} value={this.state.title}/>
                    <span className='subscript'>{this.state.title.length} / 75</span>
                </div>
                <div className='summary-item'>
                    <TextField id='description' fullWidth multiLine underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                               floatingLabelText='Description/Instructions' onChange={(_, description) => this.setState({ description: description.substr(0, 250) })}
                               errorText={this.props.descriptionError} value={this.state.description}/>
                    <span className='subscript'>{this.state.description.length} / 250</span>
                </div>
            </div>
        </Dialog>
    }
}

