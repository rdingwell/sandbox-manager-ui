import React from 'react';
import AppMenu from "./Navigation/AppMenu";
import {Paper, Card, Divider, CardText} from "material-ui";
import ShowApp from "./ShowApp";
import PatientSelectorDialog from "./Navigation/DialogBoxes/PatientSelectorDialog";
import PersonaSelectorDialog from "./Navigation/DialogBoxes/PersonaSelectorDialog";
import {call, setPersonaCookie} from "../utils";

import './Home.css';
import HeaderBar from "./Navigation/Header/HeaderBar";

const divStyle = {
    float: 'left',
    backgroundColor: '#4D5B66',
    width: '224px',
    height: 'calc(100vh - 60px)',
    borderRadius: 0
};

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bearer: props.match.params.bearer,
            sandboxApi: props.match.params.sandboxApi,
            sandboxId: props.match.params.sandboxId,
            refApi: props.match.params.refApi,

            selectedPersona: null,
            selectedPatient: null,
            listApps: null,

            showPatientSelector: true,
            showPersonaSelector: true,

            launchCodeUrl: `${window.location.protocol}//${props.match.params.refApi}/${props.match.params.sandboxId}/data/_services/smart/Launch`,
            personaAuthenticationUrl: `${window.location.protocol}//${props.match.params.sandboxApi}/userPersona/authenticate`,
            registeredAppsUrl: `${window.location.protocol}//${props.match.params.sandboxApi}/app?sandboxId=${props.match.params.sandboxId}`
        }
    }

    componentWillMount() {
        call(this.state.registeredAppsUrl, this.state.bearer)
            .then(loadedApps => {
                loadedApps = loadedApps || [];
                this.setState({loadedApps})
            });
    }

    componentWillUpdate(np, nextState) {
        // Reload the application with the new context
        this.state.selectedPatient && nextState.selectedPatient && this.state.selectedPatient.resource.id !== nextState.selectedPatient.resource.id &&
        this.state.currentApp && this.handleAppMenu(this.state.currentApp, nextState.selectedPatient.resource.id);
        this.state.selectedPersona && nextState.selectedPersona && this.state.selectedPersona.fhirId !== nextState.selectedPersona.fhirId &&
        this.state.currentApp && this.handleAppMenu(this.state.currentApp, nextState.selectedPatient.resource.id, nextState.selectedPersona);
    }

    render() {
        return <div className="home-screen-wrapper">
            <HeaderBar patient={this.state.selectedPatient} persona={this.state.selectedPersona} togglePatientSelector={() => this.setState({showPatientSelector: true})}
                       togglePersonaSelector={() => this.setState({showPersonaSelector: true})}/>
            <PersonaSelectorDialog refApi={this.state.refApi} patient={this.state.selectedPatient} open={this.state.showPersonaSelector}
                                   bearer={this.state.bearer} sandboxApi={this.state.sandboxApi} sandboxId={this.state.sandboxId}
                                   handlePersonaSelection={e => this.setState({selectedPersona: e})} onClose={() => this.setState({showPersonaSelector: false})}
            />
            <PatientSelectorDialog refApi={this.state.refApi} patient={this.state.selectedPatient}
                                   bearer={this.state.bearer} sandboxApi={this.state.sandboxApi} sandboxId={this.state.sandboxId}
                                   open={this.state.showPatientSelector}
                                   onClose={() => this.setState({showPatientSelector: false})}
                                   handlePatientSelection={e => this.setState({selectedPatient: e, selectedPatientId: e.resource.id})}
            />
            <Paper style={divStyle}>
                {this.state.loadedApps && <AppMenu patient={this.state.selectedPatient} handleAppMenu={this.handleAppMenu} apps={this.state.loadedApps}
                                                   selectedItem={this.state.currentApp ? this.state.currentApp.id : undefined}/>}
            </Paper>
            {this.state.selectedPatient && !this.state.currentApp && this.state.loadedApps && <div className="ehr-content-wrapper padding">{this.buildAppCards()}</div>}
            {this.state.currentApp && <div className="ehr-content-wrapper">
                <ShowApp patient={this.state.selectedPatient} url={this.state.url}/>
            </div>}
        </div>;
    }

    buildAppCards() {
        return this.state.loadedApps.map(d =>
            <Card className="app-card" key={d.id} onClick={() => this.handleAppMenu(d)}>
                <CardText className="card-body">
                    <img src={d.logoUri} alt="logo"/>
                    <Divider/>
                    <span className="card-title">{d.authClient.clientName}</span>
                </CardText>
            </Card>
        );
    }

    handleAppMenu = (e, patient = this.state.selectedPatientId, persona = this.state.selectedPersona) => {
        this.setState({currentApp: e, url: undefined});

        let body = {
            client_id: e.authClient.clientName,
            parameters: {
                patient: patient,
                need_patient_banner: false
            }
        };


        call(this.state.launchCodeUrl, this.state.bearer, 'POST', body)
            .then(data => {
                let url = `${e.launchUri}?iss=${window.location.protocol}//${this.state.refApi}/${e.sandbox.sandboxId}/data&launch=${data.launch_id}`;
                this.setState({url});
                try {
                    if (persona.personaUserId != null) {
                        let credentials = {
                            username: persona.personaUserId,
                            password: persona.password
                        };

                        call(this.state.personaAuthenticationUrl, undefined, 'POST', credentials)
                            .then(personaAuthResult => {
                                setPersonaCookie(personaAuthResult.jwt);
                            }).catch(function (error) {
                            console.log(error);
                        });
                    }
                }catch(e){
                    console.log("There is no persona.")
                }
            });


    };
}
