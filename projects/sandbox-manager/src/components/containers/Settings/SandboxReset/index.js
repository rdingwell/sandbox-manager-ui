import React, { Component } from 'react';

import { TextField, Checkbox, RaisedButton, Paper, Dialog, IconButton} from 'material-ui';

import './styles.less';

class SandboxReset extends Component {

    constructor (props) {
        super(props);

        this.state = {
            applyDefaultDataSet: false,
            reset: false,
            showResetModal: false,
            enableReset: ''
        };
    }

    render () {
        let actions = [
            <RaisedButton key={1} label='Reset' secondary onClick={this.resetSandbox} disabled={this.state.enableReset !== 'RESET'} />,
            <RaisedButton key={2} label='Cancel' primary onClick={this.toggleModal} className='cancel-button' />
        ];

        return <Paper className='reset-wrapper' zDepth={1}>
            {this.state.showResetModal && <Dialog paperClassName='app-dialog auto reset-sandbox-dialog' modal={false}
                                                  open={this.state.showResetModal} onRequestClose={this.toggleModal} actions={actions}>
                <Paper className='paper-card reset-dialog'>
                    <IconButton className="close-button" onClick={this.toggleModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h3>Reset Sandbox</h3>
                    <div className='paper-body auto'>
                        <p>
                            Are you sure you want to reset sandbox {this.props.sandbox.name}? This is not reversible and will delete all FHIR data, launch scenarios, and personas
                        </p>
                        <TextField value={this.state.enableReset} floatingLabelText='Type "RESET"' fullWidth
                                   onChange={(_e, enableReset) => this.setState({ enableReset })} />
                    </div>
                </Paper>
            </Dialog>}
            <h4>Sandbox Reset</h4>
            <div className='reset-content'>
                <p>Resetting the sandbox will delete:</p>
                <ul>
                    <li>All FHIR data</li>
                    <li>Launch scenarios</li>
                    <li>Personas</li>
                </ul>
                <p>This is NOT reversible!</p>
                <p>Unaffected:</p>
                <ul>
                    <li>Registered apps</li>
                    <li>Sandbox members</li>
                </ul>
                <Checkbox checked={this.state.applyDefaultDataSet} label='Apply Default Data Set' onCheck={(_e, applyDefaultDataSet) => this.setState({ applyDefaultDataSet })} />
                <p>If not selected, the sandbox will be empty</p>
                {this.props.sandbox &&
                <Checkbox checked={this.state.reset} label={'Are you sure you want to reset sandbox ' + this.props.sandbox.name + '?'}
                          onCheck={(_e, reset) => this.setState({ reset })} />}

                <RaisedButton primary disabled={!this.state.reset} label='Reset' className='button' onClick={this.toggleModal} />
            </div>
        </Paper>;
    }

    toggleModal = () => {
        this.setState({ showResetModal: !this.state.showResetModal });
    };

    resetSandbox = () => {
        this.props.resetCurrentSandbox(this.state.applyDefaultDataSet);
        this.toggleModal();
    }
}


export default SandboxReset;
