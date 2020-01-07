import React, { Component } from 'react';
import { afterFhirAuth } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import { bindActionCreators } from 'redux';

class AfterAuth extends Component {

    componentDidMount () {
        let url = this.props.location;
        setTimeout(() => {
            this.props.afterFhirAuth(url);
        }, 5000);
    }

    componentDidUpdate () {
        this.props.user.sbmUserId && this.props.history.push('/dashboard');
    }

    render () {
        return <div />
    }
}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        config: state.config.xsettings.data.sandboxManager
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ afterFhirAuth }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(AfterAuth))
