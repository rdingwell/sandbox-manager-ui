import React, { Component } from 'react';
import { BarChart } from 'react-chartkick';


class Index extends Component {

    state = {
        data : []
    };

    componentWillMount() {
        let newState = this.state.data.slice();

        if(!this.props.allergyIntoleranceLoading){
            newState.push(['Allergy Intolerance', this.props.allergyCount]);
        }
        if(!this.props.carePlanLoading){
            newState.push(['Care Plan', this.props.carePlanCount]);
        }
        if(!this.props.loadingCareTeam){
            newState.push(['Care Team', this.props.careTeamCount]);
        }
        if(!this.props.loadingCondition){
            newState.push(['Condition', this.props.conditionCount]);
        }

        if(!this.props.loadingDiagnosticReport){
            newState.push(['Diagnostic Report', this.props.diagnosticReportCount]);
        }

        if(!this.props.loadingEncounter){
            newState.push(['Encounter', this.props.encounterCount]);
        }

        if(!this.props.loadingGoal){
            newState.push(['Goal', this.props.goalCount]);
        }

        if(!this.props.loadingImmunization){
            newState.push(['Immunization', this.props.immunizationCount]);
        }

        if(!this.props.loadingMedicationDispense){
            newState.push(['Medication Dispense', this.props.medicationDispenseCount]);
        }

        if(!this.props.loadingMedicationRequest){
            newState.push(['Medication Request', this.props.medicationRequestCount]);
        }

        if(!this.props.loadingObservation){
            let observation = ['Observation', this.props.observationCount];
            newState.push(observation);
        }

        if(!this.props.loadingProcedure){
            newState.push(['Procedure', this.props.procedureCount]);
        }

        if(!this.props.loadingProcedureRequest){
            newState.push(['Procedure Request', this.props.procedureRequestCount]);
        }

        this.setState({data: newState});
    }

    render(){

        return (<div>
            <BarChart data={this.state.data} />
        </div>);
    }
}

export default Index;
