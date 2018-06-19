import React, {Component} from 'react';
import {Divider, Popover, FlatButton, Menu, MenuItem, Dialog} from 'material-ui';
import strings from '../../../../strings';
import './styles.less';
import CreateSandbox from '../../../../../projects/sandbox-manager/src/components/containers/CreateSandbox';

export default class SandboxSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 'Sandboxes',
            open: false,
            showCreateModal: false
        };
    }

    render() {
        return (
            <div className='sandbox-menu-wrapper'>
                {this.state.showCreateModal && <CreateSandbox onCancel={this.toggleCreateModal} open={this.state.showCreateModal}/>}
                <span className='anchor' ref='anchor'/>
                <FlatButton onClick={this.handleClick} hoverColor='none' rippleColor='none' className='down-button'>
                    <span>{this.props.sandbox.name}</span> <i className='fa fa-chevron-down'/>
                </FlatButton>
                <Popover open={this.state.open} anchorEl={this.refs.anchor}
                         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                         targetOrigin={{horizontal: 'left', vertical: 'top'}} onRequestClose={this.handleRequestClose}
                         className='sandbox-menu-item left-margin'>
                    <Menu>
                        <MenuItem primaryText={strings.sandboxSelector.createLabel} className='sandbox-menu-item'
                                  onClick={this.toggleCreateModal}/>
                        <Divider/>
                        <MenuItem primaryText='See all Sandboxes' className='sandbox-menu-item'
                                  onClick={() => this.props.history.push('/dashboard')}/>
                        <Divider/>
                        {this.props.sandboxes.map((sandbox, index) => <MenuItem className='sandbox-menu-item'
                                                                                key={index} value={sandbox.sandboxId}
                                                                                primaryText={sandbox.name}
                                                                                onClick={() => this.selectSandbox(sandbox)}/>)}
                    </Menu>
                </Popover>
            </div>
        );
    }

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
            open: true
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
}
