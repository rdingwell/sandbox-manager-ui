import React, {Component} from 'react';
import SandboxDetails from './SandboxDetails/SandboxDetails';
import SandboxReset from './SandboxReset/SandboxReset';
import DeleteSandbox from './DeleteSandbox/DeleteSandbox';
import * as  actions from '../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


import axios from '../../axiox';

class Settings extends Component {

    componentWillMount () {
        this.props.selectSandbox("sandbox1");
    }


    render() {
        return (
            <div>
                <SandboxDetails sandbox={this.props.sandbox} />
                <SandboxReset sandbox={this.props.sandbox} />
                <DeleteSandbox sandbox={this.props.sandbox}/>
            </div>
        )
    };
}


const mapStateToProps = state => {

    return {
        sandbox : state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[0]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectSandbox: (sandboxId) => dispatch( actions.selectSandbox(sandboxId) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Settings, axios ) );
