import React, { Component } from 'react';
import { Button, Paper } from '@material-ui/core';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from '@material-ui/core';
import { fetchSandboxInvites } from '../../../../redux/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withErrorHandler from '../../../UI/hoc/withErrorHandler';
import './styles.less';

class SandboxInvites extends Component {

    componentDidMount () {
        this.props.fetchSandboxInvites();
    }

    render () {
        let inviteTable = <div>Loading...</div>;
        let invitations = <div>Loading...</div>;
        if (!this.props.loading) {
            if (this.props.invitations.length === 0) {
                inviteTable = <div>
                    <Paper className='paper-card'>
                        You do not have any sandbox invitations
                    </Paper>
                </div>
            } else {
                invitations = this.props.invitations.map(invite => (
                    <TableRow key={invite.id}>
                        <TableRowColumn>
                            {invite.invitedBy.name}
                        </TableRowColumn>
                        <TableRowColumn>
                            {invite.sandbox.name}
                        </TableRowColumn>
                        <TableRowColumn>
                            <Button variant='contained' backgroundColor='#0186d5' label='Accept' className='button' onClick={this.handleAccept} labelColor='#fff' />
                            <Button variant='contained' backgroundColor='#fe824c' label='Reject' className='button' onClick={this.handleReject} labelColor='#fff' />
                        </TableRowColumn>
                    </TableRow>
                ));
                inviteTable = <Paper className='paper-card'>
                    <h3>Sandbox Invitations</h3>
                    <div className='paper-body'>
                        <Table>
                            <TableHeader displaySelectAll={false}
                                         adjustForCheckbox={false}
                                         enableSelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn>Invited By</TableHeaderColumn>
                                    <TableHeaderColumn>Sandbox Name</TableHeaderColumn>
                                    <TableHeaderColumn />
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {invitations}
                            </TableBody>
                        </Table>
                    </div>
                </Paper>
            }
        }


        return <div className='sandbox-invites-wrapper'>
            {inviteTable}
        </div>
    }

    handleAccept = () => {

    };

    handleReject = () => {

    };
}

const mapStateToProps = state => {
    return {
        invitations: state.sandbox.invitations,
        loading: state.sandbox.invitesLoading
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ fetchSandboxInvites }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(SandboxInvites));
