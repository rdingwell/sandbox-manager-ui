import React, { Component } from 'react';
import { Popover, FlatButton, Menu, MenuItem, Dialog } from 'material-ui';
import strings from '../../../../strings';
import './styles.less';
import CreateSandbox from '../../../../../projects/sandbox-manager/src/components/containers/CreateSandbox';

export default class SandboxSelector extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: 'Sandboxes',
            open: false,
            showCreateModal: false
        };
    }

    render () {
        return (
            <div className='sandbox-menu-wrapper'>
                <Dialog paperClassName='create-sandbox-dialog' modal open={this.state.showCreateModal}>
                    <CreateSandbox onCancel={this.toggleCreateModal} />
                </Dialog>
                <FlatButton onClick={this.handleClick} hoverColor='none' rippleColor='none' className='down-button'>
                    {strings.sandboxSelector.mainLabel} <i className='fa fa-chevron-down' />
                </FlatButton>
                <Popover open={this.state.open} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleRequestClose} className='sandbox-menu-item left-margin'>
                    <Menu>
                        {this.props.sandboxes.map((sandbox, index) => <MenuItem className='sandbox-menu-item' key={index} value={sandbox.sandboxId} primaryText={sandbox.name}
                                                                       onClick={() => this.selectSandbox(sandbox)} />)}
                        <hr />
                        <MenuItem primaryText={strings.sandboxSelector.createLabel} className='sandbox-menu-item' onClick={this.toggleCreateModal} />
                    </Menu>
                </Popover>
            </div>
        );
    }

    toggleCreateModal = () => {
        this.setState({ showCreateModal: !this.state.showCreateModal });
        this.handleRequestClose();
    };

    selectSandbox = (sandbox) => {
        this.props.selectSandbox(sandbox);
    };

    handleClick = (event) => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
}
