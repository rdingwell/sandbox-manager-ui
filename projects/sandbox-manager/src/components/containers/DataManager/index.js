import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage }
    from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QueryBrowser from './QueryBrowser';
import Import from "./Import";
import Export from './Export';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

class DataManager extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'browser'
        };
    }

    componentDidMount () {
        this.props.app_setScreen('data-manager');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    render () {
        return <div className='data-manager-wrapper page-content-wrapper'>
            <Tabs className='data-tabs' contentContainerClassName='data-tabs-container' inkBarStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color }}>
                <Tab label="Browser" className={'query-browser tab' + (this.state.activeTab === 'browser' ? ' active' : '')} onActive={() => this.setActiveTab('browser')}>
                    <QueryBrowser search={this.search} results={this.props.results} clearResults={this.props.fhir_setCustomSearchResults} muiTheme={this.props.muiTheme}
                                  executing={this.props.executing} next={this.next} gettingNextPage={this.props.gettingNextPage}/>
                </Tab>
                <Tab label="Import" className={'import tab' + (this.state.activeTab === 'import' ? ' active' : '')} onActive={() => this.setActiveTab('import')}>
                    <Import importData={this.props.importData} results={this.props.importResults} clearResults={this.props.clearResults} muiTheme={this.props.muiTheme}
                            dataImporting={this.props.dataImporting}/>
                </Tab>
                <Tab label="Export" className={'export tab' + (this.state.activeTab === 'export' ? ' active' : '')} onActive={() => this.setActiveTab('export')}>
                    <div>
                        <Export clearResults={this.props.clearResults} muiTheme={this.props.muiTheme} dataImporting={this.props.dataImporting}
                                export={this.props.loadExportResources} cancelDownload={this.props.cancelDownload} exportStatus={this.props.exportStatus} resetResults={this.props.resetResults}/>
                    </div>
                </Tab>
            </Tabs>
        </div>;
    }

    search = (query) => {
        this.props.customSearch(query);
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    next = (link) => {
        this.props.customSearchNextPage(link);
    }
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
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DataManager)));
