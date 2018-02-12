import React, { Component } from 'react';

import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideNav from '../Navigation/SideNav/SideNav';
import Footer from '../Navigation/Footer/Footer';

import Aux from '../../hoc/Aux/Aux';

import { connect } from 'react-redux';


class Layout extends Component{

    state = {
        sideBarOpened: true,
        leftMargin: '256px'
    };

    componentWillMount () {
    }

    componentDidMount() {
        this.setState({sideBarOpened: localStorage.getItem('sandboxId') != null,
        leftMargin: localStorage.getItem('sandboxId') != null ? '256px' : '0'});
    }



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
            height: '100vh'
        };


        return (
            <Aux>
                <Toolbar click={this.drawerToggleClickedHandler} user={this.props.user}/>
                <SideNav open={this.state.sideBarOpened} />
                <main style={mainStyle}>{this.props.children}</main>
                <div style={{clear: 'both'}}></div>
                <Footer></Footer>
            </Aux>
        )
    };
}

const mapStateToProps = state => {
    return {
        sandbox : state.sandbox.selectedSandbox,
        user: state.user.oauthUser
    }
};

export default connect(mapStateToProps)(Layout);