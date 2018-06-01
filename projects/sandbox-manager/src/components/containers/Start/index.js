import React, { Component } from 'react';
import { init } from '../../../redux/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import './styles.less';

class Start extends Component {
    render () {
        return <div>

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
