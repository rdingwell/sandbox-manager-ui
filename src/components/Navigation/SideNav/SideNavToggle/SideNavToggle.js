import React from 'react';

const sideNavToggle = (props) => (
    <div onClick={props.click}><i className="fa fa-bars" aria-hidden="true"></i></div>
);

export default sideNavToggle;