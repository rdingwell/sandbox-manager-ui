import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sandboxReducer from './store/reducers/sandbox';
import userReducer from './store/reducers/user';
import fhirReducer from './store/reducers/fhirauth';
import appsReducer from './store/reducers/apps';
import patientReducer from './store/reducers/patient';
import appConfig from './assets/config/sandbox-manager'
import observationReducer from './store/reducers/observation';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    sandbox: sandboxReducer,
    user: userReducer,
    fhir : fhirReducer,
    apps : appsReducer,
    patient: patientReducer,
    observation : observationReducer
});

const store = createStore(rootReducer, {}, composeEnhancers(
    applyMiddleware(thunk)
));

localStorage.setItem('config', JSON.stringify(appConfig));

window.Highcharts = require('highcharts');

const app =  (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
