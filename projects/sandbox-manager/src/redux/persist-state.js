export function loadState() {
    try {
        const serialized = window.sessionStorage.getItem("reduxState");
        if (serialized === null) {
            // Reducers will be initialized with its initial values
            // return undefined;
            return {};
        }
        return JSON.parse(serialized);
    } catch (reason) {
        // Reducers will be initialized with its initial values
        // return undefined;
        return {};
    }
}

export function saveState(state) {
    try {
        // Redux state should always be serializable
        const serialized = JSON.stringify(state);
        window.sessionStorage.setItem("reduxState", serialized);
    } catch (reason) {
        process.env.NODE_ENV !== "test"
            && console.error(
                "::: savePersistedState() in sessionStorage failed with reason:",
                reason,
            )
        ;
    }
}
