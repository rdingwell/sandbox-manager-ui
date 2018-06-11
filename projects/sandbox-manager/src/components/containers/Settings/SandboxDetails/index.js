import React, { Component } from 'react';
import { Checkbox, RaisedButton, TextField } from 'material-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSandbox } from '../../../../redux/action-creators';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';

import './styles.less';

class SandboxDetails extends Component {

    constructor (props) {
        super(props);

        this.state = {
            name: this.props.sandboxName,
            description: this.props.sandboxDescription,
            allowOpen: this.props.sandboxAllowOpenAccess
        };
    }

    render () {
        return <div className='sandbox-details-wrapper'>
            <form onSubmit={this.updateSandboxHandler}>
                <TextField disabled fullWidth defaultValue={this.props.sandboxId} floatingLabelText='Sandbox ID' />
                <TextField disabled fullWidth defaultValue={`${window.location.origin}/${this.props.sandboxName}`} floatingLabelText='Sandbox URL' />
                <TextField disabled fullWidth defaultValue={this.props.serviceUrl} floatingLabelText='Secure FHIR Server URL' />
                <TextField disabled fullWidth defaultValue={this.props.sandboxVersion.name} floatingLabelText='Sandbox FHIR Version' />
                <Checkbox label='Allow Open FHIR Endpoint' checked={this.state.allowOpen}
                          onCheck={this.handleOpenFhirCheckboxChange} />
                {this.state.allowOpen && <TextField disabled fullWidth defaultValue={this.props.serviceUrl.replace('/data', '/open')} floatingLabelText='Open FHIR Server URL' />}
                <TextField value={this.state.name} floatingLabelText='Sandbox Name'
                           onChange={this.handleSandboxNameChange} />
                <TextField value={this.state.description} floatingLabelText='Sandbox Description'
                           onChange={(event) => this.handleSandboxDescriptionChange(event)} />
                <RaisedButton primary label='Save' className='details-button' type='submit' />
            </form>
        </div>;
    }

    updateSandboxHandler = (event) => {
        event.preventDefault();

        const details = {
            name: this.state.name,
            description: this.state.description,
            allowOpenAccess: this.state.allowOpen
        };

        this.props.updateSandbox(details);
    };

    handleSandboxNameChange = (_e, name) => {
        this.setState({ name });
    };

    handleSandboxDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    };

    handleOpenFhirCheckboxChange = (_e, allowOpen) => {
        this.setState({ allowOpen })
    };
}

const mapStateToProps = state => {
    let sandbox = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
    let sandboxName = sandbox ? sandbox.name : '';
    let sandboxId = sandbox ? sandbox.sandboxId : '';
    let sandboxDescription = sandbox ? sandbox.description : '';
    let sandboxAllowOpenAccess = sandbox ? !!sandbox.allowOpenAccess : false;
    let sandboxVersion = state.sandbox.sandboxApiEndpointIndex
        ? state.sandbox.sandboxApiEndpointIndexes.find(i => i.index === state.sandbox.sandboxApiEndpointIndex)
        : { name: 'unknown' };

    return {
        sandboxName, sandboxId, sandboxDescription, sandboxAllowOpenAccess, sandboxVersion,
        serviceUrl: state.fhir.smart.data.server && state.fhir.smart.data.server.serviceUrl
    };
};
const mapDispatchToProps = dispatch => bindActionCreators({ updateSandbox }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(SandboxDetails))
