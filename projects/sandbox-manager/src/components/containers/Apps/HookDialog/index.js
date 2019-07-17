import React, { Component, Fragment } from 'react';
import { Button, Paper, Dialog, IconButton, Fab, TextField, Tab, Tabs } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import HooksIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/hooks-logo-mono.svg";
import './styles.less';
import ReactJson from 'react-json-view';

class AppDialog extends Component {
    constructor (props) {
        super(props);

        let logoURI = props.hook ? props.hook.logoUri : '';

        this.state = {
            showJSON: false,
            hasChanged: false,
            activeTab: 'parsed',
            logoURI,
        }
    }

    render () {
        let paperClasses = 'hook-dialog';
        let palette = this.props.muiTheme.palette;
        let hook = Object.assign({}, this.props.hook);
        hook.id = hook.hookId;
        delete hook.hookId;
        delete hook.cdsServiceEndpointId;
        delete hook.url;
        delete hook.logoUri;

        return <Dialog paperClassName={paperClasses} modal={false} open={!!this.props.open} onRequestClose={this.props.onClose} actionsContainerClassName='app-dialog-actions-wrapper'>
            <Paper className='paper-card'>
                <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>CDS Service Info</h3>
                <div className='paper-body'>
                    <Tabs className='info-tabs' contentContainerClassName='info-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}
                          value={this.state.activeTab}>
                        <Tab label='Rendering' className={'parsed tab' + (this.state.activeTab === 'parsed' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'parsed' })} value='parsed'>
                            <Fragment>
                                <div className='hook-info-wrapper'>
                                    <TextField fullWidth value={this.props.hook.hook} disabled={true} floatingLabelText='Hook'/>
                                    <TextField fullWidth value={this.props.hook.title} disabled={true} floatingLabelText='Title'/>
                                    <TextField fullWidth value={this.props.hook.description} disabled={true} floatingLabelText='Description'/>
                                    <TextField fullWidth value={this.props.hook.hookId} disabled={true} floatingLabelText='Id'/>
                                    {!!this.props.hook.prefetch && <div className='prefetch-title'>Prefetch</div>}
                                    {!!this.props.hook.prefetch && Object.keys(this.props.hook.prefetch).map(key => {
                                        return <TextField key={key} fullWidth value={this.props.hook.prefetch[key]} disabled={true} floatingLabelText={key}/>;
                                    })}
                                </div>
                                <form className='image-form'>
                                    <div className='image-button-wrapper'>
                                        <Button variant='contained' label='Select Image' onClick={() => this.refs.image.click()}/>
                                        <div>
                                            <span className='subscript'>(Display size 300px W X 200px H)</span>
                                        </div>
                                        <div>
                                            <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                                        </div>
                                    </div>
                                    <div className='image-wrapper'>
                                        <input ref='image' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput}/>
                                        {!this.state.logoURI && <HooksIcon className='default-hook-icon'/>}
                                        {this.state.logoURI && <img style={{ height: '100%' }} src={this.state.logoURI}/>}
                                    </div>
                                    {this.state.logoURI &&
                                    <Fab onClick={this.removeImage} mini className='remove-image-button' backgroundColor={this.props.muiTheme.palette.primary4Color}>
                                        <DeleteIcon/>
                                    </Fab>}
                                </form>
                                <div className='save-btn-wrapper'>
                                    <Button variant='contained' className='save-btn' primary label='Save' onClick={this.save} disabled={!this.state.hasChanged}/>
                                </div>
                            </Fragment>
                        </Tab>
                        <Tab label='JSON' className={'json tab' + (this.state.activeTab === 'json' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'json' })} value='json'>
                            <ReactJson src={hook} name={false}/>
                        </Tab>
                    </Tabs>
                </div>
            </Paper>
        </Dialog>
    }

    removeImage = () => {
        let input = this.refs.image;
        input.value = '';
        this.setState({ logoURI: undefined, hasChanged: true });
    };

    handleClose = () => {
        this.setState({ modalOpen: false });
        this.props.onClose();
    };

    onFileInput = () => {
        let input = this.refs.image;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                this.setState({ logoURI: e.target.result, hasChanged: true })
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    save = () => {
        let input = this.refs.image;
        this.props.onSubmit && this.props.onSubmit(this.props.hook.id, input.files[0]);
    };
}

export default AppDialog;
