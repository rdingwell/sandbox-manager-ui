import 'babel-polyfill';
import 'whatwg-fetch';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router from './router/';
import configStore from './redux/';

// import registerServiceWorker from '../../../lib/utils/registerServiceWorker';

import supportedPatientResources from './assets/config/supported-patient-resources_3_0_1.json';

import './style/main.less';

localStorage.setItem('resources', JSON.stringify(supportedPatientResources));

window.Highcharts = require('highcharts');

configStore()
    .then(store => {
        let provider = <Provider store={store}>
            {Router}
        </Provider>;

        render(provider, document.getElementById('app'));
        // registerServiceWorker();
    });
