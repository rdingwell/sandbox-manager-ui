import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';


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

    state = {
        open: false,
        email: ''
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSendInvite = () => {

    };

    handleInviteEmailChange = (event) => {
        this.setState({email : event.target.value});
    };


    render() {
        const resendStyle = {
            margin: 10
        };

        let rows = this.props.pendingUsers.map( pendingUser => (
            <TableRow>
                <TableRowColumn>{pendingUser.status}</TableRowColumn>
                <TableRowColumn>{pendingUser.invitee.email}</TableRowColumn>
                <TableRowColumn>
                    <RaisedButton label="Resend" style={resendStyle} primary={true}/>
                    <RaisedButton label="Revoke" style={resendStyle} secondary={true}/>
                </TableRowColumn>
            </TableRow>
        ) );

        const actions = [
            <RaisedButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Invite"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSendInvite}
            />,
        ];


        return(
            <Paper className="PaperCard">
                <h3>Invitations<RaisedButton onClick={this.handleOpen} label="Invite" style={{float: "right"}}/></h3>
                <Dialog
                    title="Invite New User"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        value={this.state.email}
                        floatingLabelText="Email Address of New User"
                        onChange={(event) => this.handleInviteEmailChange(event)}/>
                </Dialog>
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
        pendingUsers : state.users.pendingUsers
    }
}


export default connect(mapStateToProps)(Invitations);
