import React, { Component } from 'react';
import { Popover, FlatButton, Menu, MenuItem } from 'material-ui';
import strings from '../../../../strings';
import './styles.less';

export default class SandboxSelector extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: 'Sandboxes',
            open: false
        };
    }

    render () {
        return (
            <div className='sandbox-menu-wrapper'>
                <FlatButton onClick={this.handleClick} hoverColor='none' rippleColor='none' className='down-button'>
                    {strings.sandboxSelector.mainLabel} <i className='fa fa-chevron-down' />
                </FlatButton>
                <Popover open={this.state.open} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleRequestClose} className='sandbox-menu-item left-margin'>
                    <Menu>
                        {this.props.sandboxes.map(sandbox => <MenuItem className='sandbox-menu-item' key={sandbox.id} value={sandbox.sandboxId} primaryText={sandbox.name} />)}
                        <hr />
                        <MenuItem primaryText={strings.sandboxSelector.createLabel} className='sandbox-menu-item' />
                    </Menu>
                </Popover>
            </div>
        );
    }

    handleChange = (event, index, value) => {
        this.setState({ value });
        if (this.state.value !== 'Sandboxes' && this.state.value !== 'CreateNew') {
            this.props.selectSandbox(this.state.value);
        }
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
