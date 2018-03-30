import React, { Component } from 'react';
import { MenuItem, DropDownMenu, RaisedButton, Paper, TextField } from 'material-ui';

class RegisteredApp extends Component {
    state = {
        value: 'PublicClient',
        modalOpen: false
    };

    handleChange = (event, index, value) => {
        this.setState({ value: value });
    };

    handleLaunch = () => {
        this.setState({ modalOpen: true });
    };

    handleClose = () => {
        this.setState({ modalOpen: false });
    };

    render () {
        const registeredAppStyle = {
            width: '100%',
            float: 'right'
        };

        const buttonStyle = {
            margin: 12,
        };

        const textFieldStyle = {
            width: '100%'
        };

        let clientId = null;

        if (this.props.app) {
            clientId = <div>
                <TextField disabled={true} defaultValue={this.props.app.authClient.clientId} floatingLabelText="Client Id" /><br />
            </div>;
        }

        let buttons = <div>
            <RaisedButton style={buttonStyle} primary={true} label="Save" />
            <RaisedButton style={buttonStyle} secondary={true} label="Delete" />
        </div>;

        return <Paper style={registeredAppStyle} className="paper-card">
            <h3>Registered App Details</h3>
            <div className="paper-body">
                {buttons}
                <form>
                    <TextField style={textFieldStyle} disabled={true} defaultValue={this.props.app.authClient.clientName} floatingLabelText="App Name" /><br />
                    <div>
                        <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>Client Type</span>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                            <MenuItem value="PublicClient" primaryText="Public Client" />
                            <MenuItem value="ConfidentialClient" primaryText="Confidential Client" />
                        </DropDownMenu>
                    </div>
                    <TextField style={textFieldStyle} disabled={true} defaultValue="" floatingLabelText="Client Uri" /><br />
                    {clientId}
                    <TextField style={textFieldStyle} disabled={true} defaultValue={this.props.app.launchUri} floatingLabelText="App Launch URI" />
                </form>
            </div>
        </Paper>;
    }

}

export default RegisteredApp;
