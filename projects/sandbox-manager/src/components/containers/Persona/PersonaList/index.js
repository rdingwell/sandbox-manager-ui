import React, { Component } from 'react';
import { Badge, List, ListItem, RaisedButton, TextField } from 'material-ui';
import DohMessage from "../../../../../../../lib/components/DohMessage";

import './styles.less';

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

        let personas = this.props.personas && this.props.personas.map((persona, i) => {
            let style = this.props.theme
                ? {
                    color: persona.gender === 'male' ? this.props.theme.accent2Color : this.props.theme.accent3Color
                }
                : undefined;

            return <ListItem key={persona.id} className='persona-list-item' onClick={() => this.handleRowSelect(i)}>
                {isPatient && <span className='gender-wrapper'>
                    <Badge badgeStyle={style}
                           badgeContent={persona.gender === 'male'
                               ? <i className="fa fa-mars" />
                               : <i className="fa fa-venus" />} />
                </span>}
                {isPractitioner && <span className='practitioner-icon-wrapper'>
                    <Badge badgeStyle={{color: this.props.theme.primary1Color}} badgeContent={<i className="fa fa-user-md fa-2x" />} />
                </span>}
                <div className='persona-list-details'>
                    <div className='name-wrapper'>{persona.fhirName || getName(persona.name[0] || persona.name)}</div>
                    {isPatient && <div className='persona-info'><span className='label'>Age:</span> {getAge(persona.birthDate) || ''}</div>}
                    {!isPatient && !isPractitioner && <div className='persona-info'>
                        <span>{persona.personaUserId}</span>
                    </div>}
                </div>
            </ListItem>
        });

        let title = this.props.title
            ? this.props.title
            : isPatient ? 'Patients' : isPractitioner ? 'Practitioners' : 'Personas';

        return <div className={this.props.modal ? 'persona-modal' : ''}>
            <div className='actions'>
                {this.props.actions}
            </div>
            <div className='screen-title'>
                <h1>{title}</h1>
            </div>
            <div className={this.props.modal ? 'persona-list-wrapper' : ''}>
                {isPractitioner || isPatient
                    ? <div className='search'>
                        <span>Search by name: </span><TextField id='name-crit' value={this.state.searchCrit} onChange={this.critChanged} />
                    </div>
                    : <div className='hidden'></div>}

                {personas && personas.length > 0
                    ? <div className='lists-wrapper'>
                        <List className='persona-list'>{personas.filter((p, i) => i % 3 === 0)}</List>
                        <List className='persona-list'>{personas.filter((p, i) => i % 3 === 1)}</List>
                        <List className='persona-list'>{personas.filter((p, i) => i % 3 === 2)}</List>
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
