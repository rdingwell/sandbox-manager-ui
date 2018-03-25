import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import Strings from '../../../../externals/strings/start';

import './styles.less';

class Start extends Component {
    constructor (props) {
        super(props);

        this.state = Strings[props.language];
    }

    render () {
        let checkboxes = this.state.checkboxes.map((checkbox, index) => (
            <p key={index}><i className="fa fa-check" aria-hidden="true"> </i>{checkbox}</p>
        ));
        let buttons = !this.props.skipLogin
            ? <div>
                <RaisedButton label="Sign In" className="paper-button" primary={true} onClick={this.handleSignIn} />
                <RaisedButton label="Sign Up" className="paper-button" primary={true} onClick={this.handleSignUp} />
            </div>
            : null;

        return <Paper className="paper-card">
            <h3>{this.state.title}</h3>
            <div className="paper-body">
                <p>{this.state.description}</p>
                {checkboxes}
                <p>{this.state.note}</p>
                {buttons}
            </div>
        </Paper>;
    };

    handleSignIn = () => {
        this.props.onAuthInit();
    };

    handleSignUp = () => {
        let settings = JSON.parse(localStorage.getItem('config'));
        window.location.href = settings.userManagementUrl + "/public/newuser/?afterAuth=" + settings.sandboxManagerUrl;
    };
}

const mapStateToProps = state => {
    return {
        selectedSandbox: state.sandbox.selectedSandbox,
        language: state.config.xsettings.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthInit: () => dispatch(actions.init())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Start));
