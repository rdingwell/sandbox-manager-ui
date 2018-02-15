import React, { Component } from 'react';
import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../../axiox';


import classes from './Toolbar.css';
import SideNavToggle from '../SideNav/SideNavToggle/SideNavToggle';
import SandboxSelector from './SandboxSelector/SandboxSelector';
import SandboxTitle from './SandboxTitle/SandboxTitle';
import Logo from '../../Logo/Logo';
import User from '../Toolbar/User/User';


class Toolbar extends Component {

  render() {
    const style = {
      display : 'inline-flex',
      //textShadow: "rgba(0,0,0,.8) 0 -1px 0",
      //boxShadow: '0 1px 1px #273546',
      width: 48,
      backgroundColor: '#1564bf',
      height: '100%',
      boxSizing: 'border-box'
    };

    let sideNavToggle = null;
    let sandboxSelector = "";
    let menuSelection = ""

    let sandboxId = localStorage.getItem("sandboxId");
    sandboxId ='yes';
    if(sandboxId){
      sideNavToggle = (<SideNavToggle click={this.props.click}/>);
      // sandboxSelector = (<SandboxSelector style={selectorStyle}/>);
      menuSelection = (<div style={style}> {sideNavToggle} </div>)
    }

    return(
      <header className={classes.Toolbar}>
        {menuSelection}
        <Logo/>
        {sandboxSelector}
        <SandboxTitle/>
        <User user={this.props.user}></User>
      </header>
    );
  };
}


const mapStateToProps = state => {
  return {
    sandbox : state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[0]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectSandbox: (sandboxId) => dispatch( actions.selectSandbox(sandboxId) )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Toolbar, axios ) )

