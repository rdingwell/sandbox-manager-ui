import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import PersonaList from "./PersonaList";
import PersonaDetails from "./PersonaDetails";

import './styles.less';

class Persona extends Component {

    constructor (props) {
        super(props);

        let type = this.getType(props);

        this.state = {
            selectedPersona: null,
            type
        }
    }

    componentDidMount () {
        this.props.fetchPersonas(this.state.type);
        this.props.app_setScreen(this.state.type === PersonaList.TYPES.patient ? 'patients' : 'practitioners');
    }

    componentWillUpdate (nextProps) {
        let type = this.getType(nextProps);
        type !== this.state.type && this.setState({ type });
        type !== this.state.type && this.props.fetchPersonas(type);
    }

    selectPersonHandler = (persona) => {
        !this.props.doLaunch && this.setState({ selectedPersona: persona });
        // this.props.doLaunch && (() => {
        //     let key = Patients.random(32);
        //     window.localStorage[key] = "requested-launch";
        //
        //     let params = {};
        //     if (person) {
        //         params = { patient: person.id };
        //     }
        //
        //     params["need_patient_banner"] = false;
        //     let appWindow = window.open('launch.html?' + key, '_blank');
        //
        //     registerAppContext(app, params, {}, key);
        //     if (userPersona !== null && userPersona !== undefined && userPersona) {
        //         appsSettings.getSettings().then(function (settings) {
        //             fetch(settings.sandboxManagerApiUrl + "/userPersona/authenticate", {
        //                 username: userPersona.personaUserId,
        //                 password: userPersona.password
        //             }).then(function (response) {
        //                 cookieService.addPersonaCookie(response.data.jwt);
        //             }).catch(function (error) {
        //                 $log.error(error);
        //                 appWindow.close();
        //             });
        //         });
        //     }
        // })();
    };

    static random (length) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
    }

    render () {
        let personaList = null;
        if (!this.props.loading) {
            personaList = <PersonaList key={this.state.type} type={this.state.type} personas={this.props.personas} click={this.selectPersonHandler} />;
        }
        let personaDetails = null;
        if (!this.props.doLaunch && this.state.selectedPersona) {
            personaDetails = (
                <PersonaDetails persona={this.state.selectedPersona} />);
        }

        return <div className="patients-wrapper">
            <div>
                {personaList}
                {personaDetails}
            </div>
        </div>;
    }

    getType (props) {
        return (props.location && props.location.pathname === "/patients") || (props.type === "Patient")
            ? PersonaList.TYPES.patient
            : (props.location && props.location.pathname === "/practitioners") || (props.type === "Practitioner")
                ? PersonaList.TYPES.practitioner
                : PersonaList.TYPES.persona;
    }
}

function mapStateToProps (state, ownProps) {
    let personas = (ownProps.location && ownProps.location.pathname === "/patients") || (ownProps.type === "Patient")
        ? state.persona.patients
        : state.persona.practitioners;
    return {
        personas,
        loading: state.persona.loading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonas: (type) => dispatch(actions.fetchPersonas(type)),
        app_setScreen: (screen) => dispatch(actions.app_setScreen(screen))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Persona));
