import React from 'react';

const labelStyle = {
    width: '30%',
    display: 'inline-block'
};

const valueStyle = {
    width: '60%',
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

