import React, { Component } from 'react';
import { Badge, List, ListItem, Paper, RaisedButton, TextField } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter } from 'material-ui/Table';

import './styles.less';
import DohMessage from "../../../../../../../lib/components/DohMessage";

export default class PersonaList extends Component {

    static TYPES = {
        patient: 'Patient',
        persona: 'Persona',
        practitioner: 'Practitioner'
    };

    constructor (props) {
        super(props);

        this.timeout = null;

        this.state = {
            searchCrit: ''
        };
    }

    render () {
        let getName = (name) => {
            let strName = (name.family || name.family[0]) + ',';
            let i;
            for (i = 0; i < name.given.length; i++) {
                strName += ' ' + name.given[i];
            }
            return strName;
        };
        let getAge = (birthday) => {
            let ageDifMs = Date.now() - Date.parse(birthday);
            let ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
        let isPatient = this.props.type === PersonaList.TYPES.patient;
        let isPractitioner = this.props.type === PersonaList.TYPES.practitioner;
        let personas = this.props.personas && this.props.personas.map((persona, i) => (
            <ListItem key={persona.id} className='persona-list-item' onClick={() => this.handleRowSelect(i)}>
                {isPatient && <span className='gender-wrapper'>
                    <Badge primary={persona.gender === 'male'} secondary={persona.gender !== 'male'} badgeContent={persona.gender === 'male'
                        ? <i className="fa fa-mars" />
                        : <i className="fa fa-venus" />} />
                </span>}
                <span className='name-wrapper'>{persona.fhirName || getName(persona.name[0] || persona.name)}</span>
                {isPatient && <span><span className='label'>Age:</span> {getAge(persona.birthDate) || ''}</span>}
                {!isPatient && !isPractitioner && <div className='persona-info'>
                    <span><span className='label'>User Id:</span> {persona.personaUserId}</span>
                    <span><span className='label'>ResourceUrl:</span> {persona.resourceUrl}</span>
                </div>}
            </ListItem>
        ));

        let title = this.props.title
            ? this.props.title
            : isPatient ? 'Patients' : isPractitioner ? 'Practitioners' : 'Personas';

        return <div>
            <div className='actions'>
                {this.props.actions}
            </div>
            <div className='screen-title'>
                <h1>{title}</h1>
            </div>
            <div>
                {isPractitioner || isPatient
                    ? <div className='search'>
                        <span>Search by name: </span><TextField id='name-crit' value={this.state.searchCrit} onChange={this.critChanged} />
                    </div>
                    : <div className='hidden'></div>}

                {personas && personas.length > 0
                    ? <div>
                        <List className='persona-list'>{personas.filter((p, i) => i % 2 === 0)}</List>
                        <List className='persona-list'>{personas.filter((p, i) => i % 2 === 1)}</List>
                    </div>
                    : this.props.loading
                        ? <List>
                            <ListItem disabled>
                                <div className='personas-loader-wrapper'><i className='fa fa-spinner fa-pulse fa-3x fa-fw' /></div>
                            </ListItem>
                        </List>
                        : <DohMessage message={`There are no ${title} in this sandbox platform yet.`} />}
                {personas && personas.length > 0 && this.props.pagination && this.getPagination()}
            </div>
        </div>
    }

    critChanged = (_e, searchCrit) => {
        this.setState({ searchCrit });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.search(this.props.type, { name: this.state.searchCrit });
        }, 1500);
    };

    getPagination = () => {
        let self = this.props.pagination.link.find(i => i.relation === 'self');
        let currentSkip = self.url.indexOf('_getpagesoffset=') >= 0 ? parseInt(self.url.split('_getpagesoffset=')[1].split('&')[0]) : 0;
        let start = currentSkip + 1;
        let end = start + this.props.personas.length - 1;

        return this.props.pagination && <div className='persona-list-pagination-wrapper'>
            <div>
                {start > 1 && <RaisedButton label='Prev' secondary onClick={() => this.props.prev && this.props.prev()} />}
            </div>
            <div>
                <span>Showing {start} to {end} of {this.props.pagination.total}</span>
            </div>
            <div>
                {end + 1 < this.props.pagination.total && <RaisedButton label='Next' secondary onClick={() => this.props.next && this.props.next()} />}
            </div>
        </div>
    };

    handleRowSelect = (row) => {
        let persona = this.props.personas[row];
        this.props.click(persona);
    };
}
