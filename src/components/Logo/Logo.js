import React from 'react';

import classes from './Logo.css';
import hspcLogo from '../../assets/images/hspc-sndbx-logo-wh@2x.png';


const logo = (props) => (
    <div className={classes.Logo}>
        <img src={hspcLogo} alt="HSPC Logo"/>
    </div>
);

export default logo;