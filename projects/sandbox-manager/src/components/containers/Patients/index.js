import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import PatientList from "./PatientList/PatientList";
import PatientDetails from "./PatientDetails/PatientDetails";

import './styles.less';

class Patients extends Component {

    state = {
        patient: null
    };

    componentDidMount () {
        this.props.onFetchPatients();
        this.props.app_setScreen('patients');
    }

    selectPersonHandler = (person) => {
        !this.props.doLaunch && this.setState({ patient: person });
        this.props.doLaunch && (() => {
            let key = Patients.random(32);
            window.localStorage[key] = "requested-launch";

            let params = {};
            if (person) {
                params = { patient: person.id };
            }

            params["need_patient_banner"] = false;
            let appWindow = window.open('launch.html?' + key, '_blank');

            registerAppContext(app, params, {}, key);
            if (userPersona !== null && userPersona !== undefined && userPersona) {
                appsSettings.getSettings().then(function (settings) {
                    fetch(settings.sandboxManagerApiUrl + "/userPersona/authenticate", {
                        username: userPersona.personaUserId,
                        password: userPersona.password
                    }).then(function (response) {
                        cookieService.addPersonaCookie(response.data.jwt);
                    }).catch(function (error) {
                        $log.error(error);
                        appWindow.close();
                    });
                });
            }
        })();
    };

    static random (length) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
    }

    getPatientListStyle = () => {
        let style = {};
        if (!this.props.doLaunch && this.state.patient) {
            style.float = 'left';
            style.width = '50%';
        }
        return style;
    };

    getPatientDetailStyle = () => {
        let style = {};
        if (!this.props.doLaunch && this.state.patient) {
            style.float = 'right';
            style.width = '50%';
        }
        return style;
    };

    render () {

        let patientList = null;
        if (!this.props.loading) {
            patientList = (
                <PatientList patients={this.props.patients} click={this.selectPersonHandler} />);
        }
        let patientDetails = null;
        if (!this.props.doLaunch && this.state.patient) {
            patientDetails = (
                <PatientDetails patient={this.state.patient} />);
        }

        return <div className="patients-wrapper">
            {patientList && <div style={this.getPatientListStyle()}>
                {patientList}
            </div>}
            {patientDetails && <div style={this.getPatientDetailStyle()}>
                {patientDetails}
            </div>}
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        patients: state.patient.patients,
        loading: state.patient.lookingForPatients
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchPatients: () => dispatch(actions.fetchPatients()),
        app_setScreen: (screen) => dispatch(actions.app_setScreen(screen))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Patients));
