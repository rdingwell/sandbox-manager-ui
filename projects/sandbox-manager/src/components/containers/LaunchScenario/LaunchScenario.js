import React, { Component } from 'react';
import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

class LaunchScenario extends Component {
    componentDidMount() {
        this.props.app_setScreen('launch');
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
        app_setScreen: (screen) => dispatch( actions.app_setScreen(screen) )
    };
};


export default connect(mapStateToProps, mapDispatchToProps )( withErrorHandler( LaunchScenario ) )
