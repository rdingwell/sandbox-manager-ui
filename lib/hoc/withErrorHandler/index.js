import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent) => {
    class WithErrorHandler extends Component {
        componentDidMount () {
            !window.fhirClient && this.props.history.location.pathname !== "/after-auth" && this.props.history.push('/');
        }

        render () {
            return (
                <Aux>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }

    return withRouter(WithErrorHandler);
};

export default withErrorHandler;
