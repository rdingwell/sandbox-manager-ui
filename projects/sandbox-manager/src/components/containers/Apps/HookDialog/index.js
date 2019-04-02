import React, { Component } from 'react';
import { RaisedButton, Paper, Dialog, IconButton, FloatingActionButton } from 'material-ui';
import DeleteIcon from "material-ui/svg-icons/action/delete";
import HooksIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/hooks-logo-mono.svg";
import './styles.less';

class AppDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {}
    }

    render () {
        let actions = [
            <RaisedButton primary label='Save' onClick={this.save} disabled={!this.state.logoURI}/>
        ];

        let paperClasses = 'hook-dialog';

        return <Dialog paperClassName={paperClasses} modal={false} open={!!this.props.open} onRequestClose={this.props.onClose} actions={actions}
                       actionsContainerClassName='app-dialog-actions-wrapper'>
            <Paper className='paper-card'>
                <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>Hook icon change</h3>
                <div className='paper-body'>
                    <form>
                        <div className='image-button-wrapper'>
                            <RaisedButton label='Select Image' onClick={() => this.refs.image.click()} disabled={this.state.isReplica}/>
                            <div>
                                <span className='subscript'>(Display size 300px W X 200px H)</span>
                            </div>
                            <div>
                                <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                            </div>
                        </div>
                        <div className='image-wrapper'>
                            {this.state.logoURI &&
                            <FloatingActionButton onClick={this.removeImage} mini className='remove-image-button' backgroundColor={this.props.muiTheme.palette.primary4Color} disabled={this.state.isReplica}>
                                <DeleteIcon/>
                            </FloatingActionButton>}
                            <input ref='image' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput}/>
                            {!this.state.logoURI && <HooksIcon className='default-hook-icon'/>}
                            {this.state.logoURI && <img style={{ height: '100%' }} src={this.state.logoURI}/>}
                        </div>
                    </form>
                </div>
            </Paper>
        </Dialog>
    }

    removeImage = () => {
        let input = this.refs.image;
        input.value = '';
        this.setState({ logoURI: undefined });
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
                this.setState({ logoURI: e.target.result })
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    save = () => {
        let input = this.refs.image;
        this.props.onSubmit && this.props.onSubmit(this.props.service, this.props.hook.id, input.files[0]);
    };
}

export default AppDialog;
