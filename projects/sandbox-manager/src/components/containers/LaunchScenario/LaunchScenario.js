import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

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
        user: state.users.oauthUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        afterAuth: (url) => dispatch( actions.afterFhirAuth(url) )
    };
};


export default connect(mapStateToProps, mapDispatchToProps )( withErrorHandler( LaunchScenario ) )
