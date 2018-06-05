import React, { Component } from 'react';
import { init } from '../../../redux/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import './styles.less';

class Start extends Component {
    render () {
        return <div className='start-page-wrapper'>
            <img src='./img/hspc-sndbx-logo.png' />
            <CircularProgress />
            <div>
                <span>
                    Welcome to the HSPC Sandbox, <a href=''>click here</a> if you're not redirected to the login screen.
                </span>
            </div>
        </div>;
    }

    componentDidUpdate = () => {
        this.props.settings.env && this.props.onAuthInit();
    };
}

const mapStateToProps = state => {
    return {
        settings: state.config.xsettings.data
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ onAuthInit: init }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Start));
