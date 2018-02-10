import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


import axios from '../../axiox';

class AfterAuth extends Component {

    componentDidMount() {
        let url = this.props.location;
        this.props.afterAuth(url);
        if(this.props.user.sbmUserId){
            this.props.history.push("/dashboard");
        }
    }

    componentDidUpdate(){
        if(this.props.user.sbmUserId){
            this.props.history.push("/dashboard");
        }
    }

    render(){
        return(
            <div></div>
        )
    }
}

const mapStateToProps = state => {
    return{
        user: state.user.oauthUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        afterAuth: (url) => dispatch( actions.afterFhirAuth(url) )
    };
};


export default connect(mapStateToProps, mapDispatchToProps )( withErrorHandler( AfterAuth, axios ) )
