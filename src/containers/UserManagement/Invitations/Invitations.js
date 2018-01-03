import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


import { connect } from 'react-redux';

class Invitations extends Component {



    render() {
        const resendStyle = {
            margin: 10
        }

        let rows = this.props.pendingUsers.map( pendingUser => (
            <TableRow>
                <TableRowColumn>
                    {pendingUser.status}
                </TableRowColumn>
                <TableRowColumn>
                    {pendingUser.invitee.email}
                </TableRowColumn>
                <TableRowColumn>
                    <RaisedButton label="Resend" style={resendStyle} primary={true}/>
                    <RaisedButton label="Revoke" style={resendStyle} secondary={true}/>

                </TableRowColumn>
            </TableRow>
        ) );



        return(
            <Paper className="PaperCard">
                <h3>Invitations</h3>
                <div className="PaperBody">
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false}
                                     enableSelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>Status</TableHeaderColumn>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                                <TableHeaderColumn></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {rows}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }

}


const mapStateToProps = state => {
    return {
        pendingUsers : state.user.pendingUsers
    }
}


export default connect(mapStateToProps)(Invitations);