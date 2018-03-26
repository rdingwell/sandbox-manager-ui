import React, { Component } from 'react';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideNav from '../Navigation/SideNav/SideNav';
import Footer from '../Navigation/Footer/Footer';
import { withRouter } from 'react-router'
import Aux from '../../hoc/Aux/Aux';
import { connect } from 'react-redux';

import './styles.less';

class Layout extends Component {

    constructor (props) {
        super(props);

        this.state = {
            sideBarOpened: false
        };
    }

    componentDidMount () {
        this.setState({
            sideBarOpened: localStorage.getItem('sandboxId') != null,
        });
    }

    drawerToggleClickedHandler () {
        this.setState({ sideBarOpened: !this.state.sideBarOpened });
    };

    render () {
        let showSideNav = this.props.history.location.pathname !== "/";
        let mainClasses = 'layout-main' + (this.state.sideBarOpened ? ' open' : '');

        return (
            <Aux>
                <Toolbar click={this.drawerToggleClickedHandler.bind(this)} user={this.props.user} showSideNav={showSideNav} />
                {showSideNav && <SideNav open={this.state.sideBarOpened} />}
                <main className={mainClasses}>{this.props.children}</main>
                <div style={{ clear: 'both' }}></div>
                <Footer> </Footer>
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

export default connect(mapStateToProps)(withRouter(Layout));
