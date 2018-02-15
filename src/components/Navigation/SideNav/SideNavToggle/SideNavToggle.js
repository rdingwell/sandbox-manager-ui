import React from 'react';

const style = {
  paddingTop: '22px',
  width: '100%',
  cursor: 'pointer'
}

const sideNavToggle = (props) => (
    <div style={style} onClick={props.click}><i className="fa fa-bars" aria-hidden="true"></i></div>
);

export default sideNavToggle;