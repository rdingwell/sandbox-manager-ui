import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

export default class EHRProvider extends Component {
    render() {
        return <Paper className='paper-card'>
                <h3>{this.props.providerName}</h3>
                <div className='paper-body'>
                    <p>Where can I learn about {this.props.providerName}'s development programs?</p>
                    <p>
                        <span className='Answer'>
                            <a href={this.props.devLocation}>{this.props.devLocation}</a>
                        </span>
                    </p>
                    <p>Where can I register a SMART on FHIR app?</p>
                    <p>
                        <span className='Answer'>
                            <a href={this.props.regLocation}>{this.props.regLocation}</a>
                        </span>
                    </p>
                    <p>What is {this.props.providerName}'s support for DSTU2?</p>
                    <p>
                        <span className='Answer'>
                            <a href={this.props.dstu2Location}>{this.props.dstu2Location}</a>
                        </span>
                    </p>
                    <p>What is {this.props.providerName}'s support for STU3?</p>
                    <p>
                        <span className='Answer'>Not supported at this time</span>
                    </p>
                </div>
            </Paper>
    };

}
