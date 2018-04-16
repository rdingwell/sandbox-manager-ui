import React, { Component } from 'react';
import { Paper, RaisedButton, CircularProgress } from 'material-ui';
import * as  actions from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import { withRouter } from 'react-router';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import './styles.less';

class Index extends Component {

    componentDidMount () {
        this.fetchSandboxes();
    }

    componentDidUpdate (prevProps) {
        !this.props.creatingSandbox && prevProps.creatingSandbox && window.fhirClient && this.props.onFetchSandboxes();
    }

    render () {
        let sandboxes = null;
        if (!this.props.loading) {
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

        return <Paper className="sandboxes-wrapper paper-card">
            <h3>My Sandboxes
                <RaisedButton className="create-sandbox-button" label='Create New Sandbox' onClick={this.handleCreate} labelColor='#fff' />
            </h3>
            <div className="paper-body">
                {!this.props.creatingSandbox && <Table selectable={false} wrapperStyle={{ width: "100%" }} fixedHeader={true} onCellClick={this.handleRowSelect}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Sandbox Name</TableHeaderColumn>
                            <TableHeaderColumn>Description</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true}>
                        {sandboxes}
                    </TableBody>
                </Table>}
                {this.props.creatingSandbox && <div className="loader-wrapper"><CircularProgress size={80} thickness={5} /></div>}
            </div>
        </Paper>;
    }

    handleCreate = () => {
        // this.props.history.push("/create-sandbox");
        this.props.onToggleModal && this.props.onToggleModal();
    };

    handleRowSelect = (row) => {
        let sandbox = this.props.sandboxes[row];
        localStorage.setItem('sandboxId', sandbox.sandboxId);
        this.props.onSelectSandbox(sandbox.sandboxId);
    };

    fetchSandboxes () {
        window.fhirClient && this.props.onFetchSandboxes();
    }
}

const mapStateToProps = state => {
    return {
        sandboxes: state.sandbox.sandboxes,
        loading: state.sandbox.loading,
        creatingSandbox: state.sandbox.creatingSandbox
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchSandboxes: () => dispatch(actions.fetchSandboxes()),
        onSelectSandbox: (sandboxId) => dispatch(actions.selectSandbox(sandboxId))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index)));
