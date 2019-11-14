import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import {CircularProgress, Dialog, IconButton, Paper, Button, Tab, Tabs, createMuiTheme, withTheme, Tooltip} from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import {ThemeProvider} from '@material-ui/styles';
import {Feedback} from '@material-ui/icons';
import Snackbar from '../UI/Snackbar';
import ReactJson from 'react-json-view';
import {Fragment} from 'react';
import * as glib from '../../lib/utils';
import * as lib from '../../lib';
import * as actionCreators from '../../redux/action-creators';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import Layout from '../UI/Layout';
import CreateSandbox from '../Pages/CreateSandbox';
import Init from '../Init/';

import './style.less';

class App extends React.Component {
    constructor(props) {
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

    componentDidMount() {
        this.setSandboxId();
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        let showLoader = this.props.selecting || this.props.resetting || this.props.deleting;
        let loaderText = this.props.deleting ? 'Deleting sandbox' : this.props.resetting ? 'Resetting sandbox data' : 'Loading sandbox data';
        let theme = createMuiTheme(this.props.ui.theme);
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
        let open = !!this.props.cards.cards && !!this.props.cards.cards.length && !this.props.cards.cards[0].noCardsReturned;
        let response = open ? Object.assign({}, this.props.cards.cards[0]) : {};
        let request = open ? this.props.cards.cards[0].requestData : {};
        open && delete response.requestData;
        open && delete response.noCardsReturned;

        return this.props.ui && <ThemeProvider theme={theme}>
            <Layout {...layoutProps}>
                <Init {...this.props} />
                {!this.props.selecting && this.props.config.xsettings.status === 'ready' && <div className='app-root' ref={this.refStage()}>
                    <div className='stage' style={{marginBottom: this.props.ui.footerHeight}}>
                        {!this.getCheck() && this.props.children}
                    </div>
                </div>}
                {!showLoader && this.props.location.pathname !== "/" && <div className='feedback-button'>
                    <Button variant='contained' onClick={() => window.open('https://groups.google.com/a/hspconsortium.org/forum/#!forum/developer', '_blank')} color='primary'>
                        <span style={{marginRight: '10px', color: 'white'}}>Submit feedback</span><Feedback style={{color: 'white', marginTop: '5px'}}/>
                    </Button>
                </div>}
                {showLoader && <Dialog classes={{paper: 'full-loader-wrapper'}} open={showLoader} data-qa='full-page-loader'>
                    <p>{loaderText}</p>
                    <CircularProgress size={80} thickness={5}/>
                </Dialog>}
                {this.props.app.showGlobalSessionModal && <Dialog className='loader-wrapper' modal open={this.props.app.showGlobalSessionModal}>
                    <p style={{padding: '30px'}}>Your session has expired. Reloading...</p>
                </Dialog>}
                {!!this.props.errorToShow && <Snackbar message={this.props.errorToShow} theme={theme} onClose={() => this.props.resetGlobalError()}/>}
                {open && this.props.location.pathname !== "/launchApp" && <Dialog open={open} classes={{paper: 'hooks-dialog'}} onClose={this.dismiss}>
                    <Paper className='paper-card'>
                        <IconButton style={{color: theme.p5}} className="close-button" onClick={this.dismiss}>
                            <i className="material-icons">close</i>
                        </IconButton>
                        <h3>CDS Service response</h3>
                        <div className='paper-body'>
                            <Tabs value={this.state.activeTab} className='cards-tabs-wrapper' onChange={(_e, activeTab) => this.setState({activeTab})}>
                                <Tab label='Cards' value='parsed'/>
                                <Tab label='Request' value='request'/>
                                <Tab label='Response' value='response'/>
                            </Tabs>
                            {!this.props.cards.noCardsReturned && <Tooltip title='According to spec the service should respond in less than 500ms'
                                                                           className={`response-time${this.props.cards.time > 500 ? ' slow' : ''}`}>
                                <span>{this.props.cards.time.toFixed(2)} ms</span>
                            </Tooltip>}
                            <div>
                                {this.state.activeTab === 'parsed' && <div className={'hooks-wrapper parsed tab' + (this.state.activeTab === 'parsed' ? ' active' : '')}>
                                    <a ref='openLink' target='_blank'/>
                                    {!this.props.cards.noCardsReturned && this.getCards()}
                                    {this.props.cards.noCardsReturned && <div className='no-cards-message'>
                                        <span>No cards were returned by the service</span>
                                    </div>}
                                </div>}
                                {this.state.activeTab === 'request' && <div className={'request tab' + (this.state.activeTab === 'request' ? ' active' : '')}>
                                    <ReactJson className='json-view' src={request} name={false}/>
                                </div>}
                                {this.state.activeTab === 'response' && <div className={'response tab' + (this.state.activeTab === 'response' ? ' active' : '')}>
                                    <ReactJson className='json-view' src={response} name={false}/>
                                </div>}
                            </div>
                        </div>
                    </Paper>
                </Dialog>}
            </Layout>
        </ThemeProvider>;
    }

    dismiss = () => {
        this.setState({activeTab: 'parsed'});
        this.props.removeResultCards();
    };

    getCards = () => {
        return this.props.cards.cards && this.props.cards.cards.map((card, i) => {
            return <div className={`hook-card-wrapper ${card.indicator}`} key={card.requestData.hookInstance + '_' + i}>
                <span className='card-summary'>{card.summary}</span>
                {card.source && <div className='hook-source-info'>
                    <span className='hook-source-title'>Source:</span>
                    <span className='hook-source'> {card.source.label}</span>
                </div>}
                {/*<div className='card-detail' dangerouslySetInnerHTML={{__html: card.detail}}/>*/}
                <div className='card-detail'>
                    <ReactMarkdown source={card.detail}/>
                </div>
                {card.suggestions && <div>
                    {card.suggestions.map((suggestion, i) => {
                        return <button key={i} className='hook-suggestion-button' onClick={() => this.executeSuggestion(suggestion)}>
                            <span>{suggestion.label}</span>
                        </button>
                    })}
                </div>}
                {card.links && <div className='links'>
                    {card.links.map((link, i) => {
                        if (link.type === 'smart') {
                            let appToLaunch = this.props.apps.apps.find(app => app.launchUri === link.url);
                            let contextParams = link.appContext ? [{name: 'appContext', value: link.appContext}] : undefined;
                            let onClick = appToLaunch && card.requestData && card.requestData.context && card.requestData.context.patientId
                                ? () => this.props.doLaunch(appToLaunch, card.requestData.context.patientId, undefined, undefined, {contextParams, needPatientBanner: 'T'})
                                : null;

                            return <Fragment key={i}>
                                {!appToLaunch && <span className='app-warning'>App not registered!</span>}
                                <button disabled={!appToLaunch} className='hook-suggestion-button' onClick={onClick}>
                                    <span>{link.label}</span>
                                </button>
                            </Fragment>
                        } else {
                            return <button key={i} className='hook-suggestion-button' onClick={() => this.openLink(link.url)}>
                                <span>{link.label}</span>
                            </button>
                        }
                    })}
                </div>}
            </div>
        });
    };

    executeSuggestion = (suggestion) => {
        suggestion.actions.map(action => {
            this.props.executeAction(action);
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
        cards: state.hooks.cards || {cards: [], time: 0}
    }
};
const mapDispatchToProps = (dispatch) => bindActionCreators({...actionCreators}, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export {connectedComponent};
export default withRouter(withTheme(connectedComponent));
