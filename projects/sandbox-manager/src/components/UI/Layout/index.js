import React, {Component} from 'react';
import Toolbar from '../Navigation/Toolbar';
import SideNav from '../Navigation/SideNav';
import {withRouter} from 'react-router';
import {CircularProgress, Dialog, IconButton} from '@material-ui/core';
import {withTheme} from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import Aux from '../hoc/Aux/Aux';
import {connect} from 'react-redux';

import './styles.less';
import {bindActionCreators} from "redux";
import {loadServices, loadTerms} from "../../../redux/action-creators";

class Layout extends Component {

    constructor(props) {
        super(props);

        let showNotification = !sessionStorage.getItem(`showSandboxNotification-${sessionStorage.sandboxId}`);

        this.state = {
            sideBarOpened: false,
            showNotification
        };
    }

    componentDidMount() {
        this.setState({
            sideBarOpened: localStorage.getItem('sandboxId') != null,
        });
        !!this.props.sandbox && this.props.loadServices();
    }

    render() {
        let theme = this.props.theme;
        let path = this.props.history.location.pathname;
        let isRoot = path === '/';
        let isDashboard = path === '/dashboard' || this.props.isSingeHook;
        let showSideNav = !isRoot && !isDashboard && this.props.sandbox;
        let mainClasses = 'layout-main' + (this.state.sideBarOpened && showSideNav ? ' open' : '') + (isRoot || isDashboard ? ' no-padding' : '') + (isRoot ? ' full-height' : '');
        let isLaunch = this.props.path === '/launchApp';
        let mainStyles = {backgroundColor: '#F5F5F5', color: '#757575'};

        return isLaunch
            ? <Aux>
                {this.props.children}
            </Aux>
            : !isRoot
                ? <Aux>
                    <Dialog classes={{paper: 'full-loader-wrapper'}} open={this.props.isSandboxCreating}>
                        <p data-qa='sandbox-creating-loader'>
                            Creating sandbox
                        </p>
                        <CircularProgress size={80} thickness={5}/>
                    </Dialog>
                    <Toolbar isDashboard={isDashboard} showSideNav={showSideNav} {...this.props} click={this.drawerToggleClickedHandler}
                             loading={this.props.loadingNotifications || this.props.userInvitesLoading}/>
                    {showSideNav && <SideNav open={this.state.sideBarOpened} sandbox={this.props.sandbox} click={this.drawerToggleClickedHandler} defaultUser={this.props.defaultUser}
                                             sandboxApiUrl={this.props.sandboxApiUrl} screen={this.props.screen} theme={this.props.theme} ehrUrl={this.props.ehrUrl}
                                             hooks={this.props.hooks}/>}
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
        this.setState({sideBarOpened: !this.state.sideBarOpened});
    };

    showExpirationMessageBanner() {
        if (this.props.sandbox) {
            const exprDay = new Date(this.props.sandbox.expirationDate);
            const exprMessage = this.props.sandbox.expirationMessage;
            const today = new Date();
            if (exprDay != null) {
                if (exprDay >= today && this.state.showNotification) {
                    if (exprMessage.indexOf('</a>') != -1) {
                        let firstPart = exprMessage.split('<a')[0];
                        let hrefIndex = exprMessage.indexOf('href');
                        let firstAIndex = exprMessage.indexOf('>')
                        let secondAIndex = exprMessage.indexOf('</a>');
                        let linkUrl = exprMessage.slice(hrefIndex + 6, firstAIndex - 1);
                        let linkMessage = exprMessage.slice(firstAIndex + 1, secondAIndex);
                        let lastPart = exprMessage.slice(secondAIndex + 4, this.props.sandbox.expirationMessage.length);
                        return <header className="message-bar"><span style={{maxWidth: '90%', marginRight: '10%', display: 'inline-block'}}> {firstPart}
                            <a target="_blank" href={linkUrl}>{linkMessage}</a> {lastPart} </span>
                            <IconButton onClick={this.removeNotification}><CloseIcon/></IconButton></header>;
                    } else {
                        return <header className="message-bar">
                            <span style={{maxWidth: '90%', marginRight: '10%', display: 'inline-block'}}>{exprMessage}</span>
                            <IconButton onClick={this.removeNotification}><CloseIcon/></IconButton></header>;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };

    removeNotification = () => {
        sessionStorage.setItem(`showSandboxNotification-${sessionStorage.sandboxId}`, true);
        this.setState({showNotification: false});
    };
}

const mapStateToProps = state => {
    let sandboxApiUrl = state.config.xsettings.data.sandboxManager && state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
    sandboxApiUrl && sandboxApiUrl.indexOf('//') >= 0 && (sandboxApiUrl = sandboxApiUrl.split('//')[1]);
    let ehrUrl = state.config.xsettings.data.sandboxManager
        ? state.config.xsettings.data.sandboxManager.ehrSimulator
        : '';

    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        ehrUrl,
        loadingNotifications: state.sandbox.loadingNotifications,
        userInvitesLoading: state.sandbox.userInvitesLoading,
        sandboxes: state.sandbox.sandboxes,
        defaultUser: state.sandbox.defaultUser,
        isSandboxCreating: state.sandbox.creatingSandbox,
        user: state.users.oauthUser,
        sandboxApiUrl,
        screen: state.app.screen,
        terms: state.app.terms,
        invitations: state.sandbox.userInvites,
        loginInfo: state.sandbox.loginInfo,
        notifications: state.sandbox.notifications,
        hooks: state.hooks.services
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({loadServices, loadTerms}, dispatch);

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout)));
