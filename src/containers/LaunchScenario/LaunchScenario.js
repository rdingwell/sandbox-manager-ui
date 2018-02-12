import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axiox';



class LaunchScenario extends Component {
    componentDidMount() {
        let url = this.props.location;
        this.props.afterAuth(url);
        this.props.history.push("/launch");
    }

    render() {
        return(
            <div>
                Launch
            </div>
        );
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


export default connect(mapStateToProps, mapDispatchToProps )( withErrorHandler( LaunchScenario, axios ) )
