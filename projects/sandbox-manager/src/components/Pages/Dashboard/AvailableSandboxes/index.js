import React, {Component} from 'react';
import {Paper, Button, List, ListItem, Avatar, IconButton, CircularProgress, Select, MenuItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {withTheme} from '@material-ui/styles';
import {fetchSandboxes, selectSandbox, getLoginInfo} from '../../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../../UI/hoc/withErrorHandler';
import {withRouter} from 'react-router';
import {Lock, Public, Sort} from "@material-ui/icons";

import './styles.less';

const SORT_VALUES = [
    {val: 'last_used', label: 'Last Used'},
    {val: 'alphabetical', label: 'Alphabetical'}
];

class Index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sort: 'last_used',
            desc: true
        };
    }

    componentDidMount() {
        sessionStorage.clear();
    }

    componentDidUpdate(prevProps) {
        let check = !this.props.creatingSandbox && prevProps.creatingSandbox && window.fhirClient;
        check && this.props.fetchSandboxes();
    }

    render() {
        let sandboxes = null;
        if (!this.props.loading) {
            let list = this.sortSandboxes();
            sandboxes = list.map((sandbox, index) => {
                let isThree = ['5', '8'].indexOf(sandbox.apiEndpointIndex) === -1;
                let isFour = sandbox.apiEndpointIndex === '7' || sandbox.apiEndpointIndex === '10';
                let avatarClasses = 'sandbox-avatar';
                let avatarText = 'STU3';
                let backgroundColor = this.props.theme.a1;
                if (isFour) {
                    backgroundColor = this.props.theme.p1;
                    avatarText = 'R4';
                } else if (!isThree) {
                    backgroundColor = this.props.theme.p3;
                    avatarText = 'DSTU2';
                }

                let leftAvatar = <Avatar className={avatarClasses} style={{backgroundColor}}>{avatarText}</Avatar>;
                let rightIcon = sandbox.allowOpenAccess
                    ? <IconButton tooltip='Open endpoint'>
                        <Public style={{fill: this.props.theme.p3}}/>
                    </IconButton>
                    : <IconButton tooltip='Authorization required'>
                        <Lock style={{fill: this.props.theme.p3}}/>
                    </IconButton>;
                return <a key={index} href={`${window.location.origin}/${sandbox.sandboxId}/apps`} onClick={e => e.preventDefault()} style={{textDecoration: 'none'}}>
                    <ListItem data-qa={`sandbox-${sandbox.sandboxId}`} onClick={() => this.selectSandbox(index)} id={sandbox.name} button>
                        <ListItemIcon>
                            {leftAvatar}
                        </ListItemIcon>
                        <ListItemText primary={<span style={{color: this.props.theme.p6}}>{sandbox.name}</span>} secondary={sandbox.description || 'no description available'}/>
                        <ListItemIcon>
                            {rightIcon}
                        </ListItemIcon>
                    </ListItem>
                </a>
            });

        }

        return <Paper className='sandboxes-wrapper paper-card'>
            <h3>
                <div className='sandbox-sort-wrapper'>
                    <IconButton onClick={() => this.setState({desc: !this.state.desc})}>
                        <Sort className={!this.state.desc ? 'rev' : ''} style={{fill: this.props.theme.p5}}/>
                    </IconButton>
                    <Select style={{width: '140px', marginLeft: '16px', color: 'whitesmoke', fill: 'whitesmoke'}} value={this.state.sort}
                            className='select' onChange={e => this.setState({sort: e.target.value})}>
                        <MenuItem value={SORT_VALUES[0].val}>
                            {SORT_VALUES[0].label}
                        </MenuItem>
                        <MenuItem value={SORT_VALUES[1].val}>
                            {SORT_VALUES[1].label}
                        </MenuItem>
                    </Select>
                </div>
                <Button variant='contained' id='create_sandbox_button' color='primary' className='create-sandbox-button' onClick={this.handleCreate} data-qa='create-sandbox'>
                    New Sandbox
                </Button>
            </h3>
            <div>
                {!this.props.loading && <List>
                    {sandboxes}
                </List>}
                {this.props.loading && <div className='loader-wrapper' data-qa='sandbox-loading-loader'>
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
            return this.props.sandboxes.sort((a, b) => {
                let timeA = (this.props.loginInfo || []).find(i => i.sandboxId === a.sandboxId) || {accessTimestamp: parseInt(a.id)};
                let timeB = (this.props.loginInfo || []).find(i => i.sandboxId === b.sandboxId) || {accessTimestamp: parseInt(b.id)};
                let val = timeA.accessTimestamp >= timeB.accessTimestamp ? -1 : 1;
                if (!this.state.desc) {
                    val *= -1;
                }
                return val;
            });
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

    fetchSandboxes() {
        window.fhirClient && this.props.fetchSandboxes();
    }
}

const mapStateToProps = state => {
    return {
        sandboxes: state.sandbox.sandboxes,
        loading: state.sandbox.loading || state.sandbox.fetchingLoginInfo,
        creatingSandbox: state.sandbox.creatingSandbox,
        loginInfo: state.sandbox.loginInfo
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchSandboxes, selectSandbox, getLoginInfo}, dispatch);
};

export default withTheme(withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Index))));
