import React, { Component } from 'react';
import { Badge, CircularProgress, FloatingActionButton, IconButton, ListItem, RaisedButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import RightIcon from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import LeftIcon from "material-ui/svg-icons/hardware/keyboard-arrow-left";
import FilterList from "material-ui/svg-icons/content/filter-list";
import Filters from '../Filters';
import DohMessage from "../../../../../../../lib/components/DohMessage";
import ConfirmModal from "../../../../../../../lib/components/ConfirmModal";
import Page from '../../../../../../../lib/components/Page';
import { BarChart } from 'react-chartkick';
import CreatePersona from "../Create";
import moment from 'moment';

import './styles.less';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { doLaunch, fetchPatientDetails, patientDetailsFetchStarted, deletePersona } from "../../../../redux/action-creators";

let chartData = [
    ['Allergy Intolerance', 0], ['Care Plan', 0], ['Care Team', 0], ['Condition', 0], ['Diagnostic Report', 0], ['Encounter', 0],
    ['Goal', 0], ['Immunization', 0], ['Medication Dispense', 0], ['Medication Request', 0], ['Observation', 0], ['Procedure', 0], ['Procedure Request', 0]
];
let rowSelectionTimer = null;
const TYPES = {
    patient: 'Patient',
    persona: 'Persona',
    practitioner: 'Practitioner'
};
const CHART = <BarChart data={chartData} library={{ yAxis: { allowDecimals: false }, plotOptions: { series: { dataLabels: { enabled: true } } } }}/>;

class PersonaList extends Component {

    constructor (props) {
        super(props);

        this.state = {
            searchCrit: '',
            creationType: '',
            showConfirmModal: false,
            showCreateModal: false
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

        let personaList = this.getPersonaList(isPatient, isPractitioner);

        return <Page title={title}>
            <ConfirmModal open={this.state.showConfirmModal} confirmLabel='Delete' onConfirm={this.deletePersona} onCancel={() => this.setState({ showConfirmModal: false })} title='Confirm'>
                <p>
                    Are you sure you want to delete this {this.props.type.toLowerCase()}?
                </p>
            </ConfirmModal>
            {!this.props.modal && <div className='create-resource-button'>
                <CreatePersona open={this.state.showCreateModal} create={this.props.create} type={this.props.type} theme={this.props.theme} close={() => this.toggleCreateModal()}
                               personaType={this.state.creationType} personas={this.props[this.state.creationType.toLowerCase() + 's']} search={this.props.search}/>
            </div>}
            <div className='personas-wrapper'>
                <div className='filter-wrapper'>
                    <FilterList color={this.props.theme.primary3Color}/>
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter}/>
                    <div className='actions'>
                        {personaList && personaList.length > 0 && this.props.pagination && this.getPagination()}
                        {(isPractitioner || isPatient) && !this.props.modal && <FloatingActionButton onClick={() => this.toggleCreateModal()}>
                            <ContentAdd/>
                        </FloatingActionButton>}
                        {(!isPractitioner && !isPatient) && !this.props.modal && <FloatingActionButton onClick={() => this.toggleCreateModal(TYPES.patient)} style={{ marginRight: '16px' }}>
                            <i className='fa fa-bed fa-lg'/>
                        </FloatingActionButton>}
                        {(!isPractitioner && !isPatient) && !this.props.modal && <FloatingActionButton onClick={() => this.toggleCreateModal(TYPES.practitioner)}>
                            <i className='fa fa-user-md fa-lg'/>
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

    toggleCreateModal = (type) => {
        type && this.props.fetchPersonas(type);
        this.setState({ showCreateModal: !this.state.showCreateModal, creationType: type || '' });
    };

    getPersonaList = (isPatient, isPractitioner) => {
        let itemStyles = { backgroundColor: this.props.theme.canvasColor };

        return this.props.personaList && this.props.personaList.map((persona, i) => {
            let style = this.props.theme
                ? { backgroundColor: persona.gender === 'male' ? this.props.theme.primary2Color : this.props.theme.accent1Color, color: this.props.theme.primary5Color }
                : undefined;
            let badge = isPatient
                ? <Badge badgeStyle={style} badgeContent={persona.gender === 'male' ? <i className="fa fa-mars"/> : <i className="fa fa-venus"/>}/>
                : isPractitioner ? <Badge badgeStyle={{ color: this.props.theme.primary1Color }} badgeContent={<i className="fa fa-user-md fa-2x"/>}/>
                    : <Badge badgeContent=' '/>;
            let age = this.getAge(persona.birthDate);
            let isSelected = i === this.state.selected;
            let contentStyles = isSelected ? { borderTop: '1px solid ' + this.props.theme.primary7Color } : {};

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
                {!this.props.modal && <div className='actions-wrapper'>
                    <IconButton tooltip='Open in Patient Data Manager' onClick={e => this.openInDM(e, persona)}>
                        <LaunchIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    {!isPatient && !isPractitioner && <IconButton style={{ color: this.props.theme.primary3Color }} tooltip='Delete' onClick={e => this.deletePersona(e, persona)}>
                        <DeleteIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>}
                    {isPatient && <IconButton className='expanded-toggle'>
                        <DownIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>}
                </div>}
                <div className='content' style={contentStyles}>
                    {isSelected && CHART}
                </div>
            </div>
        });
    };

    deletePersona = (e, persona) => {
        if (persona && !this.state.personaToDelete) {
            this.setState({ showConfirmModal: true, personaToDelete: persona });
            e.stopPropagation();
        } else {
            this.props.deletePersona(this.state.personaToDelete);
            this.setState({ showConfirmModal: false, personaToDelete: undefined });
        }
    };

    openInDM = (e, persona) => {
        e.stopPropagation();
        this.props.doLaunch({
            "authClient": {
                "clientName": "Patient Data Manager",
                "clientId": "patient_data_manager",
                "redirectUri": "https://patient-data-manager.hspconsortium.org/index.html"
            },
            "appUri": "https://patient-data-manager.hspconsortium.org/",
            "launchUri": "https://patient-data-manager.hspconsortium.org/launch.html",
            "logoUri": "https://content.hspconsortium.org/images/hspc-patient-data-manager/logo/pdm.png",
            "briefDescription": "The HSPC Patient Data Manager app is a SMART on FHIR application that is used for managing the data of a single patient."
        }, persona);
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
        let end = start + this.props.personaList.length - 1;

        return this.props.pagination && <div className='persona-list-pagination-wrapper'>
            <div>
                <IconButton onClick={() => this.paginate(this.props.prev)} disabled={start === 1 || this.props.loading}>
                    <LeftIcon/>
                </IconButton>
            </div>
            <div>
                <span>Showing {start} to {end} of {this.props.pagination.total}</span>
            </div>
            <div>
                <IconButton onClick={() => this.paginate(this.props.next)} disabled={end + 1 >= this.props.pagination.total || this.props.loading}>
                    <RightIcon/>
                </IconButton>
            </div>
        </div>
    };

    paginate = toCall => {
        toCall && toCall();
        toCall && this.setState({ selected: undefined });
    };

    handleRowSelect = (row, persona) => {
        if (!this.props.modal) {
            let selection = getSelection();
            let parentNodeClass = selection.baseNode && selection.baseNode.parentNode && selection.baseNode.parentNode.classList && selection.baseNode.parentNode.classList.value;
            let actualClick = (parentNodeClass !== 'persona-info' && parentNodeClass !== 'name-wrapper') || selection.toString().length === 0;
            if (!rowSelectionTimer && actualClick) {
                rowSelectionTimer = setTimeout(() => {
                    rowSelectionTimer = null;
                    let selected = this.state.selected !== row ? row : undefined;
                    selected !== undefined && this.props.patientDetailsFetchStarted();
                    selected !== undefined && setTimeout(() => this.props.fetchPatientDetails(persona), 500);
                    this.setState({ selected });
                }, 500)
            } else {
                clearTimeout(rowSelectionTimer);
                rowSelectionTimer = null;
            }
        } else {
            this.props.click && this.props.click(persona);
        }
    };
}


const mapStateToProps = state => {
    return {
        patients: state.persona.patients,
        practitioners: state.persona.practitioners,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        practitionersPagination: state.persona.practitionersPagination,
        personasPagination: state.persona.personasPagination,
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

const mapDispatchToProps = dispatch => bindActionCreators({ fetchPatientDetails, patientDetailsFetchStarted, doLaunch, deletePersona }, dispatch);

let PersonaListWithTheme = connect(mapStateToProps, mapDispatchToProps)(PersonaList);

PersonaListWithTheme.TYPES = TYPES;

export default PersonaListWithTheme;