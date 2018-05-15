import React, { Component } from 'react';
import Toolbar from '../Navigation/Toolbar';
import SideNav from '../Navigation/SideNav';
import Footer from '../Navigation/Footer';
import { withRouter } from 'react-router';
import { CircularProgress, Dialog } from 'material-ui';
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
        let path = this.props.history.location.pathname;
        let showSideNav = path !== '/' && path !== '/dashboard' && this.props.sandbox;
        let mainClasses = 'layout-main' + (this.state.sideBarOpened && showSideNav ? ' open' : '');
        let isLaunch = this.props.path === '/launchApp';

        return isLaunch
            ? <Aux>
                {this.props.children}
            </Aux>
            : <Aux>
                <Dialog paperClassName='creating-sandbox-dialog' modal open={this.props.isSandboxCreating}>
                    <p>
                        Creating sandbox
                    </p>
                    <CircularProgress size={80} thickness={5} />
                </Dialog>
                <Toolbar click={this.drawerToggleClickedHandler} user={this.props.user} showSideNav={showSideNav} sandbox={this.props.sandbox} sandboxes={this.props.sandboxes}
                         selectSandbox={this.props.selectSandbox} onAuthInit={this.props.onAuthInit} />
                {showSideNav && <SideNav open={this.state.sideBarOpened} sandbox={this.props.sandbox}
                                         sandboxApiUrl={this.props.sandboxApiUrl} screen={this.props.screen} />}
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
        isSandboxCreating: state.sandbox.creatingSandbox,
        user: state.users.oauthUser,
        sandboxApiUrl,
        screen: state.app.screen
    }
};

export default connect(mapStateToProps)(withRouter(Layout));
