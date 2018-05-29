import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import "./Persona.css";

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class PersonaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: true,
            selectable: true,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            height: '300px',
            personaItems: [],
            items: [],
            bearer: this.props.bearer,
            sandboxApi: this.props.sandboxApi,
            sandboxId: this.props.sandboxId,
        };
    }

    handleToggle = (selectedRow) => {
        this.props.handleSelectedDoc && this.props.handleSelectedDoc(this.state.personaArray[selectedRow[0]]);
        this.props.close && this.props.close();
    };


    componentWillMount() {
        let token = this.state.bearer;
        let url = `${window.location.protocol}//${this.state.sandboxApi}/userPersona?sandboxId=${this.state.sandboxId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then((responseData) => {
                var trimmedList = responseData.filter(function (rd) {
                    return (rd.resourceUrl.includes("Practitioner"));
                });
                const listItems = trimmedList.map((d) =>
                    <TableRow key={d.id} className="persona-table-row">
                        <TableRowColumn>{d.personaName}</TableRowColumn>
                        <TableRowColumn>{d.personaUserId}</TableRowColumn>
                        <TableRowColumn>{d.resourceUrl}</TableRowColumn>
                    </TableRow>
                );
                this.setState({personaItems: listItems});
                this.setState({personaArray: trimmedList});

            })

    }

    render() {
        return (
            <div>
                <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter} onRowSelection={this.handleToggle}>
                    <TableHeader displaySelectAll={this.state.showCheckboxes}>
                        <TableRow>
                            <TableHeaderColumn tooltip="Display Name">Display Name</TableHeaderColumn>
                            <TableHeaderColumn tooltip="User Id">User Id</TableHeaderColumn>
                            <TableHeaderColumn tooltip="FHIR Resource">FHIR Resource</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={this.state.deselectOnClickaway}
                               showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows}>
                        {this.state.personaItems}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
