import * as types from "./types";
import API from '../../lib/api';
import { lookupPersonasStart, setPersonas } from './persona';

export function fhir_Reset () {
    return { type: types.FHIR_RESET };
}

export function fhir_SetContext (context) {
    return {
        type: types.FHIR_SET_CONTEXT,
        payload: context
    };
}

export function fhir_SetMeta (payload) {
    return {
        type: types.FHIR_SET_META,
        payload
    };
}

export function fhir_SetParsedPatientDemographics (data) {
    return {
        type: types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS,
        payload: data
    };
}

export function fhir_setCustomSearchExecuting (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_EXECUTING,
        payload: { executing }
    };
}

export function fhir_setLoadingMetadata (loading) {
    return {
        type: types.FHIR_SET_METADATA_LOADING,
        payload: { loading }
    };
}

export function fhir_setLoadingResources (loading) {
    return {
        type: types.FHIR_SET_RESOURCES_LOADING,
        payload: { loading }
    };
}

export function fhir_setMetadata (data) {
    return {
        type: types.FHIR_SET_METADATA,
        payload: { data }
    };
}

export function fhir_setResources (data) {
    return {
        type: types.FHIR_SET_RESOURCES,
        payload: { data }
    };
}

export function fhir_setResourcesCount (data) {
    return {
        type: types.FHIR_SET_RESOURCES_COUNT,
        payload: { data }
    };
}

export function fhir_setValidationResults (results) {
    return {
        type: types.FHIR_SET_VALIDATION_RESULTS,
        payload: { results }
    };
}

export function fhir_setValidationExecuting (executing) {
    return {
        type: types.FHIR_SET_VALIDATION_EXECUTING,
        payload: { executing }
    };
}

export function fhir_setCustomSearchGettingNextPage (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_GETTING_NEXT_PAGE,
        payload: { executing }
    };
}

export function cleanValidationResults () {
    return {
        type: types.FHIR_CLEAN_VALIDATION_RESULTS
    };
}

export function fhir_setProfilesLoading (loading) {
    return {
        type: types.FHIR_SET_PROFDILES_LOADING,
        payload: { loading }
    };
}

export function fhir_setProfilesUploading (loading) {
    return {
        type: types.FHIR_SET_PROFDILES_UPLOADING,
        payload: { loading }
    };
}

export function fhir_setFetchingFile (loading) {
    return {
        type: types.FHIR_SET_FILE_FETCHING,
        payload: { loading }
    };
}

export function fhir_setProfilesUploadingStatus (status) {
    return {
        type: types.FHIR_SET_PROFDILES_UPLOADING_STATUS,
        payload: { status }
    };
}

export function fhir_setProfiles (profiles) {
    return {
        type: types.FHIR_SET_PROFDILES,
        payload: { profiles }
    };
}

export function fhir_SetSampleData () {
    return { type: types.FHIR_SET_SAMPLE_DATA };
}

export function fhir_setCustomSearchResults (results) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_RESULTS,
        payload: { results }
    }
}

export function fhir_setCustomSearchResultsNext (results) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_RESULTS_NEXT,
        payload: { results }
    }
}

export function fhir_setExportSearchResults (exportResults) {
    return {
        type: types.FHIR_SET_EXPORT_SEARCH_RESULTS,
        payload: { exportResults }
    }
}

export function fhir_SetSmart (payload) {
    return dispatch => {
        if (payload.status === 'ready') {
            window.fhirClient = FHIR.client({
                serviceUrl: payload.data.server.serviceUrl, // Overwrite response.iss with internal Fhir Api data store
                credentials: 'include',
                auth: {
                    type: 'bearer',
                    token: payload.data.tokenResponse.access_token
                }
            });
        }

        dispatch({ type: types.FHIR_SET_SMART, payload });
    }
}

