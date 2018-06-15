import React, { Component } from 'react';

import { TextField, Checkbox, RaisedButton, div, Dialog, IconButton } from 'material-ui';

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
        let titleStyle = {
            backgroundColor: this.props.theme.primary2Color,
            color: this.props.theme.alternateTextColor
        };

        return <div className='reset-wrapper'>
            {this.state.showResetModal &&
            <Dialog paperClassName='app-dialog auto' modal={false} open={this.state.showResetModal} onRequestClose={this.toggleModal} actions={actions}>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={this.toggleModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Reset Sandbox</h1>
                </div>
                <div className='screen-content reset-sandbox-dialog'>
                    <p>
                        Are you sure you want to reset sandbox {this.props.sandbox.name}? This is not reversible and will delete all FHIR data, launch scenarios, and personas
                    </p>
                    <TextField value={this.state.enableReset} floatingLabelText='Type "RESET"' fullWidth
                               onChange={(_e, enableReset) => this.setState({ enableReset })} />
                </div>
            </Dialog>}
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
                <Checkbox checked={this.state.applyDefaultDataSet} label='Apply Default Data Set' onCheck={(_e, applyDefaultDataSet) => this.setState({ applyDefaultDataSet })}
                          labelStyle={{ color: this.props.theme.primary2Color }} />
                <p>If not selected, the sandbox will be empty</p>
                {this.props.sandbox &&
                <Checkbox checked={this.state.reset} label={'Are you sure you want to reset sandbox ' + this.props.sandbox.name + '?'}
                          onCheck={(_e, reset) => this.setState({ reset })} labelStyle={{ color: this.props.theme.primary2Color }} />}

                <RaisedButton primary disabled={!this.state.reset} label='Reset' className='button' onClick={this.toggleModal} />
            </div>
        </div>;
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
