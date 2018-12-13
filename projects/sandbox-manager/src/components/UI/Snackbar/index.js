import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import './index.less';

class Snackbar extends Component {
    render () {
        return <div className='error-message-wrapper'>
            <span className='custom-snack' style={{ margin: '0 auto', backgroundColor: this.props.theme.palette.primary4Color, color: this.props.theme.palette.primary5Color }}>
                {this.parseMessage(this.props.message).toString()}
                <IconButton className='error-close-button' onClick={this.props.onClose}>
                    <CloseIcon color={this.props.theme.palette.primary5Color}/>
                </IconButton>
            </span>
        </div>;
    }

    parseMessage = (message) => {
        try {
            message = JSON.parse(message);
            if (message.resourceType !== undefined && message.resourceType !== null) {
                if (message.resourceType === "OperationOutcome") {
                    message = message.issue[0].diagnostics;
                }
            }
        } catch(e) {
            // do nothing
        }

        return message;
    }
}

export default Snackbar;