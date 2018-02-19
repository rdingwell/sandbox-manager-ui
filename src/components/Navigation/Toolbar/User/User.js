import React, { Component } from 'react';

import * as  actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import { withRouter } from 'react-router';



import axios from '../../../../axios';


class User extends Component {

    state = {
        user: null
    };

    shouldComponentUpdate(){
        let user = JSON.parse(localStorage.getItem("oauthUser"));
        if (user != null){
            if(this.state.user === null || this.state.user.name !== user.name){
                this.setState({user: user});
                return true;
            }
        } else {
            return false;
        }
        return false;
    }

    handleSignIn = () => {
        let url = this.props.location;
        this.props.onAuthInit(url);
    };

    handleDropDown = () => {

    };

    render() {
        const rightWrapper = {
          position: 'absolute',
          right: '0'
        };

        const right = {
          float: 'right',
          margin: 10,
        }

        const left={
            float: 'left',
            margin: 10
        };

        let user = (<a onClick={() => this.handleSignIn()}><i className="fa fa-sign-in"></i> Sign In</a>);
        if(this.state.user){
            user = (<a onClick={() => this.handleDropDown()}>{this.state.user.name}</a>);
        }
        return(
            <div style={rightWrapper}>
                <div>
                    <a><span></span></a>
                </div>
                <div style={right}>
                    {user}
                </div>
                <div style={left}><a><i className="fa fa-th fa-lg"></i></a></div>
            </div>
        );
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthInit: (url) => dispatch( actions.init(url) )
    };
};

export default connect( null, mapDispatchToProps )( withRouter(withErrorHandler( User, axios ) ))





