import React, { Component } from 'react';
import Invitations from './Invitations';
import Users from './Users';
import { Tab, Tabs } from "material-ui";

import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles.less';

class UserManagement extends Component {

    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'user'
        };
    }

    componentDidMount () {
        this.props.app_setScreen('user-management');
    }

    render () {
        return <div className='user-management-wrapper'>
            <Tabs className='user-tabs' contentContainerClassName='user-tabs-container'>
                <Tab label="Users" className={'users-tab tab' + (this.state.activeTab === 'user' ? ' active' : '')} onActive={() => this.setActiveTab('user')}>
                    <Users />
                </Tab>
                <Tab label="Invitations" className={'invitations-tab tab' + (this.state.activeTab === 'invite' ? ' active' : '')} onActive={() => this.setActiveTab('invite')}>
                    <Invitations />
                </Tab>
            </Tabs>
        </div>;
    }

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
    };
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
