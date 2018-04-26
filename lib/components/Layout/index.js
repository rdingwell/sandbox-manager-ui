import React, { Component } from 'react';
import Toolbar from '../Navigation/Toolbar';
import SideNav from '../Navigation/SideNav';
import Footer from '../Navigation/Footer';
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

    render () {
        let showSideNav = this.props.history.location.pathname !== '/';
        let mainClasses = 'layout-main' + (this.state.sideBarOpened ? ' open' : '');
        let isLaunch = this.props.path === '/launchApp';

        return isLaunch
            ? <Aux>
                {this.props.children}
            </Aux>
            : <Aux>
                <Toolbar click={this.drawerToggleClickedHandler} user={this.props.user} showSideNav={showSideNav} sandbox={this.props.sandbox} />
                {showSideNav && <SideNav open={this.state.sideBarOpened} sandboxes={this.props.sandboxes} sandbox={this.props.sandbox}
                                         sandboxApiUrl={this.props.sandboxApiUrl} />}
                <main className={mainClasses}>{this.props.children}</main>
                <Footer />
            </Aux>
    }

    drawerToggleClickedHandler = () => {
        this.setState({ sideBarOpened: !this.state.sideBarOpened });
    };
}

const mapStateToProps = state => {
    let sandboxApiUrl = state.config.xsettings.data.sandboxManager && state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
    sandboxApiUrl && sandboxApiUrl.indexOf('//') >= 0 && (sandboxApiUrl = sandboxApiUrl.split('//')[1]);

    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === state.sandbox.selectedSandbox),
        sandboxes: state.sandbox.sandboxes,
        user: state.users.oauthUser,
        sandboxApiUrl
    }
};

export default connect(mapStateToProps)(withRouter(Layout));
