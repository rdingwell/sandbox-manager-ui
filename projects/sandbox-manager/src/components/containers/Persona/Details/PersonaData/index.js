import React, { Component } from 'react';
import { BarChart, configure } from 'react-chartkick';

class Index extends Component {
    constructor (props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentWillReceiveProps (nextProps) {
        this.updateData(nextProps);
    }

    render () {
        console.log(configure);
        return <div>
            <BarChart key={Math.random()} ref='test' data={this.state.data} configure={{min:0, max:1000, download: true, discrete: true, xtitle: "Size", ytitle: "Population"}} min={0} max={10000} download={true} />
        </div>
    }

    updateData = (props) => {
        let newState = [];

        newState.push(['Allergy Intolerance', props.allergyCount]);
        newState.push(['Care Plan', props.carePlanCount]);
        newState.push(['Care Team', props.careTeamCount]);
        newState.push(['Condition', props.conditionCount]);
        newState.push(['Diagnostic Report', props.diagnosticReportCount]);
        newState.push(['Encounter', props.encounterCount]);
        newState.push(['Goal', props.goalCount]);
        newState.push(['Immunization', props.immunizationCount]);
        newState.push(['Medication Dispense', props.medicationDispenseCount]);
        newState.push(['Medication Request', props.medicationRequestCount]);
        newState.push(['Observation', props.observationCount]);
        newState.push(['Procedure', props.procedureCount]);
        newState.push(['Procedure Request', props.procedureRequestCount]);

        this.setState({ data: newState, min:0, max:1000, download: true, discrete: true, xtitle: "Size", ytitle: "Population" });
    }
}

export default Index;
