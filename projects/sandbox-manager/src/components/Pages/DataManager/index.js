import React, {Component} from 'react';
import {Tabs, Tab, withTheme} from '@material-ui/core';
import * as QueryString from 'query-string';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, doLaunch, getMetadata
} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import QueryBrowser from './QueryBrowser';
import Import from "./Import";
import Export from './Export';

import './styles.less';

class DataManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'browser'
        };
    }

    componentDidMount() {
        this.props.app_setScreen('data-manager');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.getMetadata(false);
    }

    render() {
        let query = QueryString.parse(this.props.history.location.search);

        return <div className='data-manager-wrapper page-content-wrapper' data-qa='data-manager-wrapper'>
            <Tabs className='data-tabs' value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})}>
                <Tab label="Browser" id='browser' value='browser'/>
                <Tab label="Import" id='import' value='import'/>
                <Tab label="Export" id='export' value='export'/>
            </Tabs>
            <div className='data-tabs-container'>
                {this.state.activeTab === 'browser' && <div className={'query-browser tab' + (this.state.activeTab === 'browser' ? ' active' : '')}>
                    <QueryBrowser search={this.search} results={this.props.results} clearResults={this.props.fhir_setCustomSearchResults} theme={this.props.theme} executing={this.props.executing}
                                  next={this.next} gettingNextPage={this.props.gettingNextPage} query={query} patientDataManagerUrl={this.props.patientDataManagerUrl} doLaunch={this.props.doLaunch}
                                  metadata={this.props.metadata}/>
                </div>}
                {this.state.activeTab === 'import' && <div className={'import tab' + (this.state.activeTab === 'import' ? ' active' : '')}>
                    <Import importData={this.props.importData} results={this.props.importResults} clearResults={this.props.clearResults} theme={this.props.theme}
                            dataImporting={this.props.dataImporting}/>
                </div>}
                {this.state.activeTab === 'export' && <div className={'export tab' + (this.state.activeTab === 'export' ? ' active' : '')}>
                    <Export clearResults={this.props.clearResults} theme={this.props.theme} dataImporting={this.props.dataImporting}
                            export={this.props.loadExportResources} cancelDownload={this.props.cancelDownload} exportStatus={this.props.exportStatus} resetResults={this.props.resetResults}/>
                </div>}
            </div>
        </div>;
    }

    search = (query) => {
        this.props.customSearch(query);
    };

    next = (link) => {
        this.props.customSearchNextPage(link);
    }
}

const mapStateToProps = state => {

    let patientDataManagerUrl = state.config.xsettings.data.sandboxManager
        ? state.config.xsettings.data.sandboxManager.patientDataManager
        : '';

    return {
        patientDataManagerUrl,
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        executing: state.fhir.executing,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles,
        metadata: state.fhir.metadata || {}
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, doLaunch, getMetadata
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(DataManager)));
