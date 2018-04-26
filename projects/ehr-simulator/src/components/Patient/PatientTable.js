import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui/Table';

import "./Patient.css";

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class PatientTableTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: true,
            selectable: false,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            height: '300px'
        };
    }


    handleToggle = (selectedRow) => {
        this.props.handleSelectedPatient(this.props.patientArray != null ? this.props.patientArray.entry[selectedRow[0]] : this.state.patientArray.entry[selectedRow[0]]);
    };

    render() {
        return (
            <div>
                <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter} onRowSelection={this.handleToggle}>
                    <TableHeader displaySelectAll={this.state.showCheckboxes}>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Birth Date</TableHeaderColumn>
                            <TableHeaderColumn>Gender</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={this.state.deselectOnClickaway}
                               showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows}>
                        {this.props.items}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
