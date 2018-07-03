import React, { Component } from 'react';
import { Badge, CircularProgress, FloatingActionButton, IconButton, ListItem, RaisedButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/image/edit';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import FilterList from "material-ui/svg-icons/content/filter-list";
import Filters from '../Filters';
import DohMessage from "../../../../../../../lib/components/DohMessage";
import Page from '../../../../../../../lib/components/Page';
import { BarChart } from 'react-chartkick';
import CreatePersona from "../Create";
import muiThemeable from "material-ui/styles/muiThemeable";
import moment from 'moment';

import './styles.less';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { doLaunch, fetchPatientDetails, patientDetailsFetchStarted } from "../../../../redux/action-creators";

const TYPES = {
    patient: 'Patient',
    persona: 'Persona',
    practitioner: 'Practitioner'
};

let chartData = [
    ['Allergy Intolerance', 0], ['Care Plan', 0], ['Care Team', 0], ['Condition', 0], ['Diagnostic Report', 0], ['Encounter', 0],
    ['Goal', 0], ['Immunization', 0], ['Medication Dispense', 0], ['Medication Request', 0], ['Observation', 0], ['Procedure', 0], ['Procedure Request', 0]
];
const CHART = <BarChart data={chartData}/>;

class PersonaList extends Component {

    constructor (props) {
        super(props);

        this.timeout = null;

        this.state = {
            searchCrit: ''
        };
    }

    componentWillReceiveProps (nextProps) {
        chartData[0][1] = nextProps.allergyCount;
        chartData[1][1] = nextProps.carePlanCount;
        chartData[2][1] = nextProps.careTeamCount;
        chartData[3][1] = nextProps.conditionCount;
        chartData[4][1] = nextProps.diagnosticReportCount;
        chartData[5][1] = nextProps.encounterCount;
        chartData[6][1] = nextProps.goalCount;
        chartData[7][1] = nextProps.immunizationCount;
        chartData[8][1] = nextProps.medicationDispenseCount;
        chartData[9][1] = nextProps.medicationRequestCount;
        chartData[10][1] = nextProps.observationCount;
        chartData[11][1] = nextProps.procedureCount;
        chartData[12][1] = nextProps.procedureRequestCount;
    }

    render () {
        let isPatient = this.props.type === TYPES.patient;
        let isPractitioner = this.props.type === TYPES.practitioner;

        let defaultTitle = isPatient ? 'Patients' : isPractitioner ? 'Practitioners' : 'Personas';
        let title = this.props.title ? this.props.title : defaultTitle;
        // let createButton = (isPractitioner || isPatient) && !this.props.modal && <div className='create-resource-button'>
        //     <CreatePersona create={this.props.create} type={this.props.type} theme={this.props.theme}/>
        // </div>;

        let personaList = this.getPersonaList(isPatient, isPractitioner);

        return <Page title={title}>
            <div className='personas-wrapper'>
                <div className='filter-wrapper'>
                    <FilterList color={this.props.muiTheme.palette.primary3Color}/>
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter} appliedIdFilter={this.state.appIdFilter}/>
                    <div className='actions'>
                        {(isPractitioner || isPatient) && !this.props.modal && <FloatingActionButton onClick={this.toggleModal}>
                            <ContentAdd/>
                        </FloatingActionButton>}
                    </div>
                </div>
                <div>
                    {personaList && personaList.length > 0 && !this.props.loading
                        ? <div className='persona-list'>
                            {personaList}
                        </div>
                        : this.props.loading
                            ? <div className='loader-wrapper'>
                                <CircularProgress size={80} thickness={5}/>
                            </div>
                            : this.state.searchCrit
                                ? <div className='centered'>No results found</div>
                                : <DohMessage message={`No ${defaultTitle.toLowerCase()} in sandbox.`}/>}
                    {personaList && personaList.length > 0 && this.props.pagination && this.getPagination()}
                </div>
            </div>
        </Page>
    }

    getPersonaList = (isPatient, isPractitioner) => {
        let itemStyles = { backgroundColor: this.props.muiTheme.palette.canvasColor };

        return this.props.personas && this.props.personas.map((persona, i) => {
            let style = this.props.theme
                ? { backgroundColor: persona.gender === 'male' ? this.props.theme.primary2Color : this.props.theme.accent1Color, color: this.props.theme.primary5Color }
                : undefined;
            let badge = isPatient
                ? <Badge badgeStyle={style} badgeContent={persona.gender === 'male' ? <i className="fa fa-mars"/> : <i className="fa fa-venus"/>}/>
                : isPractitioner ? <Badge badgeStyle={{ color: this.props.theme.primary1Color }} badgeContent={<i className="fa fa-user-md fa-2x"/>}/>
                    : <Badge badgeContent=' '/>;
            let age = this.getAge(persona.birthDate);
            let isSelected = i === this.state.selected;
            let contentStyles = isSelected ? { borderTop: '1px solid ' + this.props.muiTheme.palette.primary7Color } : {};

            return <div key={persona.id} style={itemStyles} className={'persona-list-item' + (isSelected ? ' active' : '')} onClick={() => this.handleRowSelect(i, persona)}>
                <span className='left-icon-wrapper'>
                    {badge}
                </span>
                <div className='persona-list-details'>
                    <div className='name-wrapper'>{persona.fhirName || this.getName(persona.name[0] || persona.name)}</div>
                    {isPatient && <div className='persona-info'>{age ? (age + ' | ') : ''} {persona.birthDate ? (' dob ' + moment(persona.birthDate).format('DD MMM YYYY')) + ' | ' : ''} {persona.id}</div>}
                    {!isPatient && !isPractitioner && <div className='persona-info'>
                        <span>{persona.personaUserId}</span>
                    </div>}
                </div>
                <div className='actions-wrapper'>
                    <IconButton tooltip='Launch'>
                        <LaunchIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <IconButton className='visible-button'>
                        <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <IconButton className='hidden-button' style={{ color: this.props.muiTheme.palette.primary3Color }} tooltip='Edit'>
                        <EditIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <IconButton className='hidden-button' style={{ color: this.props.muiTheme.palette.primary3Color }} tooltip='Delete'>
                        <DeleteIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <IconButton className='expanded-toggle'>
                        <DownIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                </div>
                <div className='content' style={contentStyles}>
                    {isSelected && CHART}
                </div>
            </div>
        });
    };

    getAge = (birthday) => {
        let currentDate = moment();
        let birthDate = moment(Date.parse(birthday));

        let result = "";
        let years = currentDate.diff(birthDate, 'years');
        result += years + 'y ';
        currentDate.subtract({ years });
        let months = currentDate.diff(birthDate, 'months');
        result += months + 'm ';
        currentDate.subtract({ months });
        let days = currentDate.diff(birthDate, 'days');
        result += days + 'd';
        return result;
    };

    getName = (name) => {
        let strName = (name.family || name.family[0]) + ',';
        let i;
        if (name.given && name.given.length) {
            for (i = 0; i < name.given.length; i++) {
                strName += ' ' + name.given[i];
            }
        }
        return strName;
    };

    onFilter = (searchCrit) => {
        this.props.search(this.props.type, searchCrit);
    };

    getPagination = () => {
        let self = this.props.pagination.link.find(i => i.relation === 'self');
        let currentSkip = self.url.indexOf('_getpagesoffset=') >= 0 ? parseInt(self.url.split('_getpagesoffset=')[1].split('&')[0]) : 0;
        let start = currentSkip + 1;
        let end = start + this.props.personas.length - 1;

        return this.props.pagination && <div className='persona-list-pagination-wrapper'>
            <div>
                <RaisedButton label='Prev' secondary onClick={() => this.props.prev && this.props.prev()} disabled={start === 1 || this.props.loading}/>
            </div>
            <div>
                <span>Showing {start} to {end} of {this.props.pagination.total}</span>
            </div>
            <div>
                <RaisedButton label='Next' secondary onClick={() => this.props.next && this.props.next()} disabled={end + 1 >= this.props.pagination.total || this.props.loading}/>
            </div>
        </div>
    };

    handleRowSelect = (row, persona) => {
        // if (!this.props.fetchingDetails) {
        let selected = this.state.selected !== row ? row : undefined;
        selected !== undefined && this.props.patientDetailsFetchStarted();
        selected !== undefined && setTimeout(() => this.props.fetchPatientDetails(persona), 500);
        this.setState({ selected });
        // }
    };
}


const mapStateToProps = state => {
    return {
        fetchingDetails: state.patient.fetching,
        observationCount: state.patient.details.Observation || 0,
        encounterCount: state.patient.details.Encounter || 0,
        medicationRequestCount: state.patient.details.MedicationRequest || 0,
        medicationDispenseCount: state.patient.details.MedicationDispense || 0,
        allergyCount: state.patient.details.AllergyIntolerance || 0,
        conditionCount: state.patient.details.Condition || 0,
        procedureCount: state.patient.details.Procedure || 0,
        diagnosticReportCount: state.patient.details.DiagnosticReport || 0,
        immunizationCount: state.patient.details.Immunization || 0,
        carePlanCount: state.patient.details.CarePlan || 0,
        careTeamCount: state.patient.details.CareTeam || 0,
        goalCount: state.patient.details.Goal || 0
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ fetchPatientDetails, patientDetailsFetchStarted, doLaunch }, dispatch);

let PersonaListWithTheme = connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(PersonaList));

PersonaListWithTheme.TYPES = TYPES;

export default PersonaListWithTheme;