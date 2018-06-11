import React, { Component } from 'react';
import Invitations from './Invitations';
import Users from './Users';
import { Tab, Tabs } from "material-ui";

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
            <Tabs className='user-tabs' contentContainerClassName='user-tabs-container'>
                <Tab label="Users" className='users-tab'>
                    <Users />
                </Tab>
                <Tab label="Invitations">
                    <Invitations />
                </Tab>
            </Tabs>
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
