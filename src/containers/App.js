import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Apps from '../containers/Apps/Apps';
import Patients from '../containers/Patients/Patients';
import Practitioners from '../containers/Practitioners/Practitioners';
import LaunchScenario from '../containers/LaunchScenario/LaunchScenario';
import Settings from '../containers/Settings/Settings';
import EHRIntegration from '../containers/EHRIntegration/EHRIntegration';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UserManagement from '../containers/UserManagement/UserManagement';
import Dashboard from '../containers/Dashboard/Dashboard';
import Start from '../containers/Start/Start';
import AfterAuth from '../containers/AfterAuth/AfterAuth';


import './App.css';


class App extends Component {
  render() {
    return (
        <MuiThemeProvider>
            <div>
                <Layout>
                    <Switch>
                        <Route path='/apps' component={Apps}/>
                        <Route path='/launch' component={LaunchScenario}/>
                        <Route path='/patients' component={Patients} />
                        <Route path='/practitioners' component={Practitioners} />
                        <Route path='/personas' component={Practitioners} />
                        <Route path='/data-manager' component={Practitioners} />
                        <Route path='/user-management' component={UserManagement} />
                        <Route path='/integration' component={EHRIntegration} />
                        <Route path='/settings' component={Settings} />
                        <Route path='/dashboard' component={Dashboard} />
                        <Route path='/start' component={Start} />
                        <Route path='/after-auth' component={AfterAuth} />
                        <Route path='/' component={Dashboard} />
                    </Switch>
                </Layout>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;
