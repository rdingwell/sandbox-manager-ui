import React, { Component } from 'react';
import { MenuItem, DropDownMenu, RaisedButton, Paper, TextField, Dialog, Toggle } from 'material-ui';

class AppDialog extends Component {
    constructor (props) {
        super(props);

        let app = {
            clientName: props.app ? props.app.authClient.clientName : '',
            launchUri: props.app ? props.app.launchUri : '',
            logoUri: props.app && props.app.logoUri || '',
            briefDescription: props.app && props.app.briefDescription || '',
            tokenEndpointAuthMethod: props.app && props.app.clientJSON && props.app.clientJSON.tokenEndpointAuthMethod || 'NONE',
            patientScoped: true
        };

        console.log(props.app);

        this.state = {
            value: 'PublicClient',
            modalOpen: false,
            app
        }
    }

    render () {
        let clientId = null;

        if (this.props.app) {
            clientId = <div>
                <TextField defaultValue={this.props.app.authClient.clientId} floatingLabelText='Client Id' fullWidth disabled /><br />
            </div>;
        }

        let actions = [
            <RaisedButton key={1} onClick={this.props.onClose} label='Cancel' />,
            <RaisedButton primary label='Save' onClick={this.save} />
        ];

        this.props.app && actions.push(<RaisedButton secondary label='Delete' onClick={this.delete} />);
        this.props.app && actions.push(<RaisedButton label='Launch' />);

        let paperClasses = 'app-dialog' + (this.props.app ? ' small' : '');

        return <Dialog paperClassName={paperClasses} modal={false} open={!!this.props.open} onRequestClose={this.props.onClose} actions={actions}
                       actionsContainerClassName='app-dialog-actions-wrapper'>
            <Paper className='paper-card'>
                <h3>Registered App Details</h3>
                <div className='paper-body'>
                    <form>
                        <TextField floatingLabelText='App Name' fullWidth value={this.state.app.clientName}
                                   onChange={(_e, newVal) => this.onChange('clientName', newVal)} /><br />
                        <div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.3)', display: 'inline-block', transform: 'translate(0, -20%)' }}>Client Type</div>
                            <DropDownMenu value={this.state.app.tokenEndpointAuthMethod} onChange={(_e, _k, value) => this.onChange('tokenEndpointAuthMethod', value)} style={{top: '16px'}}>
                                <MenuItem value='NONE' primaryText='Public Client' />
                                <MenuItem value='SECRET_BASIC' primaryText='Confidential Client' />
                            </DropDownMenu>
                        </div>
                        {clientId}
                        <TextField multiLine floatingLabelText='Description' value={this.state.app.briefDescription} fullWidth
                                   onChange={(_e, newVal) => this.onChange('briefDescription', newVal)} />
                        <TextField floatingLabelText='App Launch URI' value={this.state.app.launchUri} fullWidth onChange={(_e, newVal) => this.onChange('launchUri', newVal)} />
                        <br />
                        <TextField fullWidth floatingLabelText='App Redirect URIs' />
                        <span>Note: If you provide one or more redirect URIs, your client code must send one of the provided values when performing OAuth2 authorization or you will receive an 'Invalid redirect' error.</span>
                        <TextField fullWidth floatingLabelText='Scopes' />
                        <span>Space separated list of scopes eg. 'launch patient/\*.* openid profile'</span>
                        <TextField fullWidth floatingLabelText='Sample Patients' hintText='e.g.: Patient?_id=SMART-1032702,SMART-621799' />
                        <span>This is a FHIR query to limit the Patient Picker on launch.</span>
                        {!this.props.app && <div className='toggle-wrapper'>
                            <Toggle label='Allow offline access' defaultToggled={false} />
                            <Toggle label='Patient Scoped App' defaultToggled={true} onChange={(_e, _k, value) => this.onChange('patientScoped', value)} />
                        </div>}
                        < br />
                        < br />
                        <RaisedButton label='Image' onClick={() => this.refs.image.click()} />
                        <input ref='image' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput} />
                        <img style={{ width: '450px', display: 'block', marginTop: '10px' }} src={this.state.app.logoUri} />
                    </form>
                </div>
            </Paper>
        </Dialog>
    }

    handleLaunch = () => {
        this.setState({ modalOpen: true });
    };

    handleClose = () => {
        this.setState({ modalOpen: false });
    };

    delete = () => {
        this.props.onDelete && this.props.onDelete();
    };

    onFileInput = () => {
        let input = this.refs.image;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                let app = Object.assign({}, this.state.app);
                app.logoUri = e.target.result;
                this.setState({ app })
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    onChange = (prop, val) => {
        let app = this.state.app || this.props.app || {};
        app[prop] = val;

        this.setState({ app });
    };

    save = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.app);
    }

}

export default AppDialog;
