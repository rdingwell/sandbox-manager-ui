import React, { Component } from 'react';
import { Dialog, Paper, FlatButton } from 'material-ui';
import strings from '../../../strings';
import './styles.less';

export default class Footer extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showTerms: false
        };
    }

    render () {
        return <footer className='footer-wrapper'>
            <Dialog open={this.state.showTerms} onRequestClose={this.toggleTerms} contentClassName='terms-dialog' actionsContainerClassName='terms-dialog-actions'
                    actions={[<FlatButton primary label='View PDF' onClick={this.openPDF} />, <FlatButton secondary label='Close' onClick={this.toggleTerms} />]}>
                <Paper className='paper-card'>
                    <h3>Registered App Details</h3>
                    {this.props.terms && <div className='paper-body' dangerouslySetInnerHTML={{ __html: this.props.terms.value }} />}
                </Paper>
            </Dialog>
            <div className='footer-text'>
                <p>
                    {strings.footerLineOne}
                    • <a onClick={this.toggleTerms}>{strings.footerLineTwo}</a>
                    • <a href='https://healthservices.atlassian.net/wiki/spaces/HSM/overview' target='_blank'>{strings.footerLineThree}</a>
                </p>
            </div>
        </footer>
    }

    toggleTerms = () => {
        !this.state.showTerms && this.props.loadTerms();
        this.setState({ showTerms: !this.state.showTerms })
    };

    openPDF = () => {
        window.open('https://content.hspconsortium.org/docs/hspc/privacyterms.pdf', '_blank');
    };
}
