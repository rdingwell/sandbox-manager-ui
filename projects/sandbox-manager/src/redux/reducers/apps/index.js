import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);

    return state;
};
