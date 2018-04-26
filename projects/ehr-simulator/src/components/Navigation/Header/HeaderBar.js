import React, {Component} from 'react';
import {getPatientName} from '../../../utils';
import moment from "moment";
import PersonIcon from "material-ui/svg-icons/social/person";
import PersonPinIcon from "material-ui/svg-icons/social/person-outline";
import HospitalIcon from "material-ui/svg-icons/maps/local-hospital";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/fontawesome-free-solid';
import SearchIcon from "material-ui/svg-icons/action/search";

import "./Header.css";

class HeaderBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selectedItem: 1,
            title: "Choose Patient",
        };
    }

    render() {
        const mrn = this.props.patient && this.props.patient.resource.identifier && this.props.patient.resource.identifier[0].value;
        return <div className="header-wrapper">
            <div className="header-patient-wrapper">
                <div className="patient-icon-wrapper" onClick={() => this.props.togglePatientSelector && this.props.togglePatientSelector()}>
                    <PersonIcon style={{width: "60px", height: "60px"}}/>
                </div>
                {this.props.patient
                    ? <div className="header-patient-info-wrapper">
                        <div className="header-patient-info-row">
                            <div className="header-patient-info">
                                <span>Patient:</span>
                                <span>{getPatientName(this.props.patient.resource)}</span>
                            </div>
                            <div className="header-patient-info">
                                <span>Gender:</span>
                                <span>{this.props.patient.resource.gender}</span>
                            </div>
                        </div>
                        <div className="header-patient-info-row">
                            <div className="header-patient-info">
                                <span>DOB:</span>
                                <span>{moment(this.props.patient.resource.birthDate).format("DD MMM YYYY")}</span>
                            </div>
                            <div className="header-patient-info">
                                <span>MRN:</span>
                                <span>{mrn}</span>
                            </div>
                        </div>
                    </div>
                    : <div className="header-patient-info-wrapper">
                        <div className="header-patient-info-row no-selection">
                            <div className="header-patient-info">
                                <span>Please select patient</span>
                            </div>
                        </div>
                    </div>}
            </div>
            <div className="header-persona-wrapper">
                <div className="persona-icon-wrapper" onClick={() => this.props.togglePersonaSelector && this.props.togglePersonaSelector()}>
                    <FontAwesomeIcon icon={faUserMd} style={{width: "45px", height: "45px", marginLeft: "8px", marginTop: "5px", color: "rgb(255, 255, 255)"}}/>
                </div>
                {this.props.persona
                    ? <div className="header-persona-info-wrapper">
                        <div className="header-persona-info-row">
                            <div className="header-persona-info">
                                <span> </span>
                                <span>{this.props.persona.personaName}</span>
                            </div>
                        </div>
                    </div>
                    : <div className="header-persona-info-wrapper">
                        <div className="header-persona-info-row no-selection">
                            <div className="header-persona-info">
                                <span>Please select persona</span>
                            </div>
                        </div>
                    </div>}
            </div>
        </div>;
    }
}

export default HeaderBar;
