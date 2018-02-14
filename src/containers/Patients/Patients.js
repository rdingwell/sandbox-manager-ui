import React, { Component } from 'react';
import * as  actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axiox';
import Paper from 'material-ui/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';



class Patients extends Component {

    componentDidMount () {
        this.props.onFetchPatients();
    }



    render() {
        let patients = null;
        let getName = (name) => {
            let strName = name.family + ",";
            let i = 0;
            for(i = 0; i < name.given.length; i++){
                strName += " " + name.given[i];
            }
            return strName;
        };
        let getAge = (birthday) => {
            var ageDifMs = Date.now() - Date.parse(birthday);
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
        if ( !this.props.loading ) {
            patients = this.props.patients.map(patient => (
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

        }

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

const mapStateToProps = state => {

    return {
        patients : state.patient.patients,
        loading: state.patient.lookingForPatients
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchPatients: () => dispatch( actions.fetchPatients() )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Patients, axios ) );
