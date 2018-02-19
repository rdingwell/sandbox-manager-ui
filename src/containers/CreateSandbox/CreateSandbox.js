import React, {Component} from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Start from "../Start/Start";
import * as  actions from '../../store/actions/index';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { withRouter } from 'react-router';
import axios from '../../axios';


class CreateSandbox extends Component {

    state = {
        sandboxId: '',
        name: '',
        version: '',
        allowOpen: false,
        applyDefaultDataSet: true,
        description: '',
        createDisabled: true,
        apiEndpointIndex: 6
    };


    handleCreateSandbox = (event) => {
        event.preventDefault();
        let createRequest = {
            createdBy: this.props.user,
            name: this.state.name.length === 0 ? this.state.sandboxId : this.state.name,
            sandboxId:this.state.sandboxId,
            description:this.state.description,
            dataSet:this.applyDefaultDataSet ? "DEFAULT" : "NONE",
            apiEndpointIndex: this.state.apiEndpointIndex,
            allowOpenAccess: this.state.allowOpen,
            users: [this.props.user]
        };
        return this.props.createSandbox(createRequest);
    };

    allowOpenChangeHandler = () =>{
        this.setState((oldState) => {
            return {
                allowOpen: !oldState.checked,
            };
        });
    };

    applyDefaultChangeHandler = () =>{
        this.setState((oldState) => {
            return {
                applyDefaultDataSet: !oldState.checked,
            };
        });
    };

    handleCancel = (event) => {
        event.preventDefault();
        this.props.history.push("/dashboard");
    };

    sandboxIdChangedHandler = (event) => {
        this.setState({sandboxId : event.target.value, createDisabled: event.target.value === 0})
    };

    sandboxNameChangedHandler = (event) => {
        this.setState({name: event.target.value});
    };


    render() {
        const checkbox = {
            marginBottom: 16
        };

        const buttonStyle = {
            margin: 10
        };


        return(
            <div>
                <Paper className="PaperCard" style={{width: '30%', float:'left'}}>
                    <h3>
                        Create Sandbox
                    </h3>
                    <div className="PaperBody">
                        <form>
                            <TextField floatingLabelText="Sandbox Id" defaultValue={this.state.name} onChange={this.sandboxIdChangedHandler}/><br/>
                            <div>Your sandbox will be available at http://localhost:3000/sandbox-id</div>
                            <TextField floatingLabelText="Sandbox Name"  onChange={this.sandboxNameChangedHandler}/> <br/>
                            <div>e.g., NewCo Sandbox</div>
                            <TextField floatingLabelText="Sandbox Version" value={"FHIR STU 3 (v3.0.1)"} disabled={true}/><br/>
                            <div>Choose a version of the FHIR Standard</div>
                            <Checkbox
                                label="Allow Open FHIR Endpoint"
                                style={checkbox}
                                onCheck={this.allowOpenChangeHandler.bind(this)}/>
                            <Checkbox
                                label="Apply Default Data Set"
                                style={checkbox} defaultChecked={true}
                                onCheck={this.applyDefaultChangeHandler.bind(this)} />
                            <div>If not selected, the sandbox will be empty</div>
                            <TextField floatingLabelText="Description"/><br/>
                            <div>e.g., This sandbox is the QA environment for NewCo.</div>
                            <RaisedButton label="Create" disabled={this.state.createDisabled} style={buttonStyle} primary={true}  onClick={(event) => this.handleCreateSandbox(event)}/>
                            <RaisedButton label="Cancel" style={buttonStyle} default={true} type="submit" onClick={(event) => this.handleCancel(event)}/>
                        </form>
                    </div>
                </Paper>
                <div style={{float:'right', width:'60%'}}>
                    <Start skipLogin={true}></Start>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>
        );
    };

}

const mapStateToProps = state => {
    return {
        user: state.user.oauthUser
    };
};


const mapDispatchToProps = dispatch => {
    return {
        createSandbox: (sandboxDetails) => dispatch( actions.createSandbox(sandboxDetails) )
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( CreateSandbox, axios)));