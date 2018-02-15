import React, { Component } from 'react';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../../axiox';
import * as  actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


class SandboxTitle extends Component {

    state = {
        onDashboard: false
    };

    shouldComponentUpdate(nextProps, nextState){
        let url = nextProps.location;
        if(url.pathname === '/dashboard'){
            this.setState({onDashboard: true});
        }

        return nextState.onDashboard !== this.state.onDashboard;
    }


    render() {
        const sandboxTitleStyle = {
            textAlign: 'center',
            margin: '0 auto',
            paddingTop: '0px',
            left: '50%',
            color:'#FFF',
            fontSize: '28px',
            fontWeight: 100,
            display: 'inline-block',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, 0)'
        };

        let title = "The Healthcare Innovation Ecosystem";

        if(this.state.onDashboard){
            title = "Dashboard";
        } else if(this.props.selectedSandbox) {
            title = this.props.sandbox.name;
        }

        return(
            <div style={sandboxTitleStyle}>{title}</div>
        );
    }
}

const mapStateToProps = state => {
    return {
        sandbox : state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[0],
        selectedSandbox : state.sandbox.selectedSandbox
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectSandbox: (sandboxId) => dispatch( actions.selectSandbox(sandboxId) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withRouter(withErrorHandler( SandboxTitle, axios ) ))