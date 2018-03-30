import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import config from "./reducers/config/";
import fhir from "./reducers/fhir/";
import ui from "./reducers/ui/";
import sandbox from "./reducers/sandbox";
import users from "./reducers/users";
import apps from "./reducers/apps";
import fhirauth from "./reducers/fhirauth";
import persona from "./reducers/persona";
import app from "./reducers/app";

const persistConfig = {
    key: 'root',
    storage
};
const reducers = combineReducers({ config, fhir, ui, sandbox, users, apps, fhirauth, persona, app });

export default function () {
    return new Promise(resolve => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const middlewares = [thunk];

        const persistedReducer = persistReducer(persistConfig, reducers);

        let store = createStore(persistedReducer, {}, composeEnhancers(applyMiddleware(...middlewares)));
        persistStore(store, {}, () => {
            resolve(store);
        });
    });
}
