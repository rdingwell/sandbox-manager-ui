import React, { Component } from 'react';
import NavigationItem from './NavigationItem';
import SandboxSelector from '../Toolbar/SandboxSelector';
import strings from '../../../strings';
import './styles.less';

export default class NavigationItems extends Component {
    render () {
        return <ul className='navigation-items'>
            <li className='NavigationItem'>
                <SandboxSelector {...this.props} />
            </li>
            <NavigationItem link={'/apps'}>
                <i className='fa fa-th fa-lg' />{strings.navigation.apps}
            </NavigationItem>
            <NavigationItem link={'/launch'}>
                <i className='fa fa-list fa-lg' />{strings.navigation.launchScenarios}
            </NavigationItem>
            <NavigationItem link={'/patients'}>
                <i className='fa fa-bed fa-lg' />{strings.navigation.patients}
            </NavigationItem>
            <NavigationItem link={'/practitioners'}>
                <i className='fa fa-user-md fa-lg' />{strings.navigation.practitioners}
            </NavigationItem>
            <NavigationItem link={'/personas'}>
                <i className='fa fa-users fa-lg' />{strings.navigation.personas}
            </NavigationItem>
            <NavigationItem link={'/data-manager'}>
                <i className='fa fa-database fa-lg' />{strings.navigation.dataManager}
            </NavigationItem>
            <NavigationItem link={'/user-management'}>
                <i className='fa fa-users' />{strings.navigation.userManagement}
            </NavigationItem>
            <NavigationItem link={'/integration'}>
                <i className='fa fa-gears fa-lg' />{strings.navigation.ehrIntegration}
            </NavigationItem>
            <li className='navigation-item'>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox' target='_blank'>
                    <i className='fa fa-book' />{strings.navigation.documentation}
                </a>
            </li>
            <NavigationItem link={'/settings'}>
                <i className='fa fa-gear fa-lg' />{strings.navigation.settings}
            </NavigationItem>
        </ul>
    }
}
