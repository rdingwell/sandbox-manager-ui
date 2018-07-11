import React, { Component } from 'react';
import DownIcon from "material-ui/svg-icons/navigation/arrow-drop-down";
import Search from 'material-ui/svg-icons/action/search';
import Bubble from 'material-ui/svg-icons/communication/chat-bubble';
import Patient from "svg-react-loader?name=Patient!../../../../../../../lib/icons/patient.svg";
import { Chip, Menu, MenuItem, Popover, Slider, TextField } from 'material-ui';

import './styles.less';
import PersonaListWithTheme from "../List";

export default class Filters extends Component {

    timer = null;

    constructor (props) {
        super(props);

        this.state = {
            filters: {},
            maxAge: 99,
            minAge: 0
        }
    }

    render () {
        let isPatient = this.props.type === PersonaListWithTheme.TYPES.patient;
        let isPersona = this.props.type === PersonaListWithTheme.TYPES.persona;

        return <div className='filters'>
            {isPatient && this.getPatientFilters()}
            {isPersona && this.getPersonaFilters()}
        </div>
    }

    getPatientFilters = () => {
        let palette = this.props.theme;

        let genderActive = this.state.filters.gender;
        let genderTitle = genderActive ? this.state.filters.gender : 'Gender';
        let genderDeleteCallback = genderActive ? () => this.filter('gender') : undefined;

        let ageActive = this.state.filters.age;
        let ageTitle = ageActive ? this.state.filters.age : 'Age';
        let ageDeleteCallback = ageActive ? () => this.filter('age') : undefined;

        return [<div key={1}>
            <span ref='gender-filter'/>
            <Chip className={'chip' + (genderActive ? ' active' : '')} onClick={() => this.showFilter('gender')} onRequestDelete={genderDeleteCallback}
                  backgroundColor={genderActive ? palette.primary2Color : undefined} labelColor={genderActive ? palette.alternateTextColor : undefined}>
                <span className='genderTitle'>{genderTitle}</span>
                <span className='icon-wrapper'>
                        {!genderActive && <DownIcon color={palette.primary3Color}/>}
                </span>
            </Chip>
            {this.state.visibleFilter === 'gender' &&
            <Popover open={true} anchorEl={this.refs['gender-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                <Menu className='gender-filter-menu' width='200px' desktop autoWidth={false}>
                    <MenuItem className='gender-filter-menu-item' primaryText={'Male'} onClick={() => this.filter('gender', 'male')}/>
                    <MenuItem className='gender-filter-menu-item' primaryText={'Female'} onClick={() => this.filter('gender', 'female')}/>
                </Menu>
            </Popover>}
        </div>,
            <div key={2}>
                <span ref='age-filter'/>
                <Chip className={'chip' + (ageActive ? ' active' : '')} onClick={() => this.showFilter('age')} onRequestDelete={ageDeleteCallback}
                      backgroundColor={ageActive ? palette.primary2Color : undefined} labelColor={ageActive ? palette.alternateTextColor : undefined}>
                    <span className='genderTitle'>{ageTitle}</span>
                    <span className='icon-wrapper'>
                        {!ageActive && <DownIcon color={palette.primary3Color}/>}
                </span>
                </Chip>
                {this.state.visibleFilter === 'age' &&
                <Popover open={true} anchorEl={this.refs['age-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                    <div className='age-filter-wrapper'>
                        <Bubble style={{ position: 'absolute', right: `${((99 - this.state.maxAge) * 3) - 5}px` }}/>
                        <Slider defaultValue={99} step={1} min={0} max={99} onChange={(_, value) => this.sliderChange('maxAge', value)}/>
                        <Slider defaultValue={0} step={1} min={0} max={98} onChange={(_, value) => this.sliderChange('minAge', value)}/>
                    </div>
                </Popover>}
            </div>,
            <div key={3}>
                <Search style={{ width: '30px', height: '30px', color: palette.primary3Color, verticalAlign: 'middle' }}/>
                <TextField id='name-filter' hintText='Search by name' onChange={(_, value) => this.delayFiltering('name:contains', value)}/>
            </div>]
    };

    getPersonaFilters = () => {
        let palette = this.props.theme;

        let typeActive = this.state.filters.resource;
        let typeTitle = typeActive ? this.state.filters.resource : 'Type';
        let typeDeleteCallback = typeActive ? () => this.filter('resource') : undefined;

        return [<div key={1}>
            <span ref='persona-type-filter'/>
            <Chip className={'chip' + (typeActive ? ' active' : '')} onClick={() => this.showFilter('resource')} onRequestDelete={typeDeleteCallback}
                  backgroundColor={typeActive ? palette.primary2Color : undefined} labelColor={typeActive ? palette.alternateTextColor : undefined}>
                <span className='type-title'>{typeTitle}</span>
                <span className='icon-wrapper'>
                        {!typeActive && <DownIcon color={palette.primary3Color}/>}
                </span>
            </Chip>
            {this.state.visibleFilter === 'resource' &&
            <Popover open={true} anchorEl={this.refs['persona-type-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                <Menu className='persona-type-filter-menu' width='200px' desktop autoWidth={false}>
                    <MenuItem className='persona-type-filter-menu-item' primaryText={'Patient'} onClick={() => this.filter('resource', 'Patient')}
                              leftIcon={<Patient style={{ fill: this.props.theme.primary2Color }}/>}/>
                    <MenuItem className='persona-type-filter-menu-item' primaryText={'Practitioner'} onClick={() => this.filter('resource', 'Practitioner')}
                              leftIcon={<i className='fa fa-user-md fa-lg' style={{color: this.props.theme.accent1Color}}/>}/>
                </Menu>
            </Popover>}
        </div>]
    };

    sliderChange = (slider, value) => {
        let state = {};
        state[slider] = value;
        this.setState(state)
    };

    delayFiltering = (filter, value) => {
        this.timer && clearTimeout(this.timer);
        !this.timer && this.props.lookupPersonasStart(true);
        this.timer = setTimeout(() => {
            this.filter(filter, value);
            this.timer = null;
        }, 500);
    };

    filter = (filter, value) => {
        let filters = Object.assign({}, this.state.filters);
        value ? filters[filter] = value : delete filters[filter];

        this.setState({ filters });

        this.props.onFilter && this.props.onFilter(filters);
        this.showFilter();
    };

    showFilter = (filterName) => {
        this.setState({ visibleFilter: filterName });
    };
}
