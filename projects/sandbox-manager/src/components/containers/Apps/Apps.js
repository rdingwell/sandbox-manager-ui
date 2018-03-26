import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';

import * as  actions from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';

import RegisteredApp from "./RegisteredApp/RegisteredApp";


class Apps extends Component {

    state = {
        selectedApp : null
    };

    handleAppSelect = (event, index) => {
        event.preventDefault();
        this.setState({selectedApp: this.props.apps[index]});
    };

    render()  {

        const paperStyle ={
            width: this.state.selectedApp ? '48%' : '96%',
            float: 'left'

        };

        const cardStyle = {
            width: '220px',
            float: 'left',
            margin: 20,
            height: '200px'
        };

        const registeredAppStyle = {
            width: '48%',
            float: 'right'
        };


        const apps = this.props.apps.map((app, index) => (
            <a key={index} onClick={(event) => this.handleAppSelect(event, index)}>
                <Card style={cardStyle} key={app.index}>
                    <CardMedia>
                        <img style={{height: 150}} src={app.logoUri} alt="HSPC Logo"/>
                    </CardMedia>
                    <CardTitle><span style={{fontSize: 18}}>{app.authClient.clientName}</span></CardTitle>
                </Card>
            </a>
            ));

        let registeredApps = null;
        if(this.state.selectedApp){
            registeredApps = (
                <RegisteredApp style={registeredAppStyle} app={this.state.selectedApp}/>
            )
        }

        return (
            <div>
                <Paper style={paperStyle} className="paper-card">
                    <h3>Registered Sandbox Apps</h3>
                    <div className="paper-body">
                        {apps}
                    </div>
                    <div style={{clear: 'both'}}></div>
                </Paper>
                {registeredApps}
                <div style={{clear: 'both'}}></div>
            </div>
        )
    };
}

const mapStateToProps = state => {
    return {
        apps : state.apps.apps
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onSaveSandbox: (sandboxDetails) => dispatch( actions.updateSandbox(sandboxDetails) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Apps ) )
