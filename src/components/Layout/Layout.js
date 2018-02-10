import React, { Component } from 'react';

import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideNav from '../Navigation/SideNav/SideNav';

import Aux from '../../hoc/Aux/Aux';

class Layout extends Component{

    state = {
        sideBarOpened: true,
        leftMargin: '256px'
    };

    drawerToggleClickedHandler = () => {
        const margin = this.state.sideBarOpened ? '0' : '256px';
        this.setState((prevState) => {
            return {
                sideBarOpened : !prevState.sideBarOpened,
                leftMargin: margin
            }
        });
    };



    render()  {

        const mainStyle = {
            padding: 10,
            marginTop: 64,
            marginLeft: this.state.leftMargin,
            backgroundColor: '#e5f0fb',
            minHeight: '100%'
    };


        return (
            <Aux>
                <Toolbar click={this.drawerToggleClickedHandler} />
                <SideNav open={this.state.sideBarOpened} />
                <main style={mainStyle}>{this.props.children}</main>
                <div style={{clear: 'both'}}></div>
            </Aux>
        )
    };
}
export default Layout;