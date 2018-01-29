import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { withRouter } from 'react-router';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import axios from '../../../axiox';



class AvailableSandboxes extends Component{

    componentDidMount () {
        this.props.onFetchSandboxes();
    }

    handleCreate = () => {
        this.props.history.push("/create-sandbox");
    };

    handleRowSelect = (rows) => {
        let sandbox = this.props.sandboxes.slice(rows, 1)[0];
        this.props.onSelectSandbox(sandbox.sandboxId);
        this.props.history.push("/launch")
    };

    render() {
        const buttonStyle = {
            float: 'right',
            marginBottom: 15
        };

        let sandboxes = null;
        if ( !this.props.loading ) {
            sandboxes = this.props.sandboxes.map(sandbox => (
                <TableRow key={sandbox.id}>
                    <TableRowColumn>
                        {sandbox.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        {sandbox.description}
                    </TableRowColumn>
                </TableRow>
            ));

        }
        return (
            <Paper className="PaperCard">
                <h3>My Sandboxes
                    <RaisedButton
                        style={buttonStyle}
                        backgroundColor='#0186d5'
                        label='Create New Sandbox'
                        onClick={this.handleCreate}
                        labelColor='#fff'
                    />
                </h3>
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
                            {sandboxes}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        sandboxes: state.sandbox.sandboxes,
        loading: state.sandbox.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchSandboxes: () => dispatch( actions.fetchSandboxes() ),
        onSelectSandbox: (sandboxId) => dispatch(actions.selectSandbox(sandboxId))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(AvailableSandboxes, axios)));