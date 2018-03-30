import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "../components/App/";
import Apps from '../components/containers/Apps';
import Persona from '../components/containers/Persona';
import LaunchScenario from '../components/containers/LaunchScenario/LaunchScenario';
import Settings from '../components/containers/Settings/Settings';
import EHRIntegration from '../components/containers/EHRIntegration/EHRIntegration';
import UserManagement from '../components/containers/UserManagement/UserManagement';
import Dashboard from '../components/containers/Dashboard/Dashboard';
import Start from '../components/containers/Start';
import AfterAuth from '../components/containers/AfterAuth/AfterAuth';
import CreateSandbox from "../components/containers/CreateSandbox";

export default <Router>
    <App>
        <Switch>
            <Route path='/apps' component={Apps} />
            <Route path='/launch' component={LaunchScenario} />
            <Route path='/patients' component={Persona} />
            <Route path='/practitioners' component={Persona} />
            <Route path='/personas' component={Persona} />
            <Route path='/data-manager' component={Persona} />
            <Route path='/user-management' component={UserManagement} />
            <Route path='/integration' component={EHRIntegration} />
            <Route path='/settings' component={Settings} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/start' component={Start} />
            <Route path='/after-auth' component={AfterAuth} />
            <Route path='/create-sandbox' component={CreateSandbox} />
            <Route path='/' component={Start} />
        </Switch>
    </App>
</Router>;
