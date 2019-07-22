import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import App from '../components/App/';
import Apps from '../components/Pages/Apps';
// import Hooks from '../components/Pages/Hooks';
// import Persona from '../components/Pages/Persona';
// import Profiles from '../components/Pages/Profiles';
// import LaunchScenarios from '../components/Pages/LaunchScenarios';
// import LaunchApp from '../components/Pages/LaunchApp';
// import Settings from '../components/Pages/Settings';
// import EHRIntegration from '../components/Pages/EHRIntegration';
// import UserManagement from '../components/Pages/UserManagement';
import Dashboard from '../components/Pages/Dashboard';
import Start from '../components/Pages/Start';
import AfterAuth from '../components/Pages/AfterAuth';
// import ResourceBrowser from '../components/Pages/ResourceBrowser';
// import CreateSandbox from '../components/Pages/CreateSandbox';
// import DataManager from '../components/Pages/DataManager';
// import Tools from '../components/Pages/Tools';

export default <Router>
    <App>
        <Switch>
            <Route path='/:sandboxId/apps' component={Apps} />
            {/*<Route path='/:sandboxId/launch' component={LaunchScenarios} />*/}
            {/*<Route path='/:sandboxId/hooks' component={Hooks} />*/}
            {/*<Route path='/launchApp' component={LaunchApp} />*/}
            {/*<Route path='/:sandboxId/patients' component={Persona} />*/}
            {/*<Route path='/:sandboxId/profiles' component={Profiles} />*/}
            {/*<Route path='/:sandboxId/practitioners' component={Persona} />*/}
            {/*<Route path='/:sandboxId/tools' component={Tools} />*/}
            {/*<Route path='/:sandboxId/personas' component={Persona} />*/}
            {/*<Route path='/:sandboxId/data-manager' component={DataManager} />*/}
            {/*<Route path='/:sandboxId/resource-browser' component={ResourceBrowser} />*/}
            {/*<Route path='/:sandboxId/user-management' component={UserManagement} />*/}
            {/*<Route path='/:sandboxId/integration' component={EHRIntegration} />*/}
            {/*<Route path='/:sandboxId/settings' component={Settings} />*/}
            <Route exact path='/after-auth' component={AfterAuth} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/start' component={Start} />
            {/*<Route path='/:sandboxId/create-sandbox' component={CreateSandbox} />*/}
            {/*<Route exact path="/:sandboxId" render={({ match }) => (*/}
            {/*    <Redirect to={`/${match.params.sandboxId}/apps`} />*/}
            {/*)} />*/}
            <Route path='/' component={Start} />
        </Switch>
    </App>
</Router>;
