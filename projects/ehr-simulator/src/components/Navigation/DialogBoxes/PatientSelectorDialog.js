import React from 'react';
import SearchIcon from 'react-icons/lib/md/search';
// import Pagination from 'material-ui-pagination';
import {Dialog, TableRow, TableRowColumn, TextField} from "material-ui";
import moment from "moment";

import PatientTable from "../../Patient/PatientTable";
import {getPatientName} from "../../../utils";

const PATIENT_PICKER_STYLE = {
    float: 'right',
    padding: '18px 5px 5px 5px',
    cursor: 'pointer',
    fontSize: '20px'
};
const SEARCH_ICON_STYLE = {
    height: '40px',
    width: '40px',
    paddingBottom: '10px',
    paddingLeft: '3px',
    paddingRight: '10px'
};
const STRINGS = {
    selectedPatientName: "Select Patient",
    title: "Select a Patient",
    nameFilter: "Filter by name"
};

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class PatientSelectorDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPatient: null,
            selectedPatientName: STRINGS.selectedPatientName,
            total: 1,
            display: 1,
            number: 1,
            nameFilter: ""
        };
    }

    componentWillMount() {
        this.search();
    }

    render() {
        // const actions = [<Pagination total={this.state.total} current={this.state.number} display={this.state.display} onChange={number => this.handlePageChange(number)}/>];
        const actions = undefined;

        return (
            <div>
                <Dialog title={STRINGS.title} actions={actions} modal={false} open={this.props.open} onRequestClose={this.toggle}>
                    <TextField floatingLabelText={STRINGS.nameFilter} onChange={(_e, nameFilter) => this.setState({nameFilter}, this.search.bind(this))}/>
                    <PatientTable
                        setupPagination={this.setupPagination}
                        refApi={this.props.refApi}
                        handleSelectedPatient={this.handleSelectedPatient}
                        sandboxId={this.props.sandboxId}
                        sandboxApi={this.props.sandboxApi}
                        bearer={this.props.bearer}
                        items={this.state.items}
                        patientArray={this.state.patientArray}
                    />
                </Dialog>
            </div>
        );
    }

    search(nameFilter = this.state.nameFilter) {
        let token = this.props.bearer;
        let url = `${window.location.protocol}//${this.props.refApi}/${this.props.sandboxId}/data/Patient?_sort:asc=family&_sort:asc=given&name=${nameFilter}&_count=50`;

        fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json;charset=UTF-8', 'Authorization': `Bearer ${token}`}})
            .then(response => response.json())
            .then((responseData) => {
                const listItems = responseData.entry.map((d) =>
                    <TableRow key={d.resource.id} className="patient-table-row">
                        <TableRowColumn>{getPatientName(d.resource)}</TableRowColumn>
                        <TableRowColumn>{(moment(d.resource.birthDate)).format("DD MMM YYYY")}</TableRowColumn>
                        <TableRowColumn>{d.resource.gender}</TableRowColumn>
                    </TableRow>
                );
                this.setState({items: listItems});
                this.setState({patientArray: responseData});
                this.setupPagination(responseData);
            })
            .catch(e => {
                console.log(e);
            });
    }

    toggle = () => {
        this.props.onClose && this.props.onClose();
    };

    handleSelectedPatient = (doc) => {
        this.setState({selectedPatient: doc});
        this.setState({selectedPatientName: doc.resource.name[0].family});
        this.props.handlePatientSelection(doc);
        this.toggle();

    };

    handlePageChange(pageNumber) {
        this.setState({number: pageNumber});
        let url = this.state.pageUrls[pageNumber - 1];
        if (pageNumber === 1) {
            url = `${window.location.protocol}//${this.props.refApi}/${this.props.sandboxId}/data/Patient?_sort:asc=family&_sort:asc=given&name=&_count=50`;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.props.bearer}`
            }
        })
            .then(response => response.json())
            .then((responseData) => {
                const listItems = responseData.entry.map((d) =>
                    <TableRow key={d.resource.id}>
                        <TableRowColumn>{d.resource.name[0].family}</TableRowColumn>
                        <TableRowColumn>{d.resource.birthDate}</TableRowColumn>
                        <TableRowColumn>{d.resource.gender}</TableRowColumn>
                    </TableRow>
                );
                this.setState({items: listItems});
                this.setState({patientArray: responseData});
                console.log(responseData);
            }).catch(function () {
            console.log("error");
        });
    };

    setupPagination = (results) => {
        let totalPages = results.total / 50;
        totalPages = Math.ceil(totalPages);
        this.setState({total: totalPages});
        this.setState({display: totalPages});
        let pageUrls = [];
        for (let i = 0; i < results.link.length; i++) {
            pageUrls[i] = results.link[i].url
        }
        this.setState({pageUrls: pageUrls})
    };
}
