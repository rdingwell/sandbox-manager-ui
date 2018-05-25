import React, { Component } from 'react';
import { BarChart } from 'react-chartkick';


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
        console.log(this.props);
        console.log(this.state.data);
        return <div>
            <BarChart key={Math.random()} data={this.state.data} />
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
        let observation = ['Observation', props.observationCount];
        newState.push(observation);
        newState.push(['Procedure', props.procedureCount]);
        newState.push(['Procedure Request', props.procedureRequestCount]);

        this.setState({ data: newState });
    }
}

export default Index;
