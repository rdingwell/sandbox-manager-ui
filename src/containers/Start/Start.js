import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import * as  actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


import axios from '../../axiox';


class Start extends Component{


    state = {
        title: 'What is a sandbox?',
        description: 'A sandbox is your very own instance of an HSPC Platform* combined with tools and utilities to help you build and test your medical apps.',
        checkboxes: [
            'Create apps for practitioners that launch within an EHR, smart phone, tablet, or web browser',
            'Create apps for patients and their related persons that launch from a smart phone, tablet, web browser, or personal computer',
            'Create backend services that interact directly with HSPC Platforms*',
            'Verify your app follows the SMART security and launch context standards',
            'Run your app against your very own FHIR server',
            'Test your apps by creating various launch scenarios',
            'Create practitioners, patients, and clinical data',
            'Verify that your app is HSPC compliant'
        ],
        note: '*An HSPC Platform is a standardized way to interact with a medical system such as an EHR, Hospital, Clinic, HIE, PHR, Lab, Insurer, etc.',
    };

    handleSignIn = () => {
        let url = this.props.location;
        this.props.onAuthInit(url);
    };

    handleSignUp = () => {
        //Need to spread out work to components later:
      //These settings come from the config file, need to actually pull from file
      let settings = {
        "userManagementUrl": "https://account-test.hspconsortium.org",
        "sandboxManagerUrl": "http://localhost:3000/apps"
      }
      window.location.href = settings.userManagementUrl + "/public/newuser/?afterAuth=" + settings.sandboxManagerUrl;
    };

    render() {

        const iconStyle = {
            marginRight: 10
        };

        const buttonStyle = {
            marginRight: 10
        };

        const paperStyle = {
            paddingBottom: 0,
        };

        let checkboxes = this.state.checkboxes.map( (checkbox, index) => (
            <p key={index}><i style={iconStyle} className="fa fa-check" aria-hidden="true"></i>{checkbox}</p>
        ) );

        let buttons = (
            <div>
                <RaisedButton label="Sign In" style={buttonStyle} primary={true} onClick={this.handleSignIn}/>
                <RaisedButton label="Sign Up" style={buttonStyle} primary={true} onClick={this.handleSignUp}/>
            </div>
            );

        if(this.props.skipLogin){
            buttons = null;
        }

        return(
            <Paper style={paperStyle} className="PaperCard" >
                <h3>{this.state.title}</h3>
                <div className="PaperBody">
                    <p>{this.state.description}</p>
                    {checkboxes}
                    <p>{this.state.note}</p>
                    {buttons}
                </div>
            </Paper>
        );
    };
}

const mapStateToProps = state => {
    return {
        selectedSandbox : state.sandbox.selectedSandbox
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthInit: (url) => dispatch( actions.init(url) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Start, axios ) )