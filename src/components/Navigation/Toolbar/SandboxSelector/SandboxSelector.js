import React, { Component } from 'react';
import * as  actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../../axiox';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';



class SandboxSelector extends Component {
    state = {
        value: 'Sandboxes'
    };


    handleChange = (event, index, value) => {
        this.setState({value});
        if(this.state.value !== 'Sandboxes' && this.state.value !== 'CreateNew'){
            this.props.selectSandbox(this.state.value);
        }
    };

    render () {
        const sandboxes = this.props.sandboxes.map( (sandbox) => {
            return (
                <MenuItem key={sandbox.id} value={sandbox.sandboxId} primaryText={sandbox.name}/>
            )});

        return(
            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                <MenuItem value="Sandboxes" primaryText="Sandboxes"/>
                {sandboxes}
                <MenuItem value="CreateNew" primaryText="Create New Sandbox"/>
            </DropDownMenu>

        );
    }
}

const mapStateToProps = state => {
    return {
        sandboxes : state.sandbox.sandboxes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectSandbox: (sandboxId) => dispatch( actions.selectSandbox(sandboxId) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( SandboxSelector, axios ) );
