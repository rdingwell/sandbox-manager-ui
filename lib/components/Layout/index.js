import React, { Component } from 'react';
import Toolbar from '../Navigation/Toolbar';
import SideNav from '../Navigation/SideNav';
import { withRouter } from 'react-router';
import { CircularProgress, Dialog } from 'material-ui';
import Aux from '../../hoc/Aux/Aux';
import { connect } from 'react-redux';
import muiThemeable from "material-ui/styles/muiThemeable";

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
        let isRoot = path === '/';
        let isDashboard = path === '/dashboard';
        let showSideNav = !isRoot && !isDashboard && this.props.sandbox;
        let mainClasses = 'layout-main' + (this.state.sideBarOpened && showSideNav ? ' open' : '') + (isRoot || isDashboard ? ' no-padding' : '') + (isRoot ? ' full-height' : '');
        let isLaunch = this.props.path === '/launchApp';
        let mainStyles = { backgroundColor: this.props.muiTheme.palette.primary5Color, color: this.props.muiTheme.palette.primary3Color };

        return isLaunch
            ? <Aux>
                {this.props.children}
            </Aux>
            : !isRoot
                ? <Aux>
                    <Dialog paperClassName='creating-sandbox-dialog' modal open={this.props.isSandboxCreating}>
                        <p>
                            Creating sandbox
                        </p>
                        <CircularProgress size={80} thickness={5}/>
                    </Dialog>
                    <Toolbar isDashboard={isDashboard} showSideNav={showSideNav} {...this.props} click={this.drawerToggleClickedHandler}/>
                    {showSideNav && <SideNav open={this.state.sideBarOpened} sandbox={this.props.sandbox} click={this.drawerToggleClickedHandler}
                                             sandboxApiUrl={this.props.sandboxApiUrl} screen={this.props.screen} theme={this.props.muiTheme}/>}
                    <main className={mainClasses} style={mainStyles}>
                        {this.showExpirationMessageBanner()}
                        {this.props.children}
                    </main>
                </Aux>
                : <Aux>
                    <main className={mainClasses} style={mainStyles}>
                        {this.props.children}
                    </main>
                </Aux>
    }

    drawerToggleClickedHandler = () => {
        this.setState({ sideBarOpened: !this.state.sideBarOpened });
    };

    showExpirationMessageBanner () {
        if (this.props.sandbox) {
            const exprDay = new Date(this.props.sandbox.expirationDate);
            const today = new Date();
            if (exprDay != null) {
                if (exprDay >= today) {
                    return <header className="message-bar"> {this.props.sandbox.expirationMessage} </header>;
                }
                else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };
}

const mapStateToProps = state => {
    let sandboxApiUrl = state.config.xsettings.data.sandboxManager && state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
    sandboxApiUrl && sandboxApiUrl.indexOf('//') >= 0 && (sandboxApiUrl = sandboxApiUrl.split('//')[1]);

    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        sandboxes: state.sandbox.sandboxes,
        isSandboxCreating: state.sandbox.creatingSandbox,
        user: state.users.oauthUser,
        sandboxApiUrl,
        screen: state.app.screen,
        terms: state.app.terms,
        invitations: state.sandbox.userInvites
    }
};

export default muiThemeable()(connect(mapStateToProps)(withRouter(Layout)));
