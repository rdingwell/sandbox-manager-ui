import React, {Component, Fragment} from 'react';
import {CircularProgress, Button, List, ListItem, Tab, Tabs, Stepper, Step, StepLabel, StepButton} from '@material-ui/core';
import Tree, {TreeNode} from 'rc-tree';
import ProfilesIcon from '@material-ui/icons/Spellcheck';
import Modal from './Modal';
import Filters from './Filters';
import moment from 'moment';
import ReactJson from 'react-json-view';
import Validation from '../Validation';

import './styles.less';

const regex = /<img src="(?!h)/gi;
const replaceValue = "<img src=\"http://build.fhir.org/ig/argonautproject/provider-directory/qa/";
const regex2 = /url\(/gi;
const replaceValue2 = "url\(\"http://build.fhir.org/ig/argonautproject/provider-directory/qa/";

class Manage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profileId: '',
            resourceId: '',
            profileName: '',
            activeTab: 'info'
        };
    }

    render() {
        return <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
            {!this.props.modal && <Modal {...this.props} toggleProfileToBrowse={this.toggleProfileToBrowse}/>}
            {this.getList()}
        </div>
    }

    getList = () => {
        return <div className='profiles-list'>
            <div className='wrapper'>
                <Filters {...this.props} onFilter={this.onFilter}/>
            </div>
            {!this.props.profilesLoading && ((!this.state.selectedResource && !this.state.selectedProfile)
                ? <List className='profiles'>
                    {!this.props.profilesUploading && !this.props.fetchingFile && this.props.profiles && this.props.profiles.map((profile, key) => {
                        return <ListItem key={key} onClick={() => this.toggleProfile(profile.profileId)} button>
                            <ProfilesIcon className='avatar'/> {profile.profileName}
                        </ListItem>
                    })}
                </List>
                : <div className='stepper'>
                    <Stepper activeStep={this.state.selectedProfile ? this.state.selectedResource ? 2 : 1 : 0} connector={<span className='stepper-connector'><span/></span>}>
                        <Step>
                            <StepButton onClick={() => this.toggleProfile()} icon={<span/>}>All profiles</StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.selectResource()} icon={<span/>}>{this.state.selectedProfile.profileId}</StepButton>
                        </Step>
                    </Stepper>
                    <div>
                        {!!this.state.selectedResource
                            ? <Fragment>
                                <Tabs className='resource-tabs' classes={{paper: 'resource-tabs-container'}} value={this.state.activeTab} onChange={(_e, activeTab) => this.setActiveTab(activeTab)}>
                                    <Tab label='Info' id='info' value='info' className='info tab'/>
                                    <Tab label='Tree' id='tree' value='tree' className='tree tab'/>
                                    <Tab label='JSON' id='json' value='json' className='json tab'/>
                                </Tabs>
                                {this.state.activeTab === 'info' && <Fragment>
                                    {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                        <CircularProgress size={40} thickness={5}/>
                                    </div>}
                                    {this.props.profileResource && <div className='resource-info'>
                                        <div className="label-value">
                                            <span>Resource type: </span>
                                            <span>{this.props.profileResource.resourceType}</span>
                                        </div>
                                        {this.props.profileResource.type && <div className="label-value">
                                            <span>Type: </span>
                                            <span>{this.props.profileResource.type}</span>
                                        </div>}
                                        <div className="label-value">
                                            <span>Id: </span>
                                            <span>{this.props.profileResource.id}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Version: </span>
                                            <span>{this.props.profileResource.version}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Name: </span>
                                            <span>{this.props.profileResource.name}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Status: </span>
                                            <span>{this.props.profileResource.status}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Date: </span>
                                            <span>{new moment(this.props.profileResource.date).format('DD.MM.YYYY')}</span>
                                        </div>

                                        <div className="label-value">
                                            <span>fhirVersion: </span>
                                            <span>{this.props.profileResource.fhirVersion}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Publisher: </span>
                                            <span>{this.props.profileResource.publisher}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Description: </span>
                                            <span>{this.props.profileResource.description}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Url: </span>
                                            <span>{this.props.profileResource.url}</span>
                                        </div>
                                        <div className="label-value big">
                                            <span>Text: </span>
                                            <span dangerouslySetInnerHTML={{__html: this.props.profileResource.text.div.replace(regex, replaceValue).replace(regex2, replaceValue2)}}/>
                                        </div>
                                    </div>}
                                </Fragment>}
                                {this.state.activeTab === 'tree' && <Fragment>
                                    {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                        <CircularProgress size={40} thickness={5}/>
                                    </div>}
                                    {this.props.profileResource && <Tree selectable autoExpandParent showLine onSelect={this.expand} checkedKeys={[]} defaultExpandedKeys={['0-0']}>
                                        <TreeNode title={this.props.profileResource.name}>
                                            {this.buildTree(this.props.profileResource)}
                                        </TreeNode>
                                    </Tree>}
                                </Fragment>}
                                {this.state.activeTab === 'json' && <Fragment>
                                    {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                        <CircularProgress size={40} thickness={5}/>
                                    </div>}
                                    {this.props.profileResource && <ReactJson src={this.props.profileResource} name={false}/>}
                                </Fragment>}
                            </Fragment>
                            : <List className='profiles'>
                                {!this.props.profilesLoading && this.getNestedItems(true)}
                            </List>}
                    </div>
                </div>)}
            {this.props.profilesLoading && <div className='loader-wrapper'>
                <CircularProgress size={40} thickness={5}/>
            </div>}
        </div>
    };

    expand = (_, e) => {
        e.node.selectHandle.previousSibling.click();
        return [];
    };

    buildTree = (res) => {
        let keys = Object.keys(res);
        let nodes = [];
        keys.map(k => {
            let val = res[k];
            if (typeof (val) !== 'object') {
                nodes.push(<TreeNode title={<span>{k} <b>{val}</b></span>}/>);
            } else {
                nodes.push(<TreeNode title={<span>{k}</span>}>
                    {this.buildTree(res[k])}
                </TreeNode>);
            }
        });

        return nodes;
    };

    getNestedItems = (isOpen) => {
        return !this.props.profileResources || !isOpen
            ? [<ListItem key={1}>
                <div className='loader-wrapper'>
                    <CircularProgress size={40} thickness={5}/>
                </div>
            </ListItem>]
            : this.props.profileResources.map(res => {
                return <ListItem key={res.relativeUrl} onClick={() => this.selectResource(res)} button>
                    {res.relativeUrl}
                </ListItem>
            });
    };

    selectResource = (res) => {
        res && this.props.loadResource(res);
        let state = {
            selectedResource: res
        };

        this.setState(state);
    };

    toggleProfile = (id) => {
        let selectedProfile = this.state.selectedProfile === id ? undefined : id;

        let profile = undefined;
        if (selectedProfile) {
            profile = this.props.profiles.find(i => i.profileId === id);
            profile && this.props.loadProfileResources(profile.id);
            this.props.onProfileSelected && this.props.onProfileSelected(profile);
        }

        this.setState({selectedProfile: profile, selectedResource: undefined});
    };

    toggleProfileToBrowse = (id) => {
        let profileToBrowse = this.state.profileToBrowse === id ? undefined : id;
        this.props.cleanValidationResults();

        this.setState({profileToBrowse});
    };

    filter = () => {
    };
}

export default Manage;
