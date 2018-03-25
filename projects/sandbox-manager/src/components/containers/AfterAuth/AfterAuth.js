import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

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
        user: state.users.oauthUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        afterAuth: (url) => dispatch( actions.afterFhirAuth(url) )
    };
};


export default connect(mapStateToProps, mapDispatchToProps )( withErrorHandler( AfterAuth ) )
