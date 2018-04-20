import React, { Component } from 'react';
import Invitations from './Invitations';
import Users from './Users';

import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles.less';

class UserManagement extends Component {

    componentDidMount () {
        this.props.app_setScreen('user-management');
    }

    render () {
        return <div className='user-management-wrapper'>
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

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ app_setScreen }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
