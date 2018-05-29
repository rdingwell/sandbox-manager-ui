import React from 'react';

import './Backdrop.less';

export default (props) => (
    props.show ? <div className="backdrop" onClick={props.clicked}></div> : null
);;
