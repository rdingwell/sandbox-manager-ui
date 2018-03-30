import React, { Component } from 'react';
import { Paper } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import './styles.less';

export default class PersonaList extends Component {

    static TYPES = {
        patient: "Patient",
        persona: "userPersona",
        practitioner: "Practitioner"
    };

    // handleRowSelect = (row) => {
    //     let persona = this.props.personas[row];
    //     this.props.click(persona);
    //     //todo fire event up to parent to pass patient to
    //     //sibling component
    // };


    render () {
        let getName = (name) => {
            let strName = name.family + ",";
            let i;
            for (i = 0; i < name.given.length; i++) {
                strName += " " + name.given[i];
            }
            return strName;
        };
        let getAge = (birthday) => {
            let ageDifMs = Date.now() - Date.parse(birthday);
            let ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
        let isPatient = this.props.type === PersonaList.TYPES.patient;
        let personas = this.props.personas.map(persona => (
            <TableRow key={persona.id} hoverable className='persona-list-row'>
                <TableRowColumn>
                    {getName(persona.name[0])}
                </TableRowColumn>
                {isPatient && <TableRowColumn>
                    {persona.gender}
                </TableRowColumn>}
                {isPatient && <TableRowColumn>
                    {getAge(persona.birthDate) || ""}
                </TableRowColumn>}
            </TableRow>
        ));

        return (
            <Paper className="paper-card">
                <h3>{isPatient ? "Patients" : "Practitioners"}</h3>
                <div className="paper-body">
                    <Table selectable={false} fixedHeader width="100%" onCellClick={this.handleRowSelect}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                {isPatient && <TableHeaderColumn>Gender</TableHeaderColumn>}
                                {isPatient && <TableHeaderColumn>Age</TableHeaderColumn>}
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} stripedRows showRowHover>
                            {personas}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}
