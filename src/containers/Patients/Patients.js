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
        //this.props.onFetchPatients();
    }


    render() {
        let patients = null;
        if ( !this.props.loading ) {
            patients = this.props.patients.map(patient => (
                <TableRow key={patient.id}>
                    <TableRowColumn>
                        {patient.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        {patient.description}
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
                                <TableHeaderColumn>Sandbox Name</TableHeaderColumn>
                                <TableHeaderColumn>Description</TableHeaderColumn>
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
