import React, { Component } from 'react';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../../axiox';
import * as  actions from '../../../../store/actions/index';
import { connect } from 'react-redux';



class SandboxTitle extends Component {
    render() {
        let title = "Dashboard";
        if(this.props.selectedSandbox){
            title = this.props.sandbox.name;
        }

        return(
            <div>{title}</div>
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


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( SandboxTitle, axios ) );