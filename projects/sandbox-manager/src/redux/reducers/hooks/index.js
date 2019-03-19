import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);
    let cards = state.cards.slice();
    switch (action.type) {
        case actionTypes.HOOKS_EXECUTING:
            state.executing = action.payload.executing;
            break;
        case actionTypes.HOOKS_SET_CARDS:
            state.cards = cards.concat(action.payload.cards);
            break;
        case actionTypes.HOOKS_REMOVE_CARD:
            cards.splice(action.payload.cardIndex, 1);
            state.cards = cards;
            break;
        case "persist/REHYDRATE":
            state = action.payload && action.payload.hooks ? action.payload.hooks : state;
            break;
    }

    return state;
};
