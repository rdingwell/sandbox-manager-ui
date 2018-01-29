import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import axios from '../../../axiox';

class SandboxInvites extends Component{

    componentDidMount() {
        this.props.onFetchSandboxInvitations();
    }

    handleAccept = () => {

    };

    handleReject = () => {

    };


    render() {
        const buttonStyle = {
            margin: 10
        };

        let inviteTable = <div>Loading...</div>;


        let invitations = <div>Loading...</div>;
        if(!this.props.loading){
            if(this.props.invitations.length === 0){
                inviteTable = (
                    <div>
                        <Paper className="PaperCard">
                        You do not have any sandbox invitations
                        </Paper>
                    </div>);
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
                            <RaisedButton
                                backgroundColor='#0186d5'
                                label="Accept"
                                style={buttonStyle}
                                onClick={this.handleAccept}
                                labelColor='#fff'
                            />
                            <RaisedButton
                                backgroundColor='#fe824c'
                                label="Reject"
                                style={buttonStyle}
                                onClick={this.handleReject}
                                labelColor='#fff'
                            />
                        </TableRowColumn>
                    </TableRow>
                ));
                inviteTable = (
                        <Paper className="PaperCard">
                            <h3>Sandbox Invitations</h3>
                            <div className="PaperBody">
                                <Table>
                                    <TableHeader displaySelectAll={false}
                                                 adjustForCheckbox={false}
                                                 enableSelectAll={false}>
                                        <TableRow>
                                            <TableHeaderColumn>Invited By</TableHeaderColumn>
                                            <TableHeaderColumn>Sandbox Name</TableHeaderColumn>
                                            <TableHeaderColumn></TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false}>
                                        {invitations}
                                    </TableBody>
                                </Table>
                            </div>
                        </Paper>
                );
            }
        }


        return(
            <div>
                {inviteTable}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        invitations: state.sandbox.invitations,
        loading: state.sandbox.invitesLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchSandboxInvitations: () => dispatch(actions.fetchSandboxInvites())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(SandboxInvites, axios));