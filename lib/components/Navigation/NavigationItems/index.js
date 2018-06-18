import React, {Component} from 'react';
import NavigationItem from './NavigationItem';
import strings from '../../../strings';
import './styles.less';

export default class NavigationItems extends Component {
    render() {
        let ehrSimulatorUrl = this.props.sandbox && window.fhirClient
            ? `https://ehr-app.hspconsortium.org/launch/${this.props.sandbox.sandboxId}/${this.props.sandboxApiUrl}/${window.fhirClient.server.serviceUrl.split('/')[2]}/${window.fhirClient.server.auth.token}`
            : undefined;

        return <ul className='navigation-items'>
            {this.props.sandbox && <li className='navigation-item'>
                <a href={ehrSimulatorUrl} target='_blank'>
                    <i className='fa fa-book'/><span>{strings.navigation.ehrSimulator}</span>
                </a>
            </li>}
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/apps'}>
                <i className='fa fa-th fa-lg'/><span>{strings.navigation.apps}</span>
            </NavigationItem>
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/launch'}>
                <i className='fa fa-list fa-lg'/><span>{strings.navigation.launchScenarios}</span>
            </NavigationItem>
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/patients'}>
                <i className='fa fa-bed fa-lg'/><span>{strings.navigation.patients}</span>
            </NavigationItem>
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/practitioners'}>
                <i className='fa fa-user-md fa-lg'/><span>{strings.navigation.practitioners}</span>
            </NavigationItem>
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/personas'}>
                <i className='fa fa-users fa-lg'/><span>{strings.navigation.personas}</span>
            </NavigationItem>
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/data-manager'}>
                <i className='fa fa-database fa-lg'/><span>{strings.navigation.dataManager}</span>
            </NavigationItem>
            {sessionStorage.sandboxId !== 'STU301withSynthea' && <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/user-management'}>
                <i className='fa fa-users'/><span>{strings.navigation.userManagement}</span>
            </NavigationItem>}
            {/*<NavigationItem link={'/' + this.props.sandbox.sandboxId + '/integration'}>*/}
            {/*<i className='fa fa-gears fa-lg' /><span>{strings.navigation.ehrIntegration}</span>*/}
            {/*</NavigationItem>*/}
            {/*<li className='navigation-item'>*/}
            {/*<a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox' target='_blank'>*/}
            {/*<i className='fa fa-book' /><span>{strings.navigation.documentation}</span>*/}
            {/*</a>*/}
            {/*</li>*/}
            <NavigationItem link={'/' + this.props.sandbox.sandboxId + '/settings'} active={this.props.screen === 'settings'}>
                <i className='fa fa-gear fa-lg'/><span>{strings.navigation.settings}</span>
            </NavigationItem>
        </ul>
    }
}
