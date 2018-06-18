import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import * as glib from '../../../../../lib/utils/';
import * as lib from '../../lib/';
import * as actionCreators from '../../redux/action-creators';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import Layout from '../../../../../lib/components/Layout';

import Init from '../Init/';

import './style.less';
import {CircularProgress} from "material-ui";

class App extends React.Component {
    componentDidMount () {
        window.addEventListener('resize', this.onResize);

        !sessionStorage.sandboxId && window.location.pathname.split('/')[1] && window.location.pathname.split('/')[1] !== 'dashboard' && window.location.pathname.split('/').length > 2 && (sessionStorage.sandboxId = window.location.pathname.split('/')[1]);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResize);
    }

    render () {
        return this.props.ui && <MuiThemeProvider muiTheme={getMuiTheme(this.props.ui.theme)}>
            <Layout path={this.props.history.location.pathname} selectSandbox={this.props.selectSandbox} onAuthInit={this.props.init} settings={this.props.config.xsettings.data}
                    signOut={this.props.signOut} updateSandboxInvite={this.props.updateSandboxInvite}>
                {!this.props.sandbox.selecting && <div className='app-root' ref={this.refStage()}>
                    <Init {...this.props} />
                    <div className='stage' style={{ marginBottom: this.props.ui.footerHeight }}>
                        {this.props.children}
                    </div>
                </div>}
                {this.props.sandbox.selecting && <div className='loader-wrapper'>
                    <p>
                        Loading sandboxes
                    </p>
                    <CircularProgress size={80} thickness={5}/>
                </div>}
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

const mapStateToProps = (state, ownProps) => ({ ...glib, ...lib, ...state, ...ownProps });
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actionCreators }, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedComponent };
export default withRouter(connectedComponent);
