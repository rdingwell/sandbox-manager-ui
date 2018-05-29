import React from 'react';
import bpCentIcon from '../../assets/images/bpcenticon.png';

const style = {
    position: 'fixed',
    paddingLeft: '10px',
    paddingTop: '5px',
    width: '30px'
}

const bpcenticon = (props) => (
    <img src={bpCentIcon} alt="BP-Centiles" style={style}/>
);

export default bpcenticon;