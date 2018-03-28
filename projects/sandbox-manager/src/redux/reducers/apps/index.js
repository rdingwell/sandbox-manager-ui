import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    switch (action.type) {
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.apps : state;
            break;
    }

    return state;
};
