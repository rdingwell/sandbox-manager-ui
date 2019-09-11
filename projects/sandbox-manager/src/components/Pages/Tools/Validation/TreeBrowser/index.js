import React, {Component, Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {getMetadata, lookupPersonasStart, fetchPersonas, getPersonasPage, getResourcesForPatient} from '../../../../../redux/action-creators';
import {connect} from 'react-redux';
import withErrorHandler from '../../../../UI/hoc/withErrorHandler';
import {Dialog, ListItem, Button, IconButton, List, withTheme, Collapse, Tooltip, CircularProgress} from '@material-ui/core';
import Remove from '@material-ui/icons/Remove';
import Folder from '@material-ui/icons/Folder';
import Description from '@material-ui/icons/Description';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Compare from "svg-react-loader?name=Patient!../../../../../assets/icons/validateIcon.svg";
import PersonaList from '../../../Persona/List';
import {getPatientName} from '../../../../../lib/utils';

import './styles.less';

class TreeBrowser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            patientSelectVisible: false,
            toggledItems: {
                patient: true
            }
        };
    }

    componentDidMount() {
        this.props.getMetadata && this.props.getMetadata(false);
    }

    render() {
        let palette = this.props.theme;
        let click = selectedPersona => {
            selectedPersona && this.props.selectPatient(selectedPersona);
            this.toggleModal();

            //Build a list of resources that can point to the patient
            let resourceList = [];
            this.props.metadata && this.props.metadata.rest[0].resource.map(res => {
                res.searchParam.map(param => {
                    param.name === 'patient' && resourceList.push({type: res.type});
                })
            });

            this.props.getResourcesForPatient(resourceList, selectedPersona.id);
        };

        let props = {
            type: 'Patient', click, personaList: this.props.personas, modal: true, theme: palette, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.props.fetchPersonas, loading: this.props.personaLoading, close: this.toggleModal, pagination: this.props.pagination, fetchPersonas: this.props.fetchPersonas,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.pagination), prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.pagination)
        };

        return <div className='tree-browser'>
            <div className='tree-input-wrapper'>
                {!this.props.selectedPersona && !this.state.patientSelectVisible && <Button variant='contained' color='primary' onClick={this.toggleModal} className='select-patient-button'>
                    Select a patient
                </Button>}
                {!this.props.selectedPersona && this.state.patientSelectVisible &&
                <Dialog open={this.state.patientSelectVisible} onClose={this.toggleModal} classes={{paper: 'patient-select-dialog'}}>
                    <PersonaList {...props} titleLeft/>
                </Dialog>}
                {this.props.selectedPersona && this.getTree()}
            </div>
        </div>
    }

    toggleModal = () => {
        this.setState({patientSelectVisible: !this.state.patientSelectVisible});
    };

    getTree = () => {
        let persona = this.props.selectedPersona;
        let props = this.props.loadingResources ? [] : this.getReferences();
        let id = `${persona.resourceType}/${persona.id}`;
        let classes = `list-item ${this.props.query === id ? 'active' : ''}`;

        return <List className='tree-list' key={persona.id} id={persona.id}>
            <ListItem button className={classes} onClick={() => this.toggleItem('patient')}>
                <Description/> {`${getPatientName(persona)}`}
                <Tooltip title='Select' aria-label='select'>
                    <IconButton variant='contained' color='secondary' onClick={e => this.toggle(e, id)}>
                        <Compare style={{transform: 'scale(1.3)'}}/>
                    </IconButton>
                </Tooltip>
            </ListItem>
            {this.props.loadingResources && <div className='resource-loader'>
                <CircularProgress/>
                <div>Fetching linked resources</div>
            </div>}
            {!this.props.loadingResources &&
            <Collapse unmountOnExit in>
                <List>
                    {props}
                </List>
            </Collapse>}
        </List>
    };

    toggle = (event, selectedResource) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onToggle && this.props.onToggle(selectedResource);
    };

    getReferences = () => {
        return Object.keys(this.props.patientResources).map(resource => {
            if (this.props.patientResources[resource].total > 0) {
                let id = 'references.' + this.props.patientResources[resource].id;
                let list = [];
                this.props.patientResources[resource].entry.map(item => {
                    list.push(item.resource);
                });
                return <Fragment key={id}>
                    <ListItem button onClick={() => this.toggleItem(id)} className='list-item'>
                        <Folder/>
                        <span>
                            {resource}s <span className='bold'>({this.props.patientResources[resource].total})</span>
                        </span>
                        <Tooltip title='Expand' aria-label='expand' className={`chevron${!!this.state.toggledItems[id] ? ' turn' : ''}`}>
                            <ArrowDown/>
                        </Tooltip>
                    </ListItem>
                    <Collapse unmountOnExit in={this.state.toggledItems[id]}>
                        <List>
                            {this.getNested(list, id, true)}
                        </List>
                    </Collapse>
                </Fragment>;
            }
        });
    };

    toggleItem = (item) => {
        let toggledItems = Object.assign({}, this.state.toggledItems);
        if (toggledItems[item]) {
            Object.keys(toggledItems).map(key => {
                if (key.indexOf(item) !== -1) {
                    delete toggledItems[key];
                }
            });
        } else {
            toggledItems[item] = true
        }
        this.setState({toggledItems});
    };

    getNested = (object, parentId, isRootLevel) => {
        if (object.map) {
            return object.map((listItem, index) => {
                if (['string', 'number', 'boolean'].indexOf(typeof (listItem)) !== -1) {
                    let id = `${parentId}.${listItem}`;
                    return <ListItem key={id}>
                        <Remove/> <span><span className='bold'>{listItem}</span></span>
                    </ListItem>;
                } else {
                    let id = `${parentId}.${index}`;
                    let checked = `${listItem.resourceType}/${listItem.id}`;
                    let classes = `list-item ${this.props.query === checked ? 'active' : ''}`;

                    return <Fragment key={id}>
                        <ListItem button className={classes} onClick={() => this.toggleItem(id)}>
                            <Description/> <span>{index}{listItem.id ? ` [${listItem.id}]` : ''}</span>
                            <Tooltip title='Select' aria-label='select'>
                                <IconButton variant='contained' color='secondary' onClick={e => this.toggle(e, checked)}>
                                    <Compare style={{transform: 'scale(1.3)'}}/>
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                        <Collapse unmountOnExit in={this.state.toggledItems[id]}>
                            <List>
                                {this.getNested(listItem, id)}
                            </List>
                        </Collapse>
                    </Fragment>;
                }
            });
        } else {
            return this.buildItem(object, parentId);
        }
    };

    buildItem = (object, parentId) => {
        return Object.keys(object).map(key => {
            let item = object[key];
            let id = `${parentId}.${key}`;
            if (typeof (item) === 'string') {
                return <ListItem key={id} className='list-item'>
                    <Remove/> <span>{key}: <span className='bold'>{item}</span></span>
                </ListItem>;
            } else if (typeof (item) === 'boolean') {
                return <ListItem key={id} className='list-item'>
                    <Remove/> <span>{key}: <span className='bold'>{item.toString()}</span></span>
                </ListItem>;
            } else {
                return <Fragment key={id}>
                    <ListItem button onClick={() => this.toggleItem(id)} className='list-item'>
                        <Folder/> <span>{key}</span>
                        <Tooltip title='Expand' aria-label='expand' className={`chevron${!!this.state.toggledItems[id] ? ' turn' : ''}`}>
                            <ArrowDown/>
                        </Tooltip>
                    </ListItem>
                    <Collapse unmountOnExit in={this.state.toggledItems[id]}>
                        <List>
                            {this.getNested(item, id)}
                        </List>
                    </Collapse>
                </Fragment>;
            }
        })
    };
}

const mapStateToProps = state => {

    return {
        sds: state.fhir.sds,
        metadata: state.fhir.metadata,
        loadingResources: state.patient.loadingResources,
        patientResources: state.patient.resources,
        metadataCounts: state.fhir.metadataCounts,
        personas: state.persona.patients,
        personaLoading: state.persona.loading,
        pagination: state.persona.patientsPagination,
        patientsPagination: state.persona.patientsPagination,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    getMetadata, lookupPersonasStart, fetchPersonas, getResourcesForPatient,
    getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
    getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(TreeBrowser)));
