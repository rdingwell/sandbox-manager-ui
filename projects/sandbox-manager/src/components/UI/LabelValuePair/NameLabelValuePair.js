import React from 'react';

const labelStyle = {
    width: '30%',
    display: 'inline-block'
};

const valueStyle = {
    width: '60%',
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

