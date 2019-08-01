import React, {Component} from 'react';
import {Divider, Button, Menu, MenuItem} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import strings from '../../../../../assets/strings';

import './styles.less';

export default class SandboxSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 'Sandboxes',
            open: false,
            anchorEl: undefined,
            showCreateModal: false
        };
    }

    render() {
        let arrowStyle = {color: this.props.theme.p5, width: '25px', height: '30px', right: '-5px', position: 'relative'};
        let list = this.getSortedSandboxes();

        return <div className='sandbox-menu-wrapper'>
            {this.state.showCreateModal && React.createElement(this.props.CreateSandbox, {onCancel: this.toggleCreateModal, open: this.state.showCreateModal})}
            <span className='anchor' ref='anchor'/>
            <Button variant='outlined' onClick={this.handleClick} className='down-button'>
                <span>{this.props.sandbox.name}</span> <ArrowDropDown style={arrowStyle}/>
            </Button>
            <Menu className='sandbox-menu-item left-margin' onClose={this.handleRequestClose} open={this.state.open} anchorEl={this.state.anchorEl}>
                <MenuItem className='sandbox-menu-item' onClick={this.toggleCreateModal}>
                    {strings.sandboxSelector.createLabel}
                </MenuItem>
                <Divider/>
                <MenuItem className='sandbox-menu-item' onClick={() => this.props.history.push('/dashboard')}>
                    See all Sandboxes
                </MenuItem>
                <Divider/>
                {list.map((sandbox, index) => {
                    let val = <a key={index} href={`${window.location.origin}/${sandbox.sandboxId}/apps`} onClick={e => e.preventDefault()} style={{textDecoration: 'none'}}>
                        <MenuItem className='sandbox-menu-item' value={sandbox.sandboxId} onClick={() => this.selectSandbox(sandbox)} style={{color: this.props.theme.p6}}>
                            {sandbox.name}
                        </MenuItem>
                    </a>;
                    return index === 0
                        ? [<span className='sub'>Recently used</span>, val]
                        : index === 4
                            ? [<Divider/>, val]
                            : val;
                })}
            </Menu>
        </div>;
    }

    getSortedSandboxes = () => {
        let sandboxes = this.props.sandboxes.slice();
        let list = [];
        let sortedByDate = sandboxes.sort((a, b) => {
            let timeA = this.props.loginInfo.find(i => i.sandboxId === a.sandboxId) || {accessTimestamp: 0};
            let timeB = this.props.loginInfo.find(i => i.sandboxId === b.sandboxId) || {accessTimestamp: 0};
            return timeA.accessTimestamp >= timeB.accessTimestamp ? -1 : 1;
        });
        if (sortedByDate.length > 4) {
            list.push(sortedByDate.shift());
            list.push(sortedByDate.shift());
            list.push(sortedByDate.shift());
            list.push(sortedByDate.shift());

            return list.concat(sortedByDate.sort((a, b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                let val = 0;
                if (nameA > nameB) {
                    val = 1;
                } else if (nameA < nameB) {
                    val = -1;
                }
                return val;
            }));
        } else {
            return sortedByDate;
        }
    };

    toggleCreateModal = () => {
        this.setState({showCreateModal: !this.state.showCreateModal});
        this.handleRequestClose();
    };

    selectSandbox = (sandbox) => {
        this.handleRequestClose();
        this.props.selectSandbox(sandbox);
    };

    handleClick = (event) => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
}
