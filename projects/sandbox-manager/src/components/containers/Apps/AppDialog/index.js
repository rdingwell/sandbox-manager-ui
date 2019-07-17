import React, {Component} from 'react';
import {MenuItem, Select, Button, Paper, TextField, Dialog, Switch, IconButton, Fab} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/baseline-info.svg";
import ContentCopy from '@material-ui/icons/FileCopy';
import './styles.less';

class AppDialog extends Component {
    constructor(props) {
        super(props);

        let clientJSON = props.app && props.app.clientJSON && JSON.parse(props.app.clientJSON);
        let redirectUris = clientJSON && clientJSON.redirectUris && clientJSON.redirectUris.join(',');
        let scope = clientJSON && clientJSON.scope && clientJSON.scope.join(' ');
        let manifest = props.manifest;

        let app = {
            clientName: props.app ? props.app.clientName : (manifest ? manifest.client_name : ''),
            launchUri: props.app ? props.app.launchUri : (manifest ? manifest.launch_url : ''),
            samplePatients: props.app && props.app.samplePatients ? props.app.samplePatients : (manifest ? manifest.samplePatients : ''),
            redirectUris: redirectUris ? redirectUris : (manifest ? manifest.redirect_uris.join(',') : ''),
            scope: scope ? scope : (manifest ? manifest.scope : ''),
            logoUri: props.app ? props.app.logoUri : (manifest ? manifest.logo_uri : ''),
            briefDescription: props.app ? props.app.briefDescription : (manifest ? manifest.briefDescription : ''),
            tokenEndpointAuthMethod: clientJSON && clientJSON.tokenEndpointAuthMethod || 'NONE',
            clientJSON: props.app ? clientJSON : {},
            patientScoped: true,
            offlineAccess: false,
            copyType: props.app ? props.app.copyType : 'MASTER',
        };

        let isReplica = app.copyType === 'REPLICA';

        this.state = {
            value: 'PublicClient',
            modalOpen: false,
            clone: false,
            changes: [],
            app,
            originalApp: Object.assign({}, app),
            isReplica
        }
    }

