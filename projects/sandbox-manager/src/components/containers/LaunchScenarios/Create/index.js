import React, { Component } from 'react';
import { Dialog, FlatButton, IconButton, RadioButton, RadioButtonGroup, RaisedButton, Step, StepLabel, Stepper } from "material-ui";
import RightIcon from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import LeftIcon from "material-ui/svg-icons/hardware/keyboard-arrow-left";
import AccountIcon from "material-ui/svg-icons/action/account-box";
import WebIcon from "material-ui/svg-icons/av/web";
import { getPatientName } from "../../../../../../../lib/utils/fhir";
import PersonaList from "../../Persona/List";
import Apps from '../../Apps';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

class Create extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedApp: null,
            currentStep: 0
        };
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let titleStyle = { backgroundColor: palette.primary2Color, color: palette.primary5Color };
        let actions = this.getActions();

        return <Dialog open={this.props.open} modal={false} onRequestClose={this.props.close} contentClassName='launch-scenario-dialog' actions={actions} actionsContainerClassName='create-modal-actions'>
            <h3 className='modal-title' style={titleStyle}>BUILD LAUNCH SCENARIO</h3>
            <IconButton style={{ color: palette.primary5Color }} className="close-button" onClick={this.props.close}>
                <i className="material-icons">close</i>
            </IconButton>
            <div className='stepper'>
                <Stepper activeStep={this.state.currentStep}>
                    <Step>
                        <StepLabel className='step-label'>Select App</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className='step-label'>Choose Persona</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className='step-label'>Build Launch Context</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className='step-label'>Details</StepLabel>
                    </Step>
                </Stepper>
            </div>
            <div className='create-scenario-content-wrapper'>
                {this.getContent()}
            </div>
        </Dialog>
    }

    getActions = () => {
        let nextEnabled = this.state.currentStep === 0
            ? !!this.state.selectedApp
            : false;
        let nextColor = nextEnabled ? this.props.muiTheme.palette.primary2Color : this.props.muiTheme.palette.primary3Color;
        let prevColor = this.props.muiTheme.palette.primary2Color;

        let actions = [
            <FlatButton disabled={!nextEnabled} label="Next" labelPosition="before" style={{ color: nextColor }} icon={<RightIcon/>} onClick={this.next}/>
        ];

        if (this.state.currentStep > 0) {
            actions.unshift(
                <FlatButton label={<span className='perv-button-label'><LeftIcon style={{ color: prevColor }}/> Prev</span>} labelPosition="before" style={{ color: prevColor }} onClick={this.prev}/>
            );
        }

        return actions;
    };

    getContent = () => {
        let titleStyle = { color: this.props.muiTheme.palette.primary3Color };

        switch (this.state.currentStep) {
            case 0:
                return <div>
                    <span className='modal-screen-title' style={titleStyle}><WebIcon style={titleStyle}/> Which app will be launched with this Launch Scenario?</span>
                    <Apps title=' ' modal onCardClick={selectedApp => this.setState({ selectedApp })} selectedApp={this.state.selectedApp}/>
                </div>;
            case 1:
                return <div>
                    <span className='modal-screen-title' style={titleStyle}><AccountIcon style={titleStyle}/> Which user will launch the app in this launch scenario?</span>
                    <div className='persona-selection'>
                        <div className='type-selection'>
                            <span>User Persona Type</span>
                            <div>
                                <RadioButtonGroup name="personaType">
                                    <RadioButton value="practitioner" label="Practitioner"/>
                                    <RadioButton value="patient" label="Patient"/>
                                </RadioButtonGroup>
                            </div>
                        </div>
                        <div className='selected-values'>
                            <span>Selected Persona</span>
                            <span><AccountIcon style={titleStyle}/> {this.state.selectedPersona ? 'Persona name' : '-'}</span>
                        </div>
                    </div>
                </div>;
        }
        // if (!this.state.selectedPatient) {
        //     let type = this.state.selectedPersona ? PersonaList.TYPES.patient : PersonaList.TYPES.persona;
        //     let title = this.state.selectedPersona ? 'Select a patient' : 'Select a persona';
        //     let personaList = this.state.selectedPersona ? this.props.patients : this.props.personas;
        //     let pagination = this.state.selectedPersona ? this.props.patientsPagination : this.props.personasPagination;
        //     let click = this.state.selectedPersona
        //         ? selectedPatient => this.setState({ selectedPatient })
        //         : selectedPersona => this.setState({ selectedPersona });
        //     let actions = this.state.selectedPersona
        //         ? <RaisedButton primary label='skip Patient' onClick={() => this.setState({ selectedPatient: {} })}/>
        //         : [];
        //
        //     let props = {
        //         title, type, click, personaList, pagination, actions, modal: true,
        //         theme: this.props.muiTheme.palette,
        //         lookupPersonasStart: this.props.lookupPersonasStart,
        //         search: this.props.fetchPersonas,
        //         loading: this.props.personaLoading,
        //         next: () => this.props.getPersonasPage(type, pagination, 'next'),
        //         prev: () => this.props.getPersonasPage(type, pagination, 'previous')
        //     };
        //
        //     return <PersonaList {...props} additionalPadding/>;
        // } else {
        //     let titleStyle = {
        //         backgroundColor: this.props.muiTheme.palette.primary2Color,
        //         color: this.props.muiTheme.palette.alternateTextColor
        //     };
        //
        //     return <div>
        //         <div className='screen-title' style={titleStyle}>
        //             <h1 style={titleStyle}>Save Launch Scenario</h1>
        //         </div>
        //         <div className='inputs'>
        //             <div className='label-value'>
        //                 <span>Persona: </span>
        //                 <span>{this.state.selectedPersona.personaName}</span>
        //             </div>
        //             <div className='label-value'>
        //                 <span>Patient: </span>
        //                 <span>{this.state.selectedPatient ? getPatientName(this.state.selectedPatient) : 'NONE'}</span>
        //             </div>
        //             <div className='label-value'>
        //                 <span>App: </span>
        //                 <span>{this.state.selectedApp.authClient.clientName}</span>
        //             </div>
        //             <TextField floatingLabelText='Description' fullWidth onChange={(_e, description) => this.setState({ description })}
        //                        errorText={this.state.descriptionError}/>
        //         </div>
        //     </div>
        // }
    };

    createScenario = () => {
        if (this.state.description.length > 2) {
            let data = {
                app: this.state.selectedApp,
                description: this.state.description,
                lastLaunchSeconds: Date.now(),
                patient: {
                    fhirId: this.state.selectedPatient.id,
                    name: getPatientName(this.state.selectedPatient),
                    resource: 'Patient'
                },
                sandbox: this.props.sandbox,
                userPersona: this.state.selectedPersona,
                createdBy: this.props.user
            };

            this.props.create && this.props.create(data);
        } else {
            this.setState({ descriptionError: 'You need to provide description longer than 2 characters!' });
        }
    };

    next = () => {
        this.setState({ currentStep: this.state.currentStep + 1 })
    };

    prev = () => {
        this.setState({ currentStep: this.state.currentStep - 1 })
    };
}

export default muiThemeable()(Create);