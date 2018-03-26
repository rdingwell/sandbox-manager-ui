import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import strings from '../../../../externals/strings/start';

import './styles.less';

class Start extends Component {
    render () {
        let language = this.props.language;

        let checkboxes = strings[language].checkboxes.map((checkbox, index) => (
            <p key={index}><i className="fa fa-check" aria-hidden="true"> </i>{checkbox}</p>
        ));
        let buttons = !this.props.skipLogin
            ? <div>
                <RaisedButton label={strings[language].signInLabel} className="paper-button" primary={true} onClick={this.handleSignIn.bind(this)} />
                <RaisedButton label={strings[language].signUpLabel} className="paper-button" primary={true} onClick={this.handleSignUp.bind(this)} />
            </div>
            : null;

        return <Paper className="paper-card">
            <h3>{strings[language].title}</h3>
            <div className="paper-body">
                <p>{strings[language].description}</p>
                {checkboxes}
                <p>{strings[language].note}</p>
                {buttons}
            </div>
        </Paper>;
    };

    handleSignIn () {
        this.props.onAuthInit();
    };

    handleSignUp () {
        window.location.href = this.props.settings.sandboxManager.userManagementUrl + "/public/newuser/?afterAuth=" + this.props.settings.sandboxManager.sandboxManagerUrl;
    };
}

const mapStateToProps = state => {
    return {
        selectedSandbox: state.sandbox.selectedSandbox,
        settings: state.config.xsettings.data,
        language: state.config.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthInit: () => dispatch(actions.init())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Start));
