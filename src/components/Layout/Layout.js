import React, { Component } from 'react';

import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideNav from '../Navigation/SideNav/SideNav';

import Aux from '../../hoc/Aux/Aux';

class Layout extends Component{

    state = {
        sideBarOpened: true
    };

    drawerToggleClickedHandler = () => {
        this.setState((prevState) => {
            return {sideBarOpened : !prevState.sideBarOpened}
        });
    };

    render()  {
        return (
            <Aux>
                <Toolbar click={this.drawerToggleClickedHandler} />
                <SideNav open={this.state.sideBarOpened} />
                <main style={{top: '64px', left: '256px', position: 'relative', backgroundColor: '#e5f0fb'}}>{this.props.children}</main>
            </Aux>
        )
    };
}
export default Layout;