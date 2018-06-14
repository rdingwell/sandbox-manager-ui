import React from 'react';

const labelStyle = {
    width: '90px',
    display: 'inline-block'
};

const valueStyle = {
    display: 'inline-block'
};

const getName = (name) => {
    let nameVal =  name.given[0];
    if (name.given.length > 1){
        nameVal += " " + name.given[1];
    }
    nameVal += " " + name.family;
    return nameVal;
};

const labelValuePair = (props) => (
    <div>
        <div style={labelStyle}>
            {props.label}
        </div>
        <div style={valueStyle}>
            {getName(props.value)}
        </div>
    </div>
);

export default labelValuePair;

