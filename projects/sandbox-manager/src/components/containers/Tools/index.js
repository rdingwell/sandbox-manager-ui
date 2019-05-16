import React, { Component } from 'react';
import { Card, CardHeader, CardMedia } from 'material-ui';
import Page from 'sandbox-manager-lib/components/Page';
import HelpButton from '../../UI/HelpButton';
import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { bindActionCreators } from 'redux';

import './styles.less';

class Tools extends Component {
    componentDidMount () {
        this.props.app_setScreen('tools');
    }

    render () {
        return <Page title='3d Party Tools' helpIcon={<HelpButton style={{ marginLeft: '10px' }}/>}>
            <a ref='openLink' target='_blank'/>
            <div className='tools'>
                <Card className='tool-card' onClick={() => this.openLink('http://clinfhir.com')}>
                    <CardHeader>
                        clinFHIR
                    </CardHeader>
                    <div style={{ padding: '5px' }}>
                        <img className='tool-icon' src='/img/icon-fhir.png'/>
                        <span className='text'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ligula dui. Sed et vestibulum risus.
                    </span>
                    </div>
                </Card>
                <Card className='tool-card' onClick={() => this.openLink('https://inferno.healthit.gov/inferno/')}>
                    <CardHeader>
                        INFERNO
                    </CardHeader>
                    <div style={{ padding: '5px' }}>
                        <img className='tool-icon' src='/img/inferno_logo.png'/>
                        <span className='text'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ligula dui. Sed et vestibulum risus.
                        </span>
                    </div>
                </Card>
                <Card className='tool-card' onClick={() => this.openLink('https://projectcrucible.org/')}>
                    <CardHeader>
                        Crucible
                    </CardHeader>
                    <div style={{ padding: '5px' }}>
                        <img className='tool-icon' src='/img/crucible_logo.png'/>
                        <span className='text'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ligula dui. Sed et vestibulum risus.
                    </span>
                    </div>
                </Card>
                <Card className='tool-card' onClick={() => this.openLink('https://sandbox.cds-hooks.org/')}>
                    <CardHeader>
                        CDS HOOKS
                    </CardHeader>
                    <div style={{ padding: '5px' }}>
                        <img className='tool-icon' src='/img/cds_hooks_logo.png'/>
                        <span className='text'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ligula dui. Sed et vestibulum risus.
                    </span>
                    </div>
                </Card>
            </div>
        </Page>
    }

    openLink = (link) => {
        let openLink = this.refs.openLink;
        openLink.href = link;
        openLink.click();
    }
}

const mapStateToProps = state => {
    return {}
};
const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Tools)));
