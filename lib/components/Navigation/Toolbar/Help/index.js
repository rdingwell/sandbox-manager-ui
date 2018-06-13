import React, { Component } from 'react';
import { Divider, Popover, Menu, MenuItem } from 'material-ui';
import { ActionHelp } from "material-ui/svg-icons/index";

import './styles.less';

export default class Help extends Component {
    constructor (props) {
        super(props);

        this.state = {
            help: null,
            showHelpDropdown: false,
            anchorEl: undefined
        }
    }

    render () {
        return <div className='help-wrapper'>
            <div ref='anchor' />
            <div className='right'>
                <a onClick={this.handleUSerDropdown}><ActionHelp color='whitesmoke' /></a>
            </div>
            {this.state.showHelpDropdown &&
            <Popover open={this.state.showHelpDropdown} anchorEl={this.refs.anchor} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={this.handleUSerDropdown} className='left-margin'>
                <Menu className='help-menu' width='200px' desktop autoWidth={false}>
                    <MenuItem className='help-menu-item' primaryText='Developers Portal'
                              onClick={() => this.openLink('https://www.developers.hspconsortium.org/')} />
                    <Divider />
                    <MenuItem className='help-menu-item disabled' primaryText='Documentation' disabled />
                    <MenuItem className='help-menu-item' primaryText='HSPC Platform'
                              onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox')} />
                    <MenuItem className='help-menu-item' primaryText='Code Samples'
                              onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples')} />
                    <MenuItem className='help-menu-item' primaryText='Tutorials'
                              onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples')} />
                    <MenuItem className='help-menu-item' primaryText='HL7 FHIR'
                              onClick={() => this.openLink('http://hl7.org/fhir/')} />
                    <MenuItem className='help-menu-item' primaryText='EHR Integration Guide'
                              onClick={() => this.props.history.push('/' + sessionStorage.sandboxId + '/integration')} />
                    <Divider />
                    <MenuItem className='help-menu-item disabled' primaryText='Support' disabled />
                    <MenuItem className='help-menu-item' primaryText='FAQ'
                              onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/61767707/FAQs')} />
                    <MenuItem className='help-menu-item' primaryText='Developer Forum'
                              onClick={() => this.openLink('https://groups.google.com/a/hspconsortium.org/forum/#!forum/developer')} />
                    <MenuItem className='help-menu-item' primaryText='Issue Tracker'
                              onClick={() => this.openLink('https://healthservices.atlassian.net/secure/RapidBoard.jspa?rapidView=3&view=planning')} />
                </Menu>
            </Popover>}
        </div>;
    };

    openLink = (link) => {
        window.open(link, '_blank');
    };

    handleUSerDropdown = (event) => {
        this.setState({
            showHelpDropdown: !this.state.showHelpDropdown,
            anchorEl: event.currentTarget
        });
    };
}
