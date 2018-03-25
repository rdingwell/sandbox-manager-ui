import React, { Component } from 'react';
import Invitations from './Invitations/Invitations';
import Users from './Users/Users';

import { connect } from 'react-redux';

class UserManagement extends Component {

    render () {
        return <div>
            <Users />
            <Invitations />
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        user: state.users.user,
        rejectedUsers: state.users.rejectedUsers,
        sandboxUsers: state.users.sandboxUsers
    }
};

export default connect(mapStateToProps)(UserManagement);
