import React from 'react';

const labelStyle = {
    width: '90px',
    display: 'inline-block',
    color: 'gray'
};

const valueStyle = {
    display: 'inline-block'
};


const labelValuePair = (props) => (
    <div>
        <div style={labelStyle}>
            {props.label}
        </div>
        <div style={valueStyle}>
            {props.value}
        </div>
    </div>
);

export default labelValuePair;

