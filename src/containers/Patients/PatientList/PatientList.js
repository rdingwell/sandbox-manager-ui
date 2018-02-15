import React, {Component} from 'react';
import Paper from 'material-ui/Paper';


import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


class PatientList extends Component{

    handleRowSelect = (row) => {
        let patient = this.props.patients[row];
        this.props.click(patient);
        //todo fire event up to parent to pass patient to
        //sibling component
    };


    render(){
        let getName = (name) => {
            let strName = name.family + ",";
            let i;
            for(i = 0; i < name.given.length; i++){
                strName += " " + name.given[i];
            }
            return strName;
        };
        let getAge = (birthday) => {
            var ageDifMs = Date.now() - Date.parse(birthday);
            var ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
        let patients = this.props.patients.map(patient => (
            <TableRow key={patient.id}>
                <TableRowColumn>
                    {getName(patient.name[0])}
                </TableRowColumn>
                <TableRowColumn>
                    {patient.gender}
                </TableRowColumn>
                <TableRowColumn>
                    {getAge(patient.birthDate)}
                </TableRowColumn>
            </TableRow>
        ));

        return(
            <Paper className="PaperCard">
                <h3>Patients</h3>
                <div className="PaperBody">
                    <Table
                        selectable={false}
                        height="300px"
                        fixedHeader={true}
                        width="100%"
                        onCellClick={this.handleRowSelect}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false}
                                     enableSelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Gender</TableHeaderColumn>
                                <TableHeaderColumn>Age</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            stripedRows={true}>
                            {patients}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

export default PatientList;