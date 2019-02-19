import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from "material-ui/styles/muiThemeable";
import Validate from './Validation';
import Profiles from './Profiles';

import './styles.less';

class DataManager extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'profiles'
        };
    }

    componentDidMount () {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    render () {
        return <div className='profiles-wrapper page-content-wrapper'>
            <Tabs className='profile-tabs' contentContainerClassName='profiles-tabs-container' inkBarStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color }}>
                <Tab label="Profiles" className={'profiles tab' + (this.state.activeTab === 'profiles' ? ' active' : '')} onActive={() => this.setActiveTab('profiles')}>
                    <Profiles profiles={this.props.profiles} palette={this.props.muiTheme.palette}/>
                </Tab>
                <Tab label="Validate" className={'validate tab' + (this.state.activeTab === 'validate' ? ' active' : '')} onActive={() => this.setActiveTab('validate')}>
                    <Validate muiTheme={this.props.muiTheme} validate={this.props.validate} validateExisting={this.props.validateExisting} results={this.props.validationResults}
                              cleanValidationResults={this.props.cleanValidationResults}/>
                </Tab>
            </Tabs>
        </div>;
    }

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };
}

const mapStateToProps = state => {

    return {
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        executing: state.fhir.executing,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, validate, validateExisting,
    cleanValidationResults
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DataManager)));
