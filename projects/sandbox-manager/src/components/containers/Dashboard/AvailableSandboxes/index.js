import React, { Component } from 'react';
import { Paper, RaisedButton, CircularProgress } from 'material-ui';
import { fetchSandboxes, selectSandbox } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from '../../../../../../../lib/hoc/withErrorHandler';
import { withRouter } from 'react-router';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import './styles.less';

class Index extends Component {

    componentDidMount () {
        this.fetchSandboxes();
    }

    componentDidUpdate (prevProps) {
        !this.props.creatingSandbox && prevProps.creatingSandbox && window.fhirClient && this.props.fetchSandboxes();
    }

    render () {
        let sandboxes = null;
        if (!this.props.loading) {
            sandboxes = this.props.sandboxes.map(sandbox => (
                <TableRow key={sandbox.id} hoverable>
                    <TableRowColumn>
                        {sandbox.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        {sandbox.description}
                    </TableRowColumn>
                </TableRow>
            ));

        }

        return <Paper className='sandboxes-wrapper paper-card'>
            <h3>My Sandboxes
                <RaisedButton className='create-sandbox-button' label='Create New Sandbox' onClick={this.handleCreate} labelColor='#fff' />
            </h3>
            <div className='paper-body'>
                <Table selectable={false} wrapperStyle={{ width: '100%' }} fixedHeader onCellClick={this.handleRowSelect}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Sandbox Name</TableHeaderColumn>
                            <TableHeaderColumn>Description</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows showRowHover>
                        {sandboxes}
                    </TableBody>
                </Table>
            </div>
        </Paper>;
    }

    handleCreate = () => {
        this.props.onToggleModal && this.props.onToggleModal();
    };

    handleRowSelect = (row) => {
        let sandbox = this.props.sandboxes[row];
        localStorage.setItem('sandboxId', sandbox.sandboxId);
        this.props.selectSandbox(sandbox);
    };

    fetchSandboxes () {
        window.fhirClient && this.props.fetchSandboxes();
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
    return bindActionCreators({ fetchSandboxes, selectSandbox }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index)));
