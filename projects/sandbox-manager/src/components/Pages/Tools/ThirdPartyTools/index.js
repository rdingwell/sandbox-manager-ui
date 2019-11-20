import React, {Component} from 'react';
import {Card, CardMedia} from '@material-ui/core';

const TOOLS = [
    {
        title: 'clinFHIR',
        description: 'Tool to create or search for FHIR-based resources and link them to tell a clinical story.',
        image: '/img/icon-fhir.png',
        link: 'http://clinfhir.com'
    },
    {
        title: 'Inferno',
        description: 'Testing suite for FHIR to help developers implement the FHIR standard.',
        image: '/img/inferno_logo.png',
        link: 'https://inferno.healthit.gov/inferno/',
        larger: true
    },
    {
        title: 'Crucible',
        description: 'Testing suite to test for conformance to the FHIR standard.',
        image: '/img/crucible_logo.png',
        link: 'https://projectcrucible.org/'
    },
    {
        title: 'CDS Hooks Sandbox',
        description: 'Test harness for CDS Hook-based services',
        image: '/img/cds_hooks_logo.png',
        link: 'https://sandbox.cds-hooks.org/'
    }
];

import './styles.less';

class ThirdPartyTools extends Component {
    render() {
        let titleStyle = {backgroundColor: 'rgba(0,87,120, 0.75)'};

        return <div>
            <a ref='openLink' target='_blank'/>
            <div className='third-party-tools'>
                {TOOLS.map(t =>
                    <Card title={t.title} className='tool-card' onClick={() => this.openLink(t)} key={t.link}>
                        <CardMedia className={`media-wrapper${t.larger ? ' larger' : ''}`} image={t.image}>
                            <span/>
                        </CardMedia>
                        <div className='card-title' style={titleStyle}>
                            <h3 className='tool-name'>{t.title}</h3>
                            <div className='tool-description'>{t.description}</div>
                        </div>
                    </Card>
                )}
            </div>
        </div>;
    }

    openLink = (tool) => {
        // http://clinfhir.com/patientViewer.html?data=https:%2F%2Fapi-test.logicahealth.org%2Ftssst%2Fopen%2F&patientid=SMART-1288992
        let link = tool.link;
        let url = encodeURI(this.props.serviceUrl.replace('/data', '/open/'));
        if (tool.title === 'clinFHIR' && this.props.isOpen) {
            link = `${tool.link}/?data=${url}&conf=${url}&term=${url}`;
        }
        let openLink = this.refs.openLink;
        openLink.href = link;
        openLink.click();
    }
}

export default ThirdPartyTools;