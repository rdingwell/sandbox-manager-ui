import React, { Component } from 'react';
import './styles.less';

class ResultsTable extends Component {
    render () {
        let messages = this.buildTable();
        return <div className='results-table'>
            {messages.error}
            {messages.warning}
            {messages.information}
        </div>;
    }

    buildTable = () => {
        let messages = {};

        this.props.results && this.props.results.issue && this.props.results.issue.map((i, k) => {
            let item = <div className={`result-row ${i.severity}`} key={k}>
                <div className={`flag ${i.severity}`}/>
                <div className='text-wrapper'>
                    {i.location && <div className='route-wrapper'><span>Route:</span> {i.location[0]}</div>}
                    <div className='severity-wrapper'><span>Severity:</span> {i.severity}</div>
                    {i.diagnostics && <div className='message'><span>Message:</span> {i.diagnostics}</div>}
                </div>
            </div>;
            !messages[i.severity] && (messages[i.severity] = []);
            messages[i.severity].push(item);
        });

        return messages;
    };
}

export default ResultsTable;
