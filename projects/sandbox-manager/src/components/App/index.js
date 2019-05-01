import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import * as glib from 'sandbox-manager-lib/utils/';
import * as lib from '../../lib';
import * as actionCreators from '../../redux/action-creators';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import Layout from 'sandbox-manager-lib/components/Layout';
import CreateSandbox from '../containers/CreateSandbox';

import Init from '../Init/';

import './style.less';
import { CircularProgress, Dialog, IconButton, Paper, RaisedButton, Tab, Tabs } from "material-ui";
import Snackbar from '../UI/Snackbar';
import ReactJson from 'react-json-view';
import { Fragment } from 'react';

class App extends React.Component {
    constructor (props) {
        super(props);

        if (props.location.pathname !== "/launchApp") {
            if (props.fhir.smart.data.server) {
                let smart = FHIR.client(props.fhir.smart.data.server);
                let split = smart.server.serviceUrl.split('/');
                let isCorrectServer = split ? split.indexOf(sessionStorage.sandboxId) >= 0 : true;
                if (sessionStorage.sandboxId && !isCorrectServer && props.history.location.search.indexOf('?code=') === -1) {
                    let newSmart = Object.assign({}, smart);
                    window.fhirClient = smart;
                    newSmart.server.serviceUrl = smart.server.serviceUrl.replace(split[3], sessionStorage.sandboxId);
                    props.selectSandbox(props.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId));
                }
            }
        }

