/**
 * Given a patient returns his name
 * @export
 * @param {Fhir.Patient} patient
 * @returns {string}
 */
import moment from "moment";

const PERSONA_COOKIE_NAME = "hspc-persona-token";

export function getPatientName(patient) {
    const names = patient.name;

    if (!names || !names.length) {
        return "";
    }

    // if multiple names exist pick the most resent one and prefer official names
    if (names.length > 1) {
        names.sort((a, b) => {
            let score = 0;

            if (a.period && a.period.end && b.period && b.period.end) {
                const endA = moment(a.period.end);
                const endB = moment(b.period.end);
                score = endA.valueOf() - endB.valueOf();
            }

            if (a.use === "official") {
                score += 1;
            }

            if (b.use === "official") {
                score -= 1;
            }

            return score;
        });
    }

    const name = names[names.length - 1];
    const out = [];

    if (Array.isArray(name.prefix)) {
        out.push(name.prefix.join(" "));
    }

    if (Array.isArray(name.given)) {
        out.push(name.given.join(" "));
    }

    if (Array.isArray(name.family)) {
        out.push(name.family.join(" "));
    } else {
        out.push(name.family);
    }

    if (Array.isArray(name.suffix)) {
        out.push(name.suffix.join(" "));
    }

    return out.join(" ");
}

export function call(url, token, method = "GET", body) {
    let headers = {'Content-Type': 'application/json;charset=UTF-8'};
    token && (headers.Authorization = `Bearer ${token}`);
    return new Promise((resolve, reject) => {
        let props = {method, headers};
        body && (props.body = JSON.stringify(body));
        fetch(url, props)
            .then(response => response.json())
            .then(responseData => {
                resolve(responseData);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function getPersonaCookie() {
    return getCookie(PERSONA_COOKIE_NAME);
}

export function removePersonaCookie() {
    getCookie(PERSONA_COOKIE_NAME) && deleteCookie(PERSONA_COOKIE_NAME);
}

export function setPersonaCookie(jwt) {
    setCookie(PERSONA_COOKIE_NAME, jwt);
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

function deleteCookie(cname) {
    const url = window.location.host.split(":")[0].split(".").slice(-2).join(".");
    document.cookie = `${cname}=${JSON.stringify({})}; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${url}; path=/`;
}

function setCookie(cname, data) {
    const url = window.location.host.split(":")[0].split(".").slice(-2).join(".");
    const date = new Date();

    console.log(url);

    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `${cname}=${data}; expires=${date["toGMTString"]()}; domain=${url}; path=/`;
}
