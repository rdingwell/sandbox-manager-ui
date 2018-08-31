import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import {getMuiTheme, MuiThemeProvider} from 'material-ui/styles';
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
import {CircularProgress, Dialog, FloatingActionButton, IconButton, RaisedButton} from "material-ui";

class App extends React.Component {
    constructor(props) {
        super(props);

        let check = !sessionStorage.sandboxId && window.location.pathname.split('/')[1] && window.location.pathname.split('/')[1] !== 'dashboard' && window.location.pathname.split('/').length >= 2;
        check && (sessionStorage.sandboxId = window.location.pathname.split('/')[1]);
        check && (localStorage.setItem('sandboxId', window.location.pathname.split('/')[1]));

        if (this.props.location.pathname !== "/launchApp") {
            if (this.props.fhir.smart.data.server) {
                let smart = FHIR.client(this.props.fhir.smart.data.server);
                let split = smart.server.serviceUrl.split('/');
                let isCorrectServer = split ? split.indexOf(sessionStorage.sandboxId) >= 0 : true;
                if (!isCorrectServer && this.props.history.location.search.indexOf('?code=') === -1) {
                    let newSmart = Object.assign({}, smart);
                    window.fhirClient = smart;
                    newSmart.server.serviceUrl = smart.server.serviceUrl.replace(split[3], sessionStorage.sandboxId);
                    this.props.selectSandbox(this.props.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId));
                }
            }
        }

        this.state = {};
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        let showLoader = this.props.selecting || this.props.resetting || this.props.deleting;
        let loaderText = this.props.deleting ? 'Deleting sandbox' : this.props.resetting ? 'Resetting sandbox data' : 'Loading sandbox data';
        return this.props.ui && <MuiThemeProvider muiTheme={getMuiTheme(this.props.ui.theme)}>
            <Layout path={this.props.history.location.pathname} selectSandbox={this.props.selectSandbox} onAuthInit={this.props.init} settings={this.props.config.xsettings.data}
                    signOut={this.props.signOut} updateSandboxInvite={this.props.updateSandboxInvite} CreateSandbox={CreateSandbox} hideNotification={this.props.hideNotification}
                    markAllNotificationsSeen={this.props.markAllNotificationsSeen}>
                <Init {...this.props} />
                {!this.props.selecting && this.props.config.xsettings.status === 'ready' && <div className='app-root' ref={this.refStage()}>
                    <div className='stage' style={{marginBottom: this.props.ui.footerHeight}}>
                        {this.props.children}
                    </div>
                </div>}
                {!showLoader && this.props.location.pathname !== "/" && <div className='feedback-button'>
                    <RaisedButton onClick={() => window.open('https://groups.google.com/a/hspconsortium.org/forum/#!forum/developer', '_blank')} secondary overlayStyle={{padding: '0 16px'}}>
                        <span style={{position: 'relative', top: '-5px', marginRight: '10px', color: 'white'}}>Submit feedback</span><FeedbackIcon style={{color: 'white', marginTop: '5px'}}/>
                    </RaisedButton>
                </div>}
                {showLoader && <Dialog className='loader-wrapper' modal open={showLoader}>
                    <p>{loaderText}</p>
                    <CircularProgress size={80} thickness={5}/>
                </Dialog>}
            </Layout>
        </MuiThemeProvider>;
    }

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
    return {...state, ...lib, ...glib, selecting: state.sandbox.selecting, resetting: state.sandbox.resetting, deleting: state.sandbox.deleting}
};
const mapDispatchToProps = (dispatch) => bindActionCreators({...actionCreators}, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export {connectedComponent};
export default withRouter(connectedComponent);
