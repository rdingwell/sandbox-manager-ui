import React, { Component } from 'react';
import NavigationItem from './NavigationItem';
import StorageIcon from 'material-ui/svg-icons/device/storage';
import ContactsIcon from 'material-ui/svg-icons/communication/contacts';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Desktop from 'material-ui/svg-icons/hardware/desktop-windows';

import strings from '../../../strings';
import './styles.less';

export default class NavigationItems extends Component {
    render () {
        let ehrSimulatorUrl = this.props.sandbox && window.fhirClient
            ? `https://ehr-app.hspconsortium.org/launch/${this.props.sandbox.sandboxId}/${this.props.sandboxApiUrl}/${window.fhirClient.server.serviceUrl.split('/')[2]}/${window.fhirClient.server.auth.token}`
            : undefined;
        let ehrStyle = { borderBottom: `1px solid ${this.props.theme.palette.primary7Color}` };
        let iconStyle = { color: this.props.theme.palette.primary3Color, marginRight: '24px' };

        return <ul className='navigation-items'>
            {this.props.sandbox &&
            <li className='navigation-item' style={ehrStyle}>
                <a href={ehrSimulatorUrl} target='_blank' style={{ color: this.props.theme.palette.primary3Color }}>
                    <Desktop style={iconStyle}/>
                    <span>{strings.navigation.ehrSimulator}</span>
                </a>
            </li>}
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/apps'} icon={AppsIcon} text={<span>{strings.navigation.apps}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/launch'} icon={LaunchIcon} text={<span>{strings.navigation.launchScenarios}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/personas'} icon={ContactsIcon} text={<span>{strings.navigation.personas}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/patients'} icon={<i className='fa fa-bed fa-lg'/>} text={<span>{strings.navigation.patients}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/practitioners'} icon={<i className='fa fa-user-md fa-lg'/>}
                            text={<span>{strings.navigation.practitioners}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/data-manager'} icon={StorageIcon} text={<span>{strings.navigation.dataManager}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/settings'} active={this.props.screen === 'settings'} icon={SettingsIcon}
                            text={<span>{strings.navigation.settings}</span>}/>
        </ul>
    }
}
