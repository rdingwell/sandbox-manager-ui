import React from 'react';
import bpIconImage from '../../assets/images/bpIcon.jpeg';

const style = {
    position: 'fixed',
    paddingLeft: '10px',
    paddingTop: '5px',
    width: '30px'
}

const bpicon = (props) => (
        <img src={bpIconImage} alt="BP-Centiles" style={style}/>
);

export default bpicon;