        if (props.location.search && props.location.search.indexOf('id=') >= 0) {
            const cookieUrl = window.location.host.split(":")[0].split(".").slice(-2).join(".");
            const date = new Date();
            let split = props.location.search.split('?')[1].split('id=')[1].split('&')[0];

            let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
            if (isIE11) {
                document.cookie = `hspc-invitation-id=${split}; expires=${date.toUTCString()}; domain=${cookieUrl}; path=/`;
            } else {
                document.cookie = `hspc-invitation-id=${split}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;
            }
        }

        this.state = {
            activeTab: 'parsed'
        };
    }

    componentDidMount () {
        this.setSandboxId();
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResize);
    }

    render () {
        let showLoader = this.props.selecting || this.props.resetting || this.props.deleting;
        let loaderText = this.props.deleting ? 'Deleting sandbox' : this.props.resetting ? 'Resetting sandbox data' : 'Loading sandbox data';
        let theme = getMuiTheme(this.props.ui.theme);
        let pathSplit = this.props.location.pathname.split('/');
        let isSingeHook = pathSplit[2] === 'hooks' && !!pathSplit[3];
        let layoutProps = {
            isSingeHook,
            CreateSandbox,
            onAuthInit: this.props.init,
            signOut: this.props.signOut,
            selectSandbox: this.props.selectSandbox,
            path: this.props.history.location.pathname,
            settings: this.props.config.xsettings.data,
            hideNotification: this.props.hideNotification,
            updateSandboxInvite: this.props.updateSandboxInvite,
            markAllNotificationsSeen: this.props.markAllNotificationsSeen
        };
        let open = !!this.props.cards.length;
        let palette = theme.palette;
        let request = open ? this.props.cards[0].requestData : {};
        let response = open ? Object.assign({}, this.props.cards[0]) : {};
        open && delete response.requestData;

        return this.props.ui && <MuiThemeProvider muiTheme={theme}>
            <Layout {...layoutProps}>
                <Init {...this.props} />
                {!this.props.selecting && this.props.config.xsettings.status === 'ready' && <div className='app-root' ref={this.refStage()}>
                    <div className='stage' style={{ marginBottom: this.props.ui.footerHeight }}>
                        {!this.getCheck() && this.props.children}
                    </div>
                </div>}
                {!showLoader && this.props.location.pathname !== "/" && <div className='feedback-button'>
                    <RaisedButton onClick={() => window.open('https://groups.google.com/a/hspconsortium.org/forum/#!forum/developer', '_blank')} secondary overlayStyle={{ padding: '0 16px' }}>
                        <span style={{ position: 'relative', top: '-5px', marginRight: '10px', color: 'white' }}>Submit feedback</span><FeedbackIcon style={{ color: 'white', marginTop: '5px' }}/>
                    </RaisedButton>
                </div>}
                {showLoader && <Dialog className='loader-wrapper' modal open={showLoader}>
                    <p>{loaderText}</p>
                    <CircularProgress size={80} thickness={5}/>
                </Dialog>}
                {this.props.app.showGlobalSessionModal && <Dialog className='loader-wrapper' modal open={this.props.app.showGlobalSessionModal}>
                    <p>Your session has expired. Reloading...</p>
                </Dialog>}
                {!!this.props.errorToShow && <Snackbar message={this.props.errorToShow} theme={theme} onClose={() => this.props.resetGlobalError()}/>}
                {open && this.props.location.pathname !== "/launchApp" && <Dialog open={open} paperClassName='hooks-dialog' onRequestClose={this.dismiss}>
                    <Paper className='paper-card'>
                        <IconButton style={{ color: palette.primary5Color }} className="close-button" onClick={this.dismiss}>
                            <i className="material-icons">close</i>
                        </IconButton>
                        <h3>CDS Service response</h3>
                        <div className='paper-body'>
                            <Tabs inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }} value={this.state.activeTab} className='cards-tabs-wrapper'>
                                <Tab label='Cards' className={'parsed tab' + (this.state.activeTab === 'parsed' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'parsed' })} value='parsed'>
                                    <div className='hooks-wrapper'>
                                        <a ref='openLink' target='_blank'/>
                                        {this.getCards()}
                                    </div>
                                </Tab>
                                <Tab label='request' className={'request tab' + (this.state.activeTab === 'request' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'request' })} value='request'>
                                    <div>
                                        <ReactJson className='json-view' src={request} name={false}/>
                                    </div>
                                </Tab>
                                <Tab label='Response' className={'response tab' + (this.state.activeTab === 'response' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'response' })} value='response'>
                                    <div>
                                        <ReactJson className='json-view' src={response} name={false}/>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </Paper>
                </Dialog>}
            </Layout>
        </MuiThemeProvider>;
    }

    dismiss = () => {
        this.setState({ activeTab: 'parsed' });
        this.props.removeResultCards();
    };

    getCards = () => {
        return this.props.cards.map((card, i) => {
            return <div className={`hook-card-wrapper ${card.indicator}`} key={card.requestData.hookInstance + '_' + i}>
                <span className='card-summary'>{card.summary}</span>
                {card.source && <div className='hook-source-info'>
                    <span className='hook-source-title'>Source:</span>
                    <span className='hook-source'> {card.source.label}</span>
                </div>}
                <div className='card-detail' dangerouslySetInnerHTML={{ __html: card.detail }}/>
                {card.suggestions && <div>
                    {card.suggestions.map(suggestion => {
                        return <button className='hook-suggestion-button'>
                            <span>{suggestion.label}</span>
                        </button>
                    })}
                </div>}
                {card.links && <div className='links'>
                    {card.links.map(link => {
                        if (link.type === 'smart') {
                            let appToLaunch = this.props.apps.apps.find(app => app.launchUri === link.url);
                            let onClick = appToLaunch && card.requestData && card.requestData.context && card.requestData.context.patientId
                                ? () => this.props.doLaunch(appToLaunch, card.requestData.context.patientId, undefined, undefined, { contextParams: [{ appContext: link.appContext }], needPatientBanner: 'T' })
                                : null;

                            return <Fragment>
                                {!appToLaunch && <span className='app-warning'>App not registered!</span>}
                                <button disabled={!appToLaunch} className='hook-suggestion-button' onClick={onClick}>
                                    <span>{link.label}</span>
                                </button>
                            </Fragment>
                        } else {
                            return <button className='hook-suggestion-button' onClick={() => this.openLink(link.url)}>
                                <span>{link.label}</span>
                            </button>
                        }
                    })}
                </div>}
            </div>
        });
    };

    openLink = (link) => {
        let openLink = this.refs.openLink;
        openLink.href = link;
        openLink.click();
    };

    setSandboxId = () => {
        let check = this.getCheck();
        check && (sessionStorage.sandboxId = window.location.pathname.split('/')[1]);
        check && (localStorage.setItem('sandboxId', window.location.pathname.split('/')[1]));
        check && sessionStorage.sandboxId && this.forceUpdate();
    };

    getCheck = () => {
        return !sessionStorage.sandboxId && window.location.pathname.split('/')[1] && window.location.pathname.split('/')[1] !== 'dashboard' && window.location.pathname.split('/').length >= 2;
    };

    // Event handlers ----------------------------------------------------------
    onResize = () => this.forceUpdate();

    // Refs --------------------------------------------------------------------
    refStage = () => (el) => {
        if (el && this.props.ui.clientWidth !== el.clientWidth) {
            this.props.ui_SetClientWidth(el.clientWidth);
        }
    }
}

App.propTypes = {
    fhir: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        ...state, ...lib, ...glib,
        selecting: state.sandbox.selecting,
        resetting: state.sandbox.resetting,
        deleting: state.sandbox.deleting,
        errorToShow: state.app.errorToShow,
        cards: state.hooks.cards || []
    }
};
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actionCreators }, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedComponent };
export default withRouter(connectedComponent);
