import React, {Component} from 'react';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError, loadProfileResources, loadResource, fetchDefinitionTypes,
    loadProfilesBySD, clearLoadedProfilesBySD
} from '../../../redux/action-creators';
import {withTheme} from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Manage from './Manage';
import Page from '../../UI/Page';
import HelpButton from '../../UI/HelpButton';

import './styles.less';

class Profiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'profiles'
        };
    }

    componentDidMount() {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.loadProfiles();

        // setTimeout(() => {
        //     let formData = new FormData();
        //     formData.append('client_endpoint_key', 'static');
        //     formData.append('module', 'onc_r4');
        //     formData.append('fhir_server', 'https://api-test.logicahealth.org/tssst/open');
        //     let request = new Request('https://inferno.healthit.gov/inferno/', {
        //         method: 'POST',
        //         redirect: 'manual',
        //         body: formData
        //     });
        //     fetch(request)
        //         .then(e => {
        //             console.log(e);
        //         })
        //         .catch(e => {
        //             console.log(e);
        //         })
        // }, 5000);
        //
        //
        // setTimeout(() => {
        //     let formData = new FormData();
        //     formData.append('server[url]', 'https://api-test.logicahealth.org/tssst/open');
        //     let request = new Request('https://projectcrucible.org/servers', {
        //         method: 'POST',
        //         redirect: 'manual',
        //         body: formData
        //     });
        //     fetch(request)
        //         .then(e => {
        //             console.log(e);
        //         })
        //         .catch(e => {
        //             console.log(e);
        //         })
        // }, 5000);

    }

    render() {
        let helpIcon = <HelpButton style={{marginLeft: '10px'}} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>;

        return <div className='profiles-wrapper page-content-wrapper'>
            <Page title='Profiles' helpIcon={helpIcon}>
                <Manage {...this.props} />
            </Page>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        sds: state.fhir.sds,
        definitionTypes: state.fhir.definitionTypes,
        profileSDsLoading: state.fhir.profileSDsLoading,
        profileResources: state.fhir.profileResources,
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles,
        profileResource: state.fhir.resource,
        profilesLoading: state.fhir.profilesLoading,
        profilesUploading: state.fhir.profilesUploading,
        profilePagination: state.fhir.profilePagination,
        validationExecuting: state.fhir.validationExecuting,
        fetchingProfileResource: state.fhir.fetchingResource,
        profilesUploadingStatus: state.fhir.profilesUploadingStatus,
        fetchingFile: state.fhir.fetchingFile,
        profilesByDefinition: state.fhir.profilesByDefinition,
        fetchingProfilesByDefinition: state.fhir.fetchingProfilesByDefinition
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError, loadProfileResources, loadResource, fetchDefinitionTypes,
    loadProfilesBySD, clearLoadedProfilesBySD
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Profiles)));
