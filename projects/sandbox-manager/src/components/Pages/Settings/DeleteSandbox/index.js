import React, {Component} from 'react';
import {Checkbox, FormControlLabel, IconButton} from '@material-ui/core';

import './styles.less';

export default class SandboxReset extends Component {

    render() {
        let titleStyle = {
            backgroundColor: this.props.theme.p4,
            color: this.props.theme.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <div className='delete-wrapper'>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
                <h1 style={titleStyle}>DELETE SANDBOX</h1>
            </div>
            <div className='delete-content'>
                <p>Deleting the sandbox will delete:</p>
                <ul>
                    <li>All FHIR data</li>
                    <li>Launch scenarios</li>
                    <li>Registered apps</li>
                    <li>Remove access for all sandbox members</li>
                </ul>
                <p>This is NOT reversible!</p>
                {this.props.sandbox && <FormControlLabel control={<Checkbox onChange={this.props.toggleDelete} value='open' color='primary' data-qa='delete-sure-checkbox'/>}
                                                         label={"Are you sure you want to delete sandbox " + this.props.sandbox.name + "?"} className='checkbox'/>}
            </div>
        </div>;
    }
}
