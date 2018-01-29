import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';


import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';


import axios from '../../../axiox';

class RegisteredApp extends Component{
    state = {
        value: 'PublicClient'
    };

    handleChange = (event, index, value) => {
        this.setState({value: value});
    };


    render() {
        const registeredAppStyle = {
            width: '45%',
            float: 'right'
        };

        const buttonStyle = {
            margin: 12,
        };

        const textFieldStyle = {
            width: '100%'
        };

        let clientUri = null;
        let clientId = null;

        if(this.props.app){
            clientId = (
                <div>
                    <TextField disabled={true} defaultValue={this.props.app.authClient.clientId} floatingLabelText="Client Id"/><br />
                </div>
            );
        }

        let buttons = (<RaisedButton style={buttonStyle} primary={true} label="Launch"/>);
        if(!this.props.app.isDefault){
            buttons = (
                <div>
                    <RaisedButton style={buttonStyle} primary={true} label="Launch"/>
                    <RaisedButton style={buttonStyle} primary={true} label="Save"/>
                    <RaisedButton style={buttonStyle} primary={true} label="Delete"/>
                </div>
            );
        }

        return(

        <Paper style={registeredAppStyle} className="PaperCard">
            <h3>Registered App Details</h3>
            <div className="PaperBody">
                {buttons}
                <form>
                    <TextField style={textFieldStyle} disabled={true} defaultValue={this.props.app.authClient.clientName} floatingLabelText="App Name"/><br />
                    <div><span style={{color: 'rgba(0, 0, 0, 0.3)'}}>Client Type</span>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                            <MenuItem value="PublicClient" primaryText="Public Client"/>
                            <MenuItem value="ConfidentialClient" primaryText="Confidential Client"/>
                        </DropDownMenu>
                    </div>
                    <TextField style={textFieldStyle} disabled={true} defaultValue="" floatingLabelText="Client Uri"/><br />
                    {clientId}
                    <TextField style={textFieldStyle} disabled={true} defaultValue={this.props.app.launchUri} floatingLabelText="App Launch URI"/>
                </form>
            </div>
          </Paper>
        );
    }

}

export default RegisteredApp;