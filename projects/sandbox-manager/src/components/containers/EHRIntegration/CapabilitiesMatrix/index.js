import React, { Component } from 'react';
import { Paper } from 'material-ui';
import { app_setScreen } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { bindActionCreators } from 'redux';

const matrixLocation = 'http://docs.smarthealthit.org/fhir-support/';

class CapabilitiesMatrix extends Component {
    componentDidMount () {
        this.props.app_setScreen('integration');
    }

    render () {
        return <div>
            <h3>Capabilities Matrix</h3>
            <div>
                <p>SMART on FHIR EHR Capabilities Matrix</p>
                <p>
                    <span className='Answer'><a href={matrixLocation}>{matrixLocation}</a></span>
                </p>
            </div>
        </div>
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen }, dispatch);

export default connect(undefined, mapDispatchToProps)(withErrorHandler(CapabilitiesMatrix));
