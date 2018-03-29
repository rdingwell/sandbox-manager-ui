import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

class AfterAuth extends Component {

    componentDidMount () {
        let int = 0;
        let call = () => {
            int++;
            console.log(`Tried ${int} times!`);
            if (this.props.config) {
                let url = this.props.location;
                this.props.afterAuth(url);
                console.log(this.props.user);
                if (this.props.user.sbmUserId) {
                    this.props.history.push("/dashboard");
                } else {
                    setTimeout(call, 1000);
                }
            } else {
                setTimeout(call, 1000);
            }
        };

        call();
    }

    componentDidUpdate () {
        if (this.props.user.sbmUserId) {
            this.props.history.push("/dashboard");
        }
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
        afterAuth: (url) => dispatch(actions.afterFhirAuth(url))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(AfterAuth))
