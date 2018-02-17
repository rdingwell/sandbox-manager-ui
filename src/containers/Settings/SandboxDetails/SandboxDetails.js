import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';


import axios from '../../../axios';


class SandboxDetails extends Component {

    state = {
        name : {
            value : '',
            valid : false,
            touched : false
        },
        description : '',
        allowOpen : false
    };


    componentDidMount () {
        const name = {
            ...this.state.name
        };
        name.value = this.props.sandbox.name;

        this.setState({name: name});
        this.setState({description: this.props.sandbox.description});
        this.setState({allowOpen: this.props.sandbox.allowOpenAccess});
    }


    updateSandboxHandler = (event) => {
        event.preventDefault();

        const details = {
            name : this.state.name.value,
            description : this.state.description,
            allowOpenAccess : this.state.allowOpen
        };

        this.props.onSaveSandbox(details);

    };

    handleSandboxNameChange = (event) => {
        const name = {
            ...this.state.name
        };

        name.touched = true;
        name.value = event.target.value;
        if (name.value.trim() !== ''){
            name.valid = true;
        }
        this.setState({name : name});
    };


    handleSandboxDescriptionChange = (event) => {
        this.setState({description : event.target.value});
    };

    handleOpenFhirCheckboxChange = (event) => {
        this.setState({allowOpen : event.target.value === 'on'})
    };

    render() {
        const style = {
            width: 400,
            margin: 20,
            display: 'inline-block',
            float: 'left'
        };

        const hstyle = {
            width: 360,
            backgroundColor: 'rgb(232, 232, 232)',
            padding: '20px',
            marginTop : '0',
            color: '#4a525d'
        };

        const fieldsStyle = {
            padding: '0 20px 20px 20px'
        };

        const buttonStyle = {
            margin: 12,
        };


        return(
            <Paper style={style} zDepth={1} >
                <h4 style={hstyle}>Sandbox Details</h4>
                <form style={fieldsStyle} onSubmit={this.updateSandboxHandler}>
                    <TextField disabled={true} defaultValue={this.props.sandbox.sandboxId} floatingLabelText="Sandbox ID"/><br />
                    <TextField disabled={true} defaultValue="get the url" floatingLabelText="Sandbox URL"/><br />
                    <TextField disabled={true} defaultValue="get the url" floatingLabelText="Secure FHIR Server URL"/><br />
                    <TextField disabled={true} defaultValue="didid" floatingLabelText="Sandbox FHIR Version"/><br />
                    <Checkbox
                        label="Allow Open FHIR Endpoint"
                        checked={this.state.allowOpen}
                        onCheck={this.handleOpenFhirCheckboxChange.bind(this)}
                    />
                    <TextField
                        value={this.state.name.value}
                        floatingLabelText="Sandbox Name"
                        onChange={(event) => this.handleSandboxNameChange(event)}/><br />
                    <TextField
                        value={this.state.description}
                        floatingLabelText="Sandbox Description"
                        onChange={(event) => this.handleSandboxDescriptionChange(event)}/><br />
                    <RaisedButton label="Save" style={buttonStyle} type="submit"/>
                </form>
            </Paper>
        );
    }


}

const mapStateToProps = state => {
    return {
        sandbox : state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[0]
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onSaveSandbox: (sandboxDetails) => dispatch( actions.updateSandbox(sandboxDetails) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( SandboxDetails, axios ) )