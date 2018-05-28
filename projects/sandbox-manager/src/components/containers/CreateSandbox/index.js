import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, RaisedButton, Paper, TextField, DropDownMenu, MenuItem } from 'material-ui';
import * as  actions from '../../../redux/action-creators';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { withRouter } from 'react-router';
import './styles.less';

class Index extends Component {
    constructor (props) {
        super(props);

        this.state = {
            sandboxId: '',
            name: '',
            version: '',
            allowOpen: false,
            applyDefaultDataSet: true,
            description: '',
            createDisabled: true,
            apiEndpointIndex: '6'
        };
    }

    render () {
        return <div className='create-sandbox-wrapper'>
            <Paper className='paper-card'>
                <h3>
                    Create Sandbox
                </h3>
                <div className='paper-body'>
                    <form>
                        <TextField id='name' floatingLabelText='Sandbox Name' defaultValue={this.state.name} onChange={this.sandboxNameChangedHandler} /> <br />
                        <div className='subscript'>Letters and numbers only. Must be less than 50 characters.</div>
                        <div className='subscript'>e.g., NewCo Sandbox</div>
                        <TextField id='id' floatingLabelText='Sandbox Id' value={this.state.sandboxId} onChange={this.sandboxIdChangedHandler} /><br />
                        <div className='subscript'>Letters and numbers only. Must be less than 20 characters.</div>
                        <div className='subscript'>Your sandbox will be available at http://localhost:3000/{this.state.sandboxId}</div>
                        <DropDownMenu value={this.state.apiEndpointIndex} onChange={(_e, _k, value) => this.sandboxFhirVersionChangedHandler('apiEndpointIndex', value)}
                            className='fhirVersion'>
                            <MenuItem value='5' primaryText='FHIR DSTU2 (v1.0.2)' />
                            <MenuItem value='6' primaryText='FHIR STU3 (v3.0.1)' />
                            <MenuItem value='7' primaryText='FHIR R4 (v3.2.0) [beta]' disabled />
                        </DropDownMenu>
                        <div className='subscript'>Choose a version of the FHIR Standard</div>
                        <br />
                        <div className='checkboxes'>
                            <Checkbox label='Allow Open FHIR Endpoint' className='checkbox' onCheck={this.allowOpenChangeHandler} />
                            <Checkbox label='Apply Default Data Set' className='checkbox' defaultChecked onCheck={this.applyDefaultChangeHandler} />
                            <div className='subscript'>If not selected, the sandbox will be empty</div>
                        </div>
                        <TextField id='description' floatingLabelText='Description' onChange={this.sandboxDescriptionChange} /><br />
                        <div>e.g., This sandbox is the QA environment for NewCo.</div>
                        <RaisedButton label='Create' disabled={this.state.createDisabled} className='button' primary onClick={this.handleCreateSandbox} />
                        <RaisedButton label='Cancel' className='button' default type='submit' onClick={(event) => this.handleCancel(event)} />
                    </form>
                </div>
            </Paper>
            <div style={{ clear: 'both' }} />
        </div>
    }

    sandboxDescriptionChange = (_e, description) => {
        this.setState({ description });
    };

    handleCreateSandbox = (event) => {
        event.preventDefault();
        let createRequest = {
            createdBy: this.props.user,
            name: this.state.name.length === 0 ? this.state.sandboxId : this.state.name,
            sandboxId: this.state.sandboxId,
            description: this.state.description,
            dataSet: this.state.applyDefaultDataSet ? 'DEFAULT' : 'NONE',
            apiEndpointIndex: this.state.apiEndpointIndex,
            allowOpenAccess: this.state.allowOpen,
            users: [this.props.user]
        };
        this.props.createSandbox(createRequest);
        this.props.onCancel && this.props.onCancel();
    };

    allowOpenChangeHandler = () => {
        this.setState((oldState) => {
            return {
                allowOpen: !oldState.checked,
            };
        });
    };

    applyDefaultChangeHandler = () => {
        this.setState((oldState) => {
            return {
                applyDefaultDataSet: !oldState.checked,
            };
        });
    };

    handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    sandboxIdChangedHandler = (event) => {
        this.setState({ sandboxId: event.target.value, createDisabled: event.target.value === 0 })
    };

    sandboxNameChangedHandler = (event) => {
        this.setState({ name: event.target.value, sandboxId: event.target.value, createDisabled: event.target.value === 0 });
    };

    sandboxFhirVersionChangedHandler = (prop, val) => {
        let sandbox = this.state || this.props || {};
        sandbox[prop] = val;

        this.setState({ sandbox });
    };

}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser
    };
};


const mapDispatchToProps = dispatch => {
    return {
        createSandbox: (sandboxDetails) => dispatch(actions.createSandbox(sandboxDetails))
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index)));
