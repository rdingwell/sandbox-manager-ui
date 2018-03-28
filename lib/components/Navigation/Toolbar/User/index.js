import React, { Component } from 'react';
import './styles.less';

export default class User extends Component {
    constructor (props) {
        super(props);

        this.state = {
            user: null
        }
    }

    shouldComponentUpdate () {
        let user = JSON.parse(localStorage.getItem("oauthUser"));
        if (user != null) {
            if (!this.state.user || this.state.user.name !== user.name) {
                this.setState({ user: user });
                return true;
            }
        }
        return false;
    }

    render () {
        let onClick = this.handleSignIn.bind(this);
        let buttonText = [<i key={1} className="fa fa-sign-in" />, <span key={2}> Sign In</span>];
        if (this.state.user) {
            onClick = this.handleDropDown.bind(this);
            buttonText = this.state.user.name;
        }

        return <div className="user-wrapper">
            <div>
                <a><span /></a>
            </div>
            <div className='right'>
                <a onClick={() => onClick()}>{buttonText}</a>
            </div>
            <div className='left'><a><i className="fa fa-th fa-lg" /></a></div>
        </div>;
    };

    handleSignIn () {
        let url = this.props.location;
        this.props.onAuthInit(url);
    };

    handleDropDown () {

    };
}
