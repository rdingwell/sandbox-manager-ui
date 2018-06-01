import React, { Component } from 'react';
import { Paper, RaisedButton, TextField } from 'material-ui';
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
        let personas = this.props.personas && this.props.personas.map(persona => (
            <TableRow key={persona.id} hoverable className='persona-list-row'>
                <TableRowColumn>
                    {persona.fhirName || getName(persona.name[0] || persona.name)}
                </TableRowColumn>
                {isPatient && <TableRowColumn>
                    {persona.gender}
                </TableRowColumn>}
                {isPatient && <TableRowColumn>
                    {getAge(persona.birthDate) || ''}
                </TableRowColumn>}
                {!isPatient && !isPractitioner && <TableRowColumn>
                    {persona.personaUserId}
                </TableRowColumn>}
                {!isPatient && !isPractitioner && <TableRowColumn>
                    {persona.resourceUrl}
                </TableRowColumn>}
            </TableRow>
        ));

        let title = this.props.title
            ? this.props.title
            : isPatient ? 'Patients' : isPractitioner ? 'Practitioners' : 'Personas';

        return <Paper className='paper-card persona-list'>
            <h3 style={{ width: 'auto' }}>{title}</h3>
            <div className='actions'>
                {this.props.actions}
            </div>
            <div className='paper-body'>
                {isPractitioner || isPatient
                    ? <div className='search'>
                        <span>Search by name: </span><TextField id='name-crit' value={this.state.searchCrit} onChange={this.critChanged} />
                    </div>
                    : <div className='hidden'></div>}
                <Table selectable={false} fixedHeader width='100%' onCellClick={this.handleRowSelect} wrapperClassName='sample'>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            {isPatient && <TableHeaderColumn>Gender</TableHeaderColumn>}
                            {isPatient && <TableHeaderColumn>Age</TableHeaderColumn>}
                            {!isPatient && !isPractitioner && <TableHeaderColumn>User id</TableHeaderColumn>}
                            {!isPatient && !isPractitioner && <TableHeaderColumn>FHIR Resource</TableHeaderColumn>}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows showRowHover>
                        {personas && personas.length > 0
                            ? personas
                            : this.props.loading
                                ? <TableRow>
                                    <TableRowColumn colSpan={4} style={{backgroundColor: 'transparent !important'}}>
                                        <div className='personas-loader-wrapper'><i className='fa fa-spinner fa-pulse fa-3x fa-fw' /></div>
                                    </TableRowColumn>
                                </TableRow>
                                : <TableRow>
                                    <TableRowColumn colSpan={4} style={{backgroundColor: 'transparent !important'}}>
                                        <DohMessage message={`There are no ${title} in this sandbox platform yet.`} />
                                    </TableRowColumn>
                                </TableRow>}
                    </TableBody>
                    {personas && personas.length > 0 && this.props.pagination && this.getPagination()}
                </Table>
            </div>
        </Paper>;
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

        return this.props.pagination && <TableFooter adjustForCheckbox={false}>
            <TableRow>
                <TableRowColumn colSpan='3' className='persona-list-pagination-wrapper'>
                    <div>
                        {start > 1 && <RaisedButton label='Prev' secondary onClick={() => this.props.prev && this.props.prev()} />}
                    </div>
                    <div>
                        <span>Showing {start} to {end} of {this.props.pagination.total}</span>
                    </div>
                    <div>
                        {end + 1 < this.props.pagination.total && <RaisedButton label='Next' secondary onClick={() => this.props.next && this.props.next()} />}
                    </div>
                </TableRowColumn>
            </TableRow>
        </TableFooter>
    };

    handleRowSelect = (row) => {
        let persona = this.props.personas[row];
        this.props.click(persona);
    };
}
