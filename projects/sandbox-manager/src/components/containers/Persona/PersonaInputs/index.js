import React, { Component } from 'react';
import { Paper, TextField } from 'material-ui';
import { parseNames } from '../../../../../../../lib/utils/fhir';

import './styles.less';

export default class PersonaInputs extends Component {

    constructor (props) {
        super(props);

        this.state = {
            userId: '',
            password: ''
        }
    }

    render () {
        return <Paper className='paper-card persona-inputs-wrapper'>
            <h3>Persona information</h3>
            <div className='actions'>
                {this.props.actions}
            </div>
            <div className='paper-body'>
                <div className='persona-info-row'>
                    <span>Display Name</span>
                    <span>{parseNames(this.props.persona)[0].val}</span>
                </div>
                <div className='persona-info-row high'>
                    <span>User Id</span>
                    <div>
                        <TextField fullWidth id='user-id' value={this.state.userId} onChange={(_, userId) => this.update('userId', userId)} />
                        <span className='additional-info'>Your persona userId will be {this.state.userId}{this.state.userId && `@${this.props.sandbox}`}</span>
                    </div>
                </div>
                <div className='persona-info-row high'>
                    <span>Password</span>
                    <TextField fullWidth id='password' onChange={(_, password) => this.update('password', password)} value={this.state.password} />
                </div>
                <div className='persona-info-row'>
                    <span>FHIR Resource URL</span>
                    <span>{`${this.props.persona.resourceType}/${this.props.persona.id}`}</span>
                </div>
            </div>
        </Paper>;
    }

    update = (field, value) => {
        let state = {};
        state[field] = value;

        this.setState(state, () => this.props.onChange && this.props.onChange(this.state.userId.length > 1 ? `${this.state.userId}@${this.props.sandbox}` : '', this.state.password));
    };
}
