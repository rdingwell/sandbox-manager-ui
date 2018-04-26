import React, {Component} from 'react';
import {IconMenu} from "material-ui";
import PersonaSelectorDialog from "../DialogBoxes/PersonaSelectorDialog";

class HeaderIconButton extends Component {



    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <PersonaSelectorDialog
                        selectedPersonaName={this.props.selectedPersonaName}
                        handlePersonaSelection={this.props.handlePersonaSelection}
                        bearer={this.props.bearer}
                        sandboxApi={this.props.sandboxApi}
                        sandboxId={this.props.sandboxId}
                    />
                }
            >
            </IconMenu>
        );
    }
}

export default HeaderIconButton;