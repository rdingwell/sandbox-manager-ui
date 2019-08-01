export function delay(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
}

export function getDeepValue(obj, path) {
    return path.split(".").reduce((out, key) => out ? out[key] : undefined, obj);
}
