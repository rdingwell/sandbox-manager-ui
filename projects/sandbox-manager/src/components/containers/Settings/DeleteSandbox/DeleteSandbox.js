import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

class DeleteSandbox extends Component {
    state = {
        expanded: false
    };

    expandHandler = () => {
        const expanded = this.state.expanded;
        this.setState({expanded: !expanded});
    };


    render()  {
        const style = {
            width: 600,
            margin: 20,
            display: 'inline-block',
            float: 'left'
        };

        const hstyle = {
            width: 560,
            backgroundColor: 'rgb(232, 232, 232)',
            padding: '20px',
            marginTop : 0,
            marginBottom : 0,
            color: '#4a525d'
        };

        const fieldsStyle = {
            padding: 20
        };

        const buttonStyle = {
            margin: 12,
        };

        let icon = (<i className="fa fa-chevron-down" aria-hidden="true"></i>);
        let body = null;
        if(this.state.expanded) {
            icon = (<i className="fa fa-chevron-up" aria-hidden="true"></i>);
            body = (
                <div style={fieldsStyle}>
                    <p>Deleting the sandbox will delete:</p>
                    <ul>
                        <li>all FHIR data</li>
                        <li>launch scenarios</li>
                        <li>registered apps</li>
                        <li>remove access for all sandbox members</li>
                    </ul>
                    <p>This is NOT reversible!</p>
                    <Checkbox label={"Are you sure you want to delete sandbox " + this.props.sandbox.name}/>
                    <RaisedButton label="Delete" style={buttonStyle}/>
                </div>
            );
        }

        return (
            <Paper style={style} zDepth={1} >
                <h4 style={hstyle}  onClick={this.expandHandler}>Delete Sandbox<span style={{float: "right"}}>{icon}</span></h4>
                {body}
            </Paper>

        )
    };

}
export default DeleteSandbox;