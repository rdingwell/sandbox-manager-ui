import React, {Component} from 'react';
import {Tabs, Tab} from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {app_setScreen, loadRelativeProfiles, loadResource, loadProfiles, validate, validateExisting, loadProfilesBySD} from '../../../redux/action-creators';
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
    }

    render() {
        return <div className='tools page-content-wrapper'>
            <Tabs className='tools-tabs' value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})}>
                <Tab label='Validation' id='validation' value='validation'/>
                <Tab label='Other tools' id='tools' value='tools'/>
            </Tabs>
            {this.state.activeTab === 'tools' && <ThirdPartyTools/>}
            {this.state.activeTab === 'validation' && <Validation {...this.props}/>}
        </div>
    }
}

const mapStateToProps = state => {
    return {
        profiles: state.fhir.profilesByDefinition,
        profilesLoading: state.fhir.profilesLoading,
        validationExecuting: state.fhir.validationExecuting,
        validationResults: state.fhir.validationResults,
        loadProfilesBySD: state.fhir.loadProfilesBySD,
        fetchingProfilesByDefinition: state.fhir.fetchingProfilesByDefinition
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({app_setScreen, loadRelativeProfiles, loadResource, loadProfiles, validateExisting, validate, loadProfilesBySD}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Tools));
