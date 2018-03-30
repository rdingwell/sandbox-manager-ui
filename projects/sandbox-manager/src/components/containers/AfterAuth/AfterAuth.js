import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

class AfterAuth extends Component {

    componentDidMount () {
        // let call = () => {
        //     if (this.props.config) {
        //         console.log('try');
        //         if (this.props.user.sbmUserId) {
        //             this.props.history.push("/dashboard");
        //         } else {
        //             setTimeout(call, 1000);
        //         }
        //     } else {
        //         setTimeout(call, 1000);
        //     }
        // };
        //
        // call();
        let url = this.props.location;
        this.props.afterFhirAuth(url);
    }

    componentDidUpdate () {
        this.props.user.sbmUserId && this.props.history.push("/dashboard");
    }

    render () {
        return (
            <div />
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        config: state.config.xsettings.data.sandboxManager
    };
};

const mapDispatchToProps = dispatch => {
    return {
        afterFhirAuth: (url) => dispatch(actions.afterFhirAuth(url))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(AfterAuth))
