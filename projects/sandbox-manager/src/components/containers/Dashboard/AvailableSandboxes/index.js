import React, { Component } from 'react';
import { Paper, RaisedButton, List, ListItem, Avatar, IconButton, CircularProgress, SelectField, MenuItem } from 'material-ui';
import { fetchSandboxes, selectSandbox, getLoginInfo } from '../../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { withRouter } from 'react-router';
import { ActionLock, SocialPublic, ContentSort } from "material-ui/svg-icons/index";
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

const SORT_VALUES = [
    { val: 'last_used', label: 'Last Used' },
    { val: 'alphabetical', label: 'Alphabetical' }
];

class Index extends Component {

    constructor (props) {
        super(props);

        this.state = {
            sort: 'last_used',
            desc: true
        };
    }

    componentDidMount () {
        sessionStorage.clear();
        this.fetchSandboxes();
        this.props.getLoginInfo();
    }

    componentDidUpdate (prevProps) {
        !this.props.creatingSandbox && prevProps.creatingSandbox && window.fhirClient && this.props.fetchSandboxes();
    }

    render () {
        let sandboxes = null;
        if (!this.props.loading) {
            let list = this.sortSandboxes();
            sandboxes = list.map((sandbox, index) => {
                let isThree = ['1', '2', '5'].indexOf(sandbox.apiEndpointIndex) === -1;
                let isFour = sandbox.apiEndpointIndex === '7';
                let avatarClasses = 'sandbox-avatar';
                let avatarText = 'STU3';
                let backgroundColor = this.props.muiTheme.palette.accent1Color;
                if (isFour) {
                    backgroundColor = this.props.muiTheme.palette.primary1Color;
                    avatarText = 'R4';
                } else if (!isThree) {
                    backgroundColor = this.props.muiTheme.palette.primary3Color;
                    avatarText = 'DSTU2';
                }

                let leftAvatar = <Avatar className={avatarClasses} backgroundColor={backgroundColor}>{avatarText}</Avatar>;
                let rightIcon = sandbox.allowOpenAccess
                    ? <IconButton tooltip='Open endpoint'>
                        <SocialPublic color={this.props.muiTheme.palette.primary3Color}/>
                    </IconButton>
                    : <IconButton tooltip='Authorization required'>
                        <ActionLock color={this.props.muiTheme.palette.primary3Color}/>
                    </IconButton>;
                return <ListItem key={index} primaryText={sandbox.name} secondaryText={sandbox.description || 'no description available'}
                                 leftIcon={leftAvatar} rightIcon={rightIcon} onClick={() => this.selectSandbox(index)}/>
            });

        }

        return <Paper className='sandboxes-wrapper paper-card'>
            <h3>
                <div className='sandbox-sort-wrapper'>
                    <IconButton onClick={() => this.setState({ desc: !this.state.desc })}>
                        <ContentSort className={!this.state.desc ? 'rev' : ''} color={this.props.muiTheme.palette.primary5Color}/>
                    </IconButton>
                    <SelectField style={{ width: '140px', marginLeft: '16px' }} labelStyle={{ color: this.props.muiTheme.palette.primary5Color }} underlineStyle={{ display: 'none' }} value={this.state.sort}
                                 className='select' onChange={(_, sort) => this.setState({ sort: SORT_VALUES[sort].val })}>
                        <MenuItem value={SORT_VALUES[0].val} primaryText={SORT_VALUES[0].label}/>
                        <MenuItem value={SORT_VALUES[1].val} primaryText={SORT_VALUES[1].label}/>
                    </SelectField>
                </div>
                <RaisedButton primary className='create-sandbox-button' label='New Sandbox' onClick={this.handleCreate} labelColor='#fff'/>
            </h3>
            <div>
                {!this.props.loading && <List>
                    {sandboxes}
                </List>}
                {this.props.loading && <div className='loader-wrapper'>
                    <p>
                        Loading sandboxes
                    </p>
                    <CircularProgress size={80} thickness={5}/>
                </div>}
            </div>
        </Paper>;
    }

    sortSandboxes = () => {
        if (this.state.sort === SORT_VALUES[1].val) {
            return this.props.sandboxes.sort((a, b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                let val = 0;
                if (nameA > nameB) {
                    val = 1;
                } else if (nameA < nameB) {
                    val = -1;
                }
                if (!this.state.desc) {
                    val *= -1;
                }
                return val;
            });
        } else {
            return this.props.sandboxes;
        }
    };

    handleCreate = () => {
        this.props.onToggleModal && this.props.onToggleModal();
    };

    selectSandbox = (row) => {
        let sandbox = this.props.sandboxes[row];
        localStorage.setItem('sandboxId', sandbox.sandboxId);
        this.props.selectSandbox(sandbox);
    };

    fetchSandboxes () {
        window.fhirClient && this.props.fetchSandboxes();
    }
}

const mapStateToProps = state => {
    return {
        sandboxes: state.sandbox.sandboxes,
        loading: state.sandbox.loading,
        creatingSandbox: state.sandbox.creatingSandbox
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchSandboxes, selectSandbox, getLoginInfo }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Index))));
