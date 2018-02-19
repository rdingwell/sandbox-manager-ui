import React, { Component } from 'react';
import { BarChart } from 'react-chartkick';


class PatientData extends Component {

    state = {
        data : [
            ['Allergy Intolerance', 0],
            ['Care Plan', 0],
            ['Care Team', 0],
            ['Condition', 0],
            ['Diagnostic Report', 0],
            ['Encounter', 0],
            ['Goal', 0],
            ['Immunization', 0],
            ['Medication Dispense', 0],
            ['Medication Request', 0],
            ['Observation', 0],
            ['Procedure', 0],
            ['Procedure Request', 0]

        ]
    };

    componentWillMount() {
        if(!this.props.observationLoading){
            this.setState({
                ...this.state.data,
                ...this.state.data[10][1] = this.props.observations.length
            });
        }
    }

    componentDidMount() {
    }

    render() {

        return (<div>
            <BarChart data={this.state.data} />
        </div>);
    }
}

export default PatientData;
