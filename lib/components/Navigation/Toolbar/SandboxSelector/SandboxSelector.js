import React, { Component } from 'react';

import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';



export default class SandboxSelector extends Component {
    state = {
        value: 'Sandboxes',
        open: false
    };


    handleChange = (event, index, value) => {
        this.setState({value});
        if(this.state.value !== 'Sandboxes' && this.state.value !== 'CreateNew'){
            this.props.selectSandbox(this.state.value);
        }
    };

    handleClick = (event) => {
        // This prevents ghost click.
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

    render () {
        const menuItemStyles = {
            fontFamily: '"Open Sans", sans-serif'
        };

        const sandboxes = this.props.sandboxes.map( (sandbox) => {
            return (
                <MenuItem key={sandbox.id} value={sandbox.sandboxId} primaryText={sandbox.name} style={menuItemStyles}/>
            )});

        const buttonStyle = {
            fontFamily: '"Open Sans", sans-serif',
            textAlign: 'left',
            paddingLeft: 10,
            color: '#ffffff',
            width: '100%',
            marginBottom: '10px'
        };

        const popStyle = {
            fontFamily: '"Open Sans", sans-serif',
            marginLeft: 10,
        };

        const chevronStyle = {
            fontSize: 14
        };



        return(
          <div>
            <FlatButton
              onClick={this.handleClick}
              style={buttonStyle}
              hoverColor="none"
              rippleColor="none"
            >
                Sandboxes &nbsp;&nbsp; <i className="fa fa-chevron-down" style={chevronStyle}></i>
            </FlatButton>
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              style={popStyle}
            >
              <Menu>
                <MenuItem primaryText="Sample Sandbox" style={menuItemStyles}/>
                {sandboxes}
                <hr/>
                <MenuItem primaryText="+ Create Sandbox" style={menuItemStyles}/>
              </Menu>
            </Popover>
          </div>
        );
    }
}
