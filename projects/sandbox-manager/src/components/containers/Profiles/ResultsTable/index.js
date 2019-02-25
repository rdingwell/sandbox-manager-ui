import React, { Component } from 'react';
import './styles.less';

class ResultsTable extends Component {
    render () {
        return <div className='results-table'>
            {this.buildTable()}
        </div>;
    }

    buildTable = () => {
        return this.props.results && this.props.results.issue && this.props.results.issue.map((i, k) => {
            return <div className={`result-row ${i.severity}`} key={k}>
                <div className={`flag ${i.severity}`}/>
                <div className='text-wrapper'>
                    <div className='route-wrapper'><span>Route:</span> {i.location[0]}</div>
                    <div className='message'><span>Message:</span> {i.diagnostics}</div>
                </div>
            </div>
        });
    };
}

export default ResultsTable;
