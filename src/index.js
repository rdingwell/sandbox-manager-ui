import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    sandbox: sandboxReducer,
    user: userReducer,
    fhir : fhirReducer,
    apps : appsReducer
});


const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app =  (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
