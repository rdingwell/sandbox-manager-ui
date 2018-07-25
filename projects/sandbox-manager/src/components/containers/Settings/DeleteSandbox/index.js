import React, { Component } from 'react';
import { Checkbox, IconButton } from 'material-ui';

import './styles.less';

export default class SandboxReset extends Component {

    render () {
        let titleStyle = {
            backgroundColor: this.props.theme.primary4Color,
            color: this.props.theme.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <div className='delete-wrapper'>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons">close</i>
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
                {this.props.sandbox && <Checkbox label={"Are you sure you want to delete sandbox " + this.props.sandbox.name} onCheck={(_e, del) => this.props.toggleDelete(del)}
                                                 labelStyle={{ color: this.props.theme.primary2Color }} />}
            </div>
        </div>;
    }
}
