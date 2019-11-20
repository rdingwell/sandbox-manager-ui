import React, {Component} from 'react';
import {Tabs, Tab} from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {app_setScreen, loadRelativeProfiles, loadResource, loadProfiles, validate, validateExisting, loadProfilesBySD, loadQueryObject, getDefaultUserForSandbox} from '../../../redux/action-creators';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import ThirdPartyTools from "./ThirdPartyTools";
import Validation from "./Validation";

import './styles.less';

class Tools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'validation'
        };
    }

    componentDidMount() {
        this.props.app_setScreen('tools');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    render() {
        return <div className='tools page-content-wrapper'>
            <Tabs className='tools-tabs' value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})}>
                <Tab label='Validation' id='validation' value='validation'/>
                <Tab label='Other tools' id='tools' value='tools'/>
            </Tabs>
            {this.state.activeTab === 'tools' && <ThirdPartyTools serviceUrl={this.props.serviceUrl} isOpen={this.props.isOpen} name={this.props.sandboxName}/>}
            {this.state.activeTab === 'validation' && <Validation {...this.props}/>}
        </div>
    }
}

const mapStateToProps = state => {
    let sandbox = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
    let isOpen = sandbox ? !!sandbox.allowOpenAccess : false;
    return {
        isOpen,
        sandboxName: sandbox.name,
        profiles: state.fhir.profilesByDefinition,
        profilesLoading: state.fhir.profilesLoading,
        validationExecuting: state.fhir.validationExecuting,
        validationResults: state.fhir.validationResults,
        loadProfilesBySD: state.fhir.loadProfilesBySD,
        queryObject: state.fhir.queryObject,
        fetchingProfilesByDefinition: state.fhir.fetchingProfilesByDefinition,
        serviceUrl: state.fhir.smart.data.server && state.fhir.smart.data.server.serviceUrl
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, loadRelativeProfiles, loadResource, loadProfiles, validateExisting, validate, loadProfilesBySD, loadQueryObject,
    getDefaultUserForSandbox
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Tools));