    componentDidMount() {
        this.props.manifest && this.state.app.logoUri && this.loadImageFromWeb();
        setTimeout(() => {
            let defaulInput = document.getElementById('appName');
            defaulInput && defaulInput.focus();
        }, 200);
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.app && !this.props.app.clientJSON && nextProps.app.clientJSON) ||
            (this.props.app && this.props.app.clientJSON && nextProps.app.clientJSON && this.props.app.clientJSON.length !== nextProps.app.clientJSON.length)) {
            let clientJSON = nextProps.app && nextProps.app.clientJSON && JSON.parse(nextProps.app.clientJSON);
            let redirectUris = clientJSON && clientJSON.redirectUris && clientJSON.redirectUris.join(',');
            let scope = clientJSON && clientJSON.scope && clientJSON.scope.join(' ');

            let app = Object.assign({}, this.state.app, {scope, redirectUris, clientJSON});

            this.setState({app});
        }
    }

    render() {
        let clientId = null;
        let clientSecret = null;
        let theme = this.props.muiTheme.palette;
        let iconStyle = {color: theme.primary3Color, fill: theme.primary3Color, width: '24px', height: '24px'};

        if (this.props.app && !this.state.clone) {
            clientId = <div className='label-value'>
                <span>Client Id: </span>
                <span>{this.props.app.clientId}</span>
                <ContentCopy className='copy-button' onClick={() => this.props.copyToClipboard(this.props.app.clientId)}/>
            </div>;

            clientSecret = this.state.app.clientJSON && this.state.app.clientJSON.clientSecret
                ? <div className='label-value'>
                    <span>Client Secret: </span>
                    <span>{this.state.app.clientJSON.clientSecret}</span>
                    <ContentCopy className='copy-button' onClick={() => this.props.copyToClipboard(this.state.app.clientJSON.clientSecret)}/>
                </div>
                : null;
        }

        let saveEnabled = this.checkSaveEnabled();
        let actions = [
            <Button variant='contained' primary label='Save' onClick={this.save} disabled={!saveEnabled} data-qa='app-modal-save-button'/>
        ];

        this.props.app && !this.state.clone && actions.push(<Button variant='contained' backgroundColor={theme.primary4Color} label='Delete' onClick={this.delete} labelColor={theme.primary5Color}/>);
        this.props.app && !this.state.clone && actions.unshift(<Button variant='contained' secondary label='Clone' onClick={this.clone}/>,);
        this.props.app && actions.unshift(<Button variant='contained' label='Download manifest' onClick={this.createManifest}/>,);

        let paperClasses = 'app-dialog' + (this.props.app ? ' small' : '');
        let underlineFocusStyle = {borderColor: theme.primary2Color};
        let floatingLabelFocusStyle = {color: theme.primary2Color};

        return <Dialog paperClassName={paperClasses} modal={false} open={!!this.props.open} onRequestClose={this.props.onClose} actions={actions}
                       actionsContainerClassName='app-dialog-actions-wrapper'>
            <Paper className='paper-card' data-qa='create-app-modal-wrapper'>
                <IconButton style={{color: this.props.muiTheme.palette.primary5Color}} className="close-button" onClick={this.handleClose}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
                <h3>{this.props.app ? 'Registered App Details' : 'App Details'}</h3>
                <div className='paper-body'>
                    <form>
                        <TextField floatingLabelText='App Name*' fullWidth value={this.state.app.clientName} hintText='Human Readable Name for Your App e.g.: Growth Chart' disabled={this.state.isReplica}
                                   onChange={(_e, newVal) => this.onChange('clientName', newVal)} underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                                   id='appName' onKeyPress={this.submitMaybe}/>
                        <br/>
                        <div>
                            <div style={{color: 'rgba(0, 0, 0, 0.3)', display: 'inline-block', transform: 'translate(0, -20%)'}}>Client Type</div>
                            <Select value={this.state.app.tokenEndpointAuthMethod} onChange={(_e, _k, value) => this.onChange('tokenEndpointAuthMethod', value)}
                                    style={{top: '16px'}} disabled={this.state.isReplica}>
                                <MenuItem value='NONE' primaryText='Public Client'/>
                                <MenuItem value='SECRET_BASIC' primaryText='Confidential Client'/>
                            </Select>
                        </div>
                        {clientId}
                        {clientSecret}
                        <TextField multiLine floatingLabelText='Description' value={this.state.app.briefDescription} fullWidth disabled={this.state.isReplica && !this.props.manifest} data-qa='description-input'
                                   onChange={(_e, newVal) => this.onChange('briefDescription', newVal)} underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                                   onKeyPress={this.submitMaybe}/>
                        <TextField floatingLabelText='App Launch URI*' value={this.state.app.launchUri} fullWidth onChange={(_e, newVal) => this.onChange('launchUri', newVal)}
                                   hintText='e.g.: https://mydomain.com/growth-chart/launch.html' underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                                   onBlur={this.launchBlur} disabled={this.state.isReplica} data-qa='launch-uri-input' onKeyPress={this.submitMaybe}/>
                        <br/>
                        <TextField value={this.state.app.redirectUris} fullWidth floatingLabelText='App Redirect URIs*' underlineFocusStyle={underlineFocusStyle}
                                   floatingLabelFocusStyle={floatingLabelFocusStyle} disabled={this.state.isReplica} data-qa='redirect-uris-input' onKeyPress={this.submitMaybe}
                                   onChange={(_e, newVal) => this.onChange('redirectUris', newVal)} hintText='e.g.: https://mydomain.com/growth-chart/index.html'/>
                        <span className='subscript'>
                            Note: If you provide one or more redirect URIs, your client code must send one of the provided values when performing OAuth2 authorization or you will receive an 'Invalid redirect' error.
                        </span>
                        <TextField fullWidth floatingLabelText='Scopes' value={this.state.app.scope} onChange={(_e, newVal) => this.onChange('scope', newVal)} disabled={this.state.isReplica}
                                   hintText='eg: launch patient/*.* openid profile' underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} onKeyPress={this.submitMaybe}/>
                        <span className='subscript'>
                            Space separated list of scopes. Note: If you do not provide scopes, defaults will be set.
                        </span>
                        <div className='scopes-info'>
                            <a href='http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/' target='_blank'>
                                <InfoIcon className='column-item-icon no-vertical-align' style={iconStyle}/>
                                <div>About SMART Scopes</div>
                            </a>
                        </div>
                        <TextField fullWidth floatingLabelText='Sample Patients' hintText='e.g.: Patient?_id=SMART-1032702,SMART-621799' underlineFocusStyle={underlineFocusStyle}
                                   floatingLabelFocusStyle={floatingLabelFocusStyle} disabled={this.state.isReplica && !this.props.manifest} onKeyPress={this.submitMaybe}
                                   value={this.state.app.samplePatients} onChange={(_e, newVal) => this.onChange('samplePatients', newVal)}/>
                        {this.props.app &&
                        <span className='subscript'>This is a FHIR query to limit the Patient Picker on launch.</span>}
                        {!this.props.app && <div className='toggle-wrapper'>
                            <Switch label='Allow offline access' defaultToggled={false} onToggle={(_e, value) => this.onChange('offlineAccess', value)}
                                    thumbStyle={{backgroundColor: this.props.muiTheme.palette.primary5Color}}
                                    trackStyle={{backgroundColor: this.props.muiTheme.palette.primary3Color}}/>
                            <Switch label='Patient Scoped App' defaultToggled={true} onToggle={(_e, value) => this.onChange('patientScoped', value)}
                                    thumbStyle={{backgroundColor: this.props.muiTheme.palette.primary5Color}}
                                    trackStyle={{backgroundColor: this.props.muiTheme.palette.primary3Color}}/>
                        </div>}
                        < br/>
                        <div className='image-form'>
                            <div className='image-button-wrapper'>
                                <Button variant='contained' label='Select Image' onClick={() => this.refs.image.click()} disabled={this.state.isReplica}/>
                                <div>
                                    <span className='subscript'>(Display size 300px W X 200px H)</span>
                                </div>
                                <div>
                                    <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                                </div>
                            </div>
                            <div className='image-wrapper'>
                                <input ref='image' type='file' style={{'display': 'none'}} onChange={this.onFileInput}/>
                                {this.state.app.logoUri
                                    ? <img src={this.state.app.logoUri}/>
                                    : <img style={{height: '100%'}} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                                }
                            </div>
                            {this.state.app.logoUri &&
                            <Fab onClick={this.removeImage} mini className='remove-image-button' backgroundColor={this.props.muiTheme.palette.primary4Color} disabled={this.state.isReplica}>
                                <DeleteIcon/>
                            </Fab>}
                        </div>
                    </form>
                </div>
            </Paper>
        </Dialog>
    }

    checkSaveEnabled = () => {
        let sApp = this.state.app;

        return (this.props.app && !this.state.clone)
            ? this.state.changes.length > 0
            : sApp.clientName.length > 2 && sApp.launchUri.length > 2 && sApp.redirectUris.length > 2;
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.checkSaveEnabled() && this.save();
    };

    removeImage = () => {
        let input = this.refs.image;
        input.value = '';
        this.onChange('logoUri')
    };

    createManifest = () => {
        let clientJSON = JSON.parse(this.props.app.clientJSON);
        let manifest = {
            software_id: this.props.app.softwareId,
            client_name: this.props.app.clientName,
            client_uri: this.props.app.clientUri,
            logo_uri: this.props.app.logoUri,
            launch_url: this.props.app.launchUri,
            redirect_uris: clientJSON.redirectUris,
            scope: clientJSON.scope.join(' '),
            token_endpoint_auth_method: clientJSON.tokenEndpointAuthMethod,
            grant_types: clientJSON.grant_types,
            fhirVersions: this.props.app.fhirVersions,
            briefDescription: this.props.app.briefDescription,
            samplePatients: this.props.app.samplePatients
        };

        let element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest)));
        element.setAttribute('download', `${this.props.app.clientName}.manifest.json`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    clone = () => {
        let app = Object.assign({}, this.state.app);
        app.clientName = `Copy of ${app.clientName}`;
        this.setState({clone: true, isReplica: false, app});
        this.loadImageFromWeb();
    };

    launchBlur = () => {
        let app = Object.assign({}, this.state.app);
        if (this.state.app.launchUri.substring(0, 4) === 'http' && app.redirectUris.length === 0) {
            let pathArray = this.state.app.launchUri.split('/');
            let protocol = pathArray[0];
            let host = pathArray[2];
            let url = protocol + '//' + host;
            app.redirectUris = url;
            this.setState({app});
        } else if (app.redirectUris.length === 0) {
            let pathArray = this.state.app.launchUri.split('/');
            app.redirectUris = pathArray[0];
            this.setState({app});
        }
    };

    handleLaunch = () => {
        this.setState({modalOpen: true});
    };

    handleClose = () => {
        this.setState({modalOpen: false});
        this.props.onClose();
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
                app.logoFile = input.files[0];
                let changes = this.state.changes.slice();
                changes.indexOf('logo') === -1 && changes.push('image');
                this.setState({app, changes})
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    loadImageFromWeb = () => {
        let request = new XMLHttpRequest();
        request.responseType = "blob";
        request.onload = () => {
            let app = Object.assign({}, this.state.app);
            app.logoFile = request.response;
            this.setState({app});
        };

        request.open("GET", this.state.app.logoUri);
        request.send();
    };

    onChange = (prop, val) => {
        let app = this.state.app || this.props.app || {};
        app[prop] = val;

        let changes = this.state.changes.slice();
        let index = changes.indexOf(prop);

        if (index >= 0) {
            changes.splice(index, 1);
        }

        if (this.props.app && this.state.originalApp[prop] !== val) {
            changes.push(prop);
            prop === 'logoUri' && changes.push('image');
        }

        this.setState({app, changes});
    };

    save = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.app, this.state.changes, this.state.clone);
    };
}

export default AppDialog;
