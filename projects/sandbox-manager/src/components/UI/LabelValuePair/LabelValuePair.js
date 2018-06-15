import React from 'react';

let labelStyle = {
    width: '90px',
    display: 'inline-block',
    color: 'gray'
};

let valueStyle = {
    display: 'inline-block'
};

let additionalStyles = {
    textAlign: 'right',
    width: '120px',
    marginRight: '10px'
};

const labelValuePair = (props) => (
    <div>
        <div style={props.large ? Object.assign({}, labelStyle, additionalStyles) : labelStyle}>
            {props.label}
        </div>
        <div style={valueStyle}>
            {props.value}
        </div>
    </div>
);

export default labelValuePair;

