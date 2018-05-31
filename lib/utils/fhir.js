import { getDeepValue as getPath } from "./misc";

const RESOURCES = [
    {
        "resourceType": "Patient",
        "displayValues": [
            { "label": "First Name", "path": "name.0.given.0" },
            { "label": "Last Name", "path": "name.0.family" },
            { "label": "Gender", "path": "gender" },
            { "label": "Birth Date", "path": "birthDate" }
        ],
        "patient": "this"
    },
    {
        "resourceType": "Observation",
        "displayValues": [
            { "label": "Observation Text", "path": "code.coding.0.display" },
            { "label": "Effective Date", "path": "effectiveDateTime" },
            { "label": "Value", "path": "valueQuantity.value" },
            { "label": "Value", "path": "valueCodeableConcept.coding.0.display" },
            { "label": "Value", "path": "valueString" },
            { "label": "Value", "path": "valueRange" },
            { "label": "Value", "path": "valueRatio" },
            { "label": "Value", "path": "valueTime" },
            { "label": "Value", "path": "valueDateTime" },
            { "label": "Value", "path": "valuePeriod" },
            { "label": "Category", "path": "category.coding.0.display" }
        ],
        "patient": "subject.reference"

    },
    {
        "resourceType": "Condition",
        "displayValues": [
            { "label": "Condition Text", "path": "code.coding.0.display" },
            { "label": "Onset Date", "path": "onsetDateTime" },
            { "label": "Category", "path": "category.coding.0.display" }
        ],
        "patient": "subject.reference"

    },
    {
        "resourceType": "Procedure",
        "displayValues": [
            { "label": "Procedure Text", "path": "code.coding.0.display" },
            { "label": "Date", "path": "performedDateTime" },
            { "label": "Category", "path": "category.coding.0.display" }
        ],
        "patient": "subject.reference"

    },
    {
        "resourceType": "AllergyIntolerance",
        "displayValues": [
            { "label": "Code", "path": "code.coding.0.display" },
            { "label": "Asserted", "path": "assertedDate" },
            { "label": "Category", "path": "category.0" },
            { "label": "Criticality", "path": "criticality" }
        ],
        "patient": "patient.reference"

    },
    {
        "resourceType": "Default",
        "displayValues": [
            { "label": "FHIR Id", "path": "id" }
        ],
        "patient": "patient.reference"

    }
];

export function parseEntry (entry) {
    let type = entry.resource.resourceType;
    let mappings = RESOURCES.find(i => i.resourceType === type);
    mappings = mappings ? mappings : RESOURCES.find(i => i.resourceType === 'Default');

    let getValue = (item, props) => {
        if (props[0] === 'this') {
            return item;
        }

        if (!!item) {
            let newItem = item[props[0]];
            props.shift();
            return props.length ? getValue(newItem, props) : newItem;
        } else {
            return null;
        }
    };

    let values = [];
    mappings.displayValues.map(val => {
        let value = getValue(entry.resource, val.path.split('.'));
        value && values.push({
            label: val.label,
            value
        })
    });

    return {props: values, patient: getValue(entry.resource, mappings.patient.split('.'))};
}

/**
 * Given an array of Coding objects finds and returns the one that contains
 * an MRN (using a code == "MR" check)
 * @export
 * @param {Fhir.Coding[]} codings
 * @returns {Fhir.Coding}
 */
export function findMRNCoding (codings) {
    if (Array.isArray(codings)) {
        return codings.find((coding) => coding.code === "MR");
    }
}

/**
 * Given an array of identifier objects finds and returns the one that contains
 * an MRN
 * @export
 * @param {Fhir.Identifier[]} identifiers
 * @returns {Fhir.Identifier}
 */
export function findMRNIdentifier (identifiers) {
    return identifiers.find((identifier) => !!findMRNCoding(getPath(identifier, "type.coding")));
}

