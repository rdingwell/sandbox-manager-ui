import React from 'react';

const getName = (name) => {
    let nameVal =  name.given[0];
    if (name.given.length > 1){
        nameVal += " " + name.given[1];
    }
    nameVal += " " + name.family;
    return nameVal;
};

const patientFullName = (props) => (
    <span>{getName(props.name)}</span>
);

export default patientFullName;