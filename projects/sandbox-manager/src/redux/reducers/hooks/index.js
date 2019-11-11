import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);
    switch (action.type) {
        case actionTypes.HOOKS_EXECUTING:
            state.executing = action.payload.executing;
            break;
        case actionTypes.HOOKS_SET_CARDS:
            // state.cards = cards.concat(action.payload.cards);
            state.cards = action.payload.cards;
            state.executionTime = action.payload.cards.time;
            state.executing = false;
            break;
        case actionTypes.HOOKS_SERVICE_LOADING:
            state.servicesLoading = action.payload.loading;
            break;
        case actionTypes.HOOKS_SET_SERVICES:
            state.services = action.payload.services;
            break;
        case actionTypes.HOOKS_REMOVE_CARDS:
            state.cards = {cards: [], time: 0};
            break;
        case "persist/REHYDRATE":
            state = action.payload && action.payload.hooks ? action.payload.hooks : state;
            state.hookContexts = initialState.hookContexts;
            state.servicesLoading = false;
            state.services = [];
            break;
    }

    return state;
};
