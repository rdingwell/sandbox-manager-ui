import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import config from "./reducers/config/";
import fhir from "./reducers/fhir/";
import ui from "./reducers/ui/";
import sandbox from "./reducers/sandbox";
import users from "./reducers/users";
import apps from "./reducers/apps";
import fhirauth from "./reducers/fhirauth";
import patient from "./reducers/patient";
import uiInit from "./reducers/ui/init";

import { customizeTheme } from "../lib/";
import { loadState, saveState } from "./persist-state";

const throttle = require("lodash.throttle");

function filterState(state, whiteList) {
    let filteredState = state;
    if (whiteList && whiteList.length) {
        filteredState = (whiteList).reduce((acc, key) => ({ ...acc, [key]: state[key] }), {});
    }
    return filteredState;
}

export default function (cfg) {
    const reducers = combineReducers({ config, fhir, ui, sandbox, users, apps, fhirauth, patient });

    let persistedState;
    if (cfg.persist) {
        persistedState = loadState();
        persistedState.ui = persistedState.ui || uiInit;
        persistedState.ui.theme = customizeTheme(uiInit.theme);
        process.env.NODE_ENV !== "production" && console.log("::: persistedState:", persistedState);
    }

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const middlewares = [thunk];
    cfg.logger && middlewares.push(createLogger());

    const store = createStore(
        reducers,
        persistedState,
        composeEnhancers(applyMiddleware(...middlewares)),
    );

    const whiteList = cfg.whiteList || [];
    const debounce = cfg.debounce || 1500;
    cfg.persist && store.subscribe(throttle(
        () => saveState(filterState(store.getState(), whiteList)),
        debounce,
    ));

    return store;
}