export function customSearch (query, endpoint) {
    return dispatch => {
        dispatch(fhir_setCustomSearchResults(null));
        dispatch(fhir_setCustomSearchExecuting(true));

        endpoint = endpoint ? endpoint : window.fhirClient.server.serviceUrl;
        API.get(`${endpoint}/${query}`, dispatch)
            .then(data => {
                dispatch(fhir_setCustomSearchResults(data));
                dispatch(fhir_setCustomSearchExecuting(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchExecuting(false));
            });
    }
}

export function loadProfiles (count, filter) {
    return dispatch => {
        dispatch(fhir_setProfilesLoading(true));

        if (window.fhirClient) {
            let endpoint = window.fhirClient.server.serviceUrl;
            API.get(`${endpoint}/StructureDefinition?_count=${count}${filter ? `&name:contains=${filter}` : ''}`, dispatch)
                .then(data => {
                    data.entry = data.entry ? data.entry : [];
                    dispatch(fhir_setProfiles({ entry: data.entry.map(i => i.resource), total: data.total, link: data.link }));
                    dispatch(fhir_setProfilesLoading(false));
                })
                .catch(() => {
                    dispatch(fhir_setProfilesLoading(false));
                });
        }
    }
}

export function getProfilesPagination () {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            dispatch(fhir_setProfilesLoading(true));
            let state = getState();
            let next = state.fhir.profilePagination.link.find(i => i.relation === "next");
            let url = next.url;
            API.get(url, dispatch)
                .then(profiles => {
                    let list = profiles;
                    if (profiles.entry) {
                        let resourceResults = [];

                        for (let key in profiles.entry) {
                            profiles.entry[key].resource.fullUrl = profiles.entry[key].fullUrl;
                            resourceResults.push(profiles.entry[key].resource);
                        }
                        list = resourceResults;
                    }
                    state = getState();
                    let current = state.fhir.profiles || [];
                    list = current.concat(list);
                    dispatch(fhir_setProfiles({ entry: list, total: profiles.total, link: profiles.link }));
                    dispatch(fhir_setProfilesLoading(false));
                })
                .catch(e => {
                    dispatch(fhir_setProfilesLoading(false));
                });
        }
    }
}

export function uploadProfile (file, count) {
    return (dispatch, getState) => {
        let state = getState();
        let config = state.config.xsettings.data.sandboxManager;
        let formData = new FormData();
        formData.append("file", file);
        dispatch(fhir_setProfilesUploading(true));

        let url = config.baseServiceUrl_5;
        if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "6") {
            url = config.baseServiceUrl_6;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "7") {
            url = config.baseServiceUrl_7;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "8") {
            url = config.baseServiceUrl_8;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "9") {
            url = config.baseServiceUrl_9;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "10") {
            url = config.baseServiceUrl_10;
        }

        API.post(`${url}/profile/uploadProfile?file=${file.name}&sandboxId=${sessionStorage.sandboxId}&apiEndpoint=${state.sandbox.sandboxApiEndpointIndex}`, formData, dispatch, true)
            .then(data => {
                let timeoutFunction = () => {
                    API.get(`${url}/profile/profileUploadStatus?id=${data.id}`, dispatch)
                        .then(status => {
                            if (!status.status) {
                                dispatch(fhir_setProfilesUploading(false));
                                dispatch(fhir_setCustomSearchResults(data));
                                dispatch(loadProfiles(count));
                                dispatch(fhir_setProfilesUploadingStatus({}));
                            } else {
                                dispatch(fhir_setProfilesUploadingStatus(status));
                                setTimeout(timeoutFunction, 1000);
                            }
                        })
                };
                setTimeout(timeoutFunction, 1000);
            })
            .catch(() => {
                dispatch(fhir_setProfilesUploading(false));
            });
    }
}

export function loadProject (project, canFit) {
    return dispatch => {
        dispatch(fhir_setFetchingFile(true));
        fetch(`https://simplifier.net/${project}/$download?format=json`)
            .then(response => response.body)
            .then(rs => {
                const reader = rs.getReader();
                return new ReadableStream({
                    async start (controller) {
                        while (true) {
                            const { done, value } = await reader.read();
                            // When no more data needs to be consumed, break the reading
                            if (done) {
                                break;
                            }
                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                        }
                        // Close the stream
                        controller.close();
                        reader.releaseLock();
                    }
                })
            })
            // Create a new response out of the stream
            .then(rs => new Response(rs))
            // Create an object URL for the response
            .then(response => response.blob())
            .then(blob => {
                let file = new File([blob], `${project}.zip`);
                dispatch(uploadProfile(file, canFit));
                dispatch(fhir_setFetchingFile(false));
            })
            // Update image
            .catch(() => {
                dispatch(fhir_setFetchingFile(false));
            })
    }
}

