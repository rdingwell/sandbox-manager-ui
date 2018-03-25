import React from 'react';

const labelStyle = {
    width: '30%',
    float: 'left'
};

const valueStyle = {
    width: '60%',
    float: 'right'
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