export function getFHIRMetadata (smart) {
    return new Promise((resolve, reject) => {
        const capabilitiesURL = `${smart.server.serviceUrl}/metadata`;
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        fetch(capabilitiesURL, { headers })
            .then((response) => response.data)
            .then((data) => {
                const FHIRVersion = data.fhirVersion;
                const capabilities = getPath(data, "rest.0.resource");
                const capabilitiesParsed = {};
                const extensions = getPath(data, "rest.0.security.extension.0.extension");
                const tokenURLs = extensions ? extensions.find(item => item.url === "token") : null;
                const tokenURL = tokenURLs ? tokenURLs.valueUri : null;

                capabilities.forEach((res) => {
                    const supportedInteractions = res.interaction.map(interaction => interaction.code);
                    const interactions = {
                        read: supportedInteractions.indexOf("read") > -1,
                        vread: supportedInteractions.indexOf("vread") > -1,
                        update: supportedInteractions.indexOf("update") > -1,
                        delete: supportedInteractions.indexOf("delete") > -1,
                        historyInstance: supportedInteractions.indexOf("history-instance") > -1,
                        historyType: supportedInteractions.indexOf("history-type") > -1,
                        create: supportedInteractions.indexOf("create") > -1,
                        searchType: supportedInteractions.indexOf("search-type") > -1,
                    };
                    capabilitiesParsed[res.type] = interactions;
                });

                resolve({
                    parsed: {
                        version: FHIRVersion,
                        capabilities: capabilitiesParsed,
                        tokenURL,
                    },
                    raw: data,
                });
            });
    });
}

/**
 * Loads the Patient resource and returns it's demographics data
 * @export
 * @returns {Promise<PatientDemographics>}
 */
export function getPatientDemographics (smart) {
    return new Promise((resolve, reject) => {
        if (smart.patient) {
            smart.patient.read()
                .then(
                    (data) => {
                        if ("active" in data && !data.active) {
                            return reject(new Error("This patient is not active"));
                        }

                        if (!data.birthDate) {
                            return reject(new Error("Patient birthDate is required"));
                        }

                        if (!data.gender) {
                            return reject(new Error("Patient gender is required"));
                        }

                        if (!data.name || !Array.isArray(data.name) || !data.name.length) {
                            return reject(new Error("Patient name is required"));
                        }

                        try {
                            const out = {
                                smartId: data.id,
                                birthDate: data.birthDate,
                                gender: data.gender,
                                MRN: getPatientMRN(data),
                                name: getPatientName(data),
                                address: parseAddress(data),
                                email: parseEmail(data),
                                names: parseNames(data),
                                phone: parsePhone(data),

                            };
                            resolve(out);
                        } catch (ex) {
                            reject(ex);
                        }
                    },
                    reject,
                );
        } else {
            reject(new Error("No patient found in context"));
        }
    });
}

/**
 * Given a patient returns his MRN
 * @export
 * @param {Fhir.Patient} patient
 * @returns {string}
 */
export function getPatientMRN (patient) {
    let mrn = null;
    if (Array.isArray(patient.identifier) && patient.identifier.length) {
        mrn = findMRNIdentifier(patient.identifier);
        if (mrn) {
            return mrn.value;
        }
    }
    return mrn;
}

/**
 * Given a patient returns his name
 * @export
 * @param {Fhir.Patient} patient
 * @returns {string}
 */
export function getPatientName (patient) {
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

export function parseAddress (resource) {
    const addresses = resource.address || [];
    return addresses.map((address) => {
        return {
            use: address.use,
            val: [
                (address.line || []).join(" "),
                address.city,
                address.state,
                address.postalCode,
                address.country,
            ].join(" "),
        };
    });
}

export function parseEmail (resource) {
    const telecom = resource.telecom || [];
    return telecom
        .filter((r) => r.system === "email")
        .map((r) => {
            return {
                use: r.use,
                val: r.value
            };
        });
}

export function parseNames (resource) {
    let names = resource.name || [];
    if(!Array.isArray(names)) {
        names = [names];
    }
    return names.map((name) => {
        return {
            use: name.use,
            val: [
                Array.isArray(name.given) ? name.given.join(" ") : name.given,
                Array.isArray(name.family) ? name.family.join(" ") : name.family,
            ].filter((name) => !!name)
                .join(" "),
        };
    });
}

export function parsePhone (resource) {
    const telecom = resource.telecom || [];
    return telecom
        .filter((r) => r.system === "phone")
        .map((r) => {
            return {
                use: r.use,
                val: r.value
            };
        });
}
