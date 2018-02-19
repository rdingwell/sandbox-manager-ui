import React, { Component } from 'react';
import { BarChart } from 'react-chartkick';


class PatientData extends Component {

    state = {
        data : []
    };

    componentWillMount() {
        let newState = this.state.data.slice();

        if(!this.props.allergyIntoleranceLoading){
            let allergy = ['Allergy Intolerance', this.props.allergyCount];
            newState.push(allergy);
        }
        if(!this.props.carePlanLoading){
            let carePlan = ['Care Plan', this.props.carePlanCount];
            newState.push(carePlan);
        }
        if(!this.props.loadingCareTeam){
            let careTeam = ['Care Team', this.props.careTeamCount];
            newState.push(careTeam);
        }
        if(!this.props.loadingCondition){
            debugger
            let condition = ['Condition', this.props.conditionCount];
            newState.push(condition);
        }

        if(!this.props.loadingObservation){
            let observation = ['Observation', this.props.observationCount];
            newState.push(observation);
        }

        this.setState({data: newState});

    }

    render(){

        return (<div>
            <BarChart data={this.state.data} />
        </div>);
    }
}

export default PatientData;
