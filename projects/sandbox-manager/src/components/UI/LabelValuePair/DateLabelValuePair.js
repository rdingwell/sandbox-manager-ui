import React from 'react';

const labelStyle = {
    width: '90px',
    display: 'inline-block'
};

const valueStyle = {
    display: 'inline-block'
};

const getDate = (date) => {
    let dateObj = Date.parse(date);
    return dateObj.toString()
};


const labelValuePair = (props) => (
    <div>
        <div style={labelStyle}>
            {props.label}
        </div>
        <div style={valueStyle}>
            {getDate(props.value)}
        </div>
    </div>
);

export default labelValuePair;

