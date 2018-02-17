import React, { Component } from 'react';
import { BarChart } from 'react-chartkick';

class PatientData extends Component {

    componentDidMount() {
        this.props.patient;
    }



    render() {
        const data = [
            ['Allergy Intolerance', 1],
            ['Care Plan', 1],
            ['Care Team', 1],
            ['Condition', 1],
            ['Diagnostic Report', 1],
            ['Encounter', 1],
            ['Goal', 1],
            ['Immunization', 1],
            ['Medication Dispense', 1],
            ['Medication Request', 1],
            ['Observation', 1],
            ['Procedure', 1],
            ['Procedure Request', 1]
        ];

        return (<div>
            <BarChart data={data} />
        </div>);
    }
}

export default PatientData;