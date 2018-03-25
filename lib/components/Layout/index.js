import React, { Component } from 'react';

import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideNav from '../Navigation/SideNav/SideNav';
import Footer from '../Navigation/Footer/Footer';

import Aux from '../../hoc/Aux/Aux';

import { connect } from 'react-redux';

class Layout extends Component {

    constructor (props) {
        super(props);

        this.state = {
            sideBarOpened: true,
            leftMargin: '200px'
        };
    }

    componentDidMount () {
        this.setState({
            sideBarOpened: localStorage.getItem('sandboxId') != null,
            leftMargin: localStorage.getItem('sandboxId') != null ? '200px' : '0'
        });
    }


    drawerToggleClickedHandler = () => {
        const margin = this.state.sideBarOpened ? '0' : '200px';
        this.setState({
            sideBarOpened: !this.state.sideBarOpened,
            leftMargin: margin
        })
    };


    render () {
        const mainStyle = {
            padding: 10,
            marginTop: 64,
            marginLeft: this.state.leftMargin,
            backgroundColor: 'rgb(247, 251, 255)',
            height: '100vh',
            transition: 'transform 0.5s ease-out'
        };

        return (
            <Aux>
                <Toolbar click={this.drawerToggleClickedHandler} user={this.props.user} />
                <SideNav open={this.state.sideBarOpened} />
                <main style={mainStyle}>{this.props.children}</main>
                <div style={{ clear: 'both' }}></div>
                <Footer></Footer>
            </Aux>
        )
    };
}

const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.selectedSandbox,
        user: state.users.oauthUser
    }
};

export default connect(mapStateToProps)(Layout);