export function getMetadata (shouldGetResourcesCount = true) {
    return dispatch => {
        dispatch(fhir_setLoadingMetadata(true));
        API.get(`${window.fhirClient.server.serviceUrl}/metadata?_format=json&_pretty=true`, dispatch)
            .then(data => {
                dispatch(fhir_setMetadata(data));
                shouldGetResourcesCount && dispatch(getResourcesCount(data.rest[0].resource));
                dispatch(fhir_setLoadingMetadata(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingMetadata(false));
            });
    }
}

export function fetchResources (type, query = "") {
    return dispatch => {
        dispatch(fhir_setLoadingResources(true));
        API.get(`${window.fhirClient.server.serviceUrl}/${type}?_count=40${query}`, dispatch)
            .then(data => {
                dispatch(fhir_setResources(data));
                dispatch(fhir_setLoadingResources(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingResources(false));
            });
    }
}

export function validate (object) {
    return dispatch => {
        dispatch(fhir_setValidationResults(null));
        dispatch(fhir_setValidationExecuting(true));

        API.postNoErrorManagement(`${window.fhirClient.server.serviceUrl}/${object.resourceType}/$validate`, object, dispatch)
            .then(data => {
                data.validatedObject = object.id;
                data.validatedProfile = object.meta && object.meta.profile && object.meta.profile[0];
                dispatch(fhir_setValidationResults(data));
                dispatch(fhir_setValidationExecuting(false));
            })
            .catch((e) => {
                data.validatedObject = object.id;
                data.validatedProfile = object.meta && object.meta.profile && object.meta.profile[0];
                dispatch(fhir_setValidationResults(e));
                dispatch(fhir_setValidationExecuting(false));
            });
    }
}

export function validateExisting (url, selectedProfile) {
    return dispatch => {
        dispatch(fhir_setValidationResults(null));
        dispatch(fhir_setValidationExecuting(true));

        if (!selectedProfile) {
            API.get(`${window.fhirClient.server.serviceUrl}/${url}/$validate`, dispatch)
                .then(data => {
                    data.validatedObject = url;
                    dispatch(fhir_setValidationResults(data));
                    dispatch(fhir_setValidationExecuting(false));
                })
                .catch((e) => {
                    dispatch(fhir_setValidationResults(e));
                    dispatch(fhir_setValidationExecuting(false));
                });
        } else {
            API.get(`${window.fhirClient.server.serviceUrl}/${url}`, dispatch)
                .then(data => {
                    if (data.resourceType) {
                        !data.meta && (data.meta = {});
                        data.meta.profile = [selectedProfile];
                        dispatch(validate(data));
                    }
                })
                .catch((e) => {
                    dispatch(fhir_setValidationResults(e));
                    dispatch(fhir_setValidationExecuting(false));
                });
        }
    }
}

export function getResourcesCount (data, query = "") {
    return dispatch => {
        let counts = {};
        let promises = [];
        data.map(res => {
            promises.push(new Promise(resolve => {
                API.get(`${window.fhirClient.server.serviceUrl}/${res.type}?_count=1${query}`, dispatch)
                    .then(d => {
                        counts[res.type] = d.total;
                        resolve();
                    })
            }))
        });
        Promise.all(promises)
            .then(() => {
                dispatch(fhir_setResourcesCount(counts));
            })
    };
}

export function customSearchNextPage (link) {
    return dispatch => {
        dispatch(fhir_setCustomSearchGettingNextPage(true));

        API.get(link.url, dispatch)
            .then(data => {
                dispatch(fhir_setCustomSearchResultsNext(data));
                dispatch(fhir_setCustomSearchGettingNextPage(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchGettingNextPage(false));
            });
    }
}

export function clearSearchResults () {
    return dispatch => {
        dispatch(fhir_setCustomSearchResults());
    }
}
