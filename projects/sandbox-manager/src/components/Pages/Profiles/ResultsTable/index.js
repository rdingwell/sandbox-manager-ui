import React, { Component } from 'react';
import './styles.less';

class ResultsTable extends Component {
    constructor (props) {
        super(props);

        this.state = {
            selection: []
        }
    }

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
            let item = <div className={`result-row ${i.severity}`} key={k} onClick={() => this.toggle(k)}>
                <div className={`flag ${i.severity}`}/>
                <div className='text-wrapper'>
                    {i.location && <div className='route-wrapper'>
                        <div>Route:</div>
                        <div>{i.location[0]}</div>
                    </div>}
                    <div className='severity-wrapper'>
                        <div>Severity:</div>
                        <div>{i.severity}</div>
                    </div>
                    {i.diagnostics && <div className='message'>
                        <div>Message:</div>
                        <div className={`${this.state.selection.indexOf(k) > -1 ? 'active' : ''}`}>{i.diagnostics}</div>
                    </div>}
                </div>
            </div>;
            !messages[i.severity] && (messages[i.severity] = []);
            messages[i.severity].push(item);
        });

        return messages;
    };

    toggle = (item) => {
        let index = this.state.selection.indexOf(item);
        let selection = this.state.selection.slice();
        index > -1 ? selection.splice(index, 1) : selection.push(item);
        this.setState({ selection });
    };
}

export default ResultsTable;
