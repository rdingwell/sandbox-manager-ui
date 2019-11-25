import React, {Component, Fragment} from 'react';
import {Button, Paper, Dialog, IconButton, Fab, TextField, Tab, Tabs, Box} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import HooksIcon from "svg-react-loader?name=Patient!../../../../assets/icons/hooks-logo-mono.svg";
import ReactJson from 'react-json-view';

import './styles.less';

class AppDialog extends Component {
    constructor(props) {
        super(props);

        let logoURI = props.hook ? props.hook.logoUri : '';

        this.state = {
            showJSON: false,
            hasChanged: false,
            activeTab: 'parsed',
            logoURI,
        }
    }

    render() {
        let paperClasses = 'hook-dialog';
        let theme = this.props.theme;
        let hook = Object.assign({}, this.props.hook);
        hook.id = hook.hookId;
        delete hook.hookId;
        delete hook.cdsServiceEndpointId;
        delete hook.url;
        delete hook.logoUri;

        return <Dialog classes={{paper: paperClasses}} open={!!this.props.open} onClose={this.props.onClose} scroll='paper'>
            <Paper className='paper-card'>
                <IconButton style={{color: theme.p5}} className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>CDS Service Info</h3>
                <div className='paper-body'>
                    <Tabs className='info-tabs' value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})} variant='fullWidth'>
                        <Tab label='Rendering' value='parsed'/>
                        <Tab label='JSON' value='json'/>
                    </Tabs>
                    <Box>
                        {this.state.activeTab !== 'json'
                            ? <Fragment>
                                <div className='hook-info-wrapper'>
                                    <TextField fullWidth value={this.props.hook.hook} disabled={true} label='Hook'/>
                                    <TextField fullWidth value={this.props.hook.title} disabled={true} label='Title' className='margin-top'/>
                                    <TextField fullWidth value={this.props.hook.description} disabled={true} label='Description' className='margin-top'/>
                                    <TextField fullWidth value={this.props.hook.hookId} disabled={true} label='Id' className='margin-top'/>
                                    {!!this.props.hook.prefetch && <div className='prefetch-title margin-top'>Prefetch</div>}
                                    {!!this.props.hook.prefetch && Object.keys(this.props.hook.prefetch).map(key => {
                                        return <TextField key={key} multiline fullWidth value={this.props.hook.prefetch[key]} disabled={true} label={key} className='margin-top'/>;
                                    })}
                                </div>
                                <form className='image-form'>
                                    <div className='image-button-wrapper'>
                                        <Button variant='contained' onClick={() => this.refs.image.click()}>
                                            Select Image
                                        </Button>
                                        <div>
                                            <span className='subscript'>(Display size 300px W X 200px H)</span>
                                        </div>
                                        <div>
                                            <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                                        </div>
                                    </div>
                                    <div className='image-wrapper'>
                                        <input ref='image' type='file' style={{'display': 'none'}} onChange={this.onFileInput}/>
                                        {!this.state.logoURI && <HooksIcon className='default-hook-icon'/>}
                                        {this.state.logoURI && <img style={{height: '100%'}} src={this.state.logoURI}/>}
                                    </div>
                                    {this.state.logoURI &&
                                    <Fab onClick={this.removeImage} size='small' className='remove-image-button' style={{backgroundColor: theme.p4, color: theme.p5}}>
                                        <DeleteIcon/>
                                    </Fab>}
                                </form>
                                <div className='save-btn-wrapper'>
                                    <Button variant='contained' className='save-btn' onClick={this.save} disabled={!this.state.hasChanged} color='primary'>
                                        Save
                                    </Button>
                                </div>
                            </Fragment>
                            : <ReactJson src={hook} name={false}/>}
                    </Box>
                </div>
            </Paper>
        </Dialog>
    }

    removeImage = () => {
        let input = this.refs.image;
        input.value = '';
        this.setState({logoURI: undefined, hasChanged: true});
    };

    onFileInput = () => {
        let input = this.refs.image;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                this.setState({logoURI: e.target.result, hasChanged: true})
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
