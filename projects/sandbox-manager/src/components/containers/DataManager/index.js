import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { app_setScreen, customSearch } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QueryBrowser from './QueryBrowser';
import ExternalBrowser from "./ExternalBrowser";
import Import from "./Import";

import './styles.less';

class DataManager extends Component {
    componentDidMount () {
        this.props.app_setScreen('data-manager');
    }

    render () {
        return <div className='data-manager-wrapper'>
            <Tabs className='data-tabs' contentContainerClassName='data-tabs-container'>
                <Tab label="Query browser" className='query-browser-tab'>
                    <QueryBrowser search={this.search} results={this.props.results} />
                </Tab>
                <Tab label="External FHIR Data">
                    <ExternalBrowser />
                </Tab>
                <Tab label="Import">
                    <Import />
                </Tab>
                <Tab label="Export">
                    <div>
                        <h2>Tab Four</h2>
                    </div>
                </Tab>
            </Tabs>
        </div>;
    }

    search = (query) => {
        this.props.customSearch(query);
    }
}

const mapStateToProps = state => {

    return {
        results: state.fhir.customSearchResults
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, customSearch }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DataManager));
