import React from 'react';
import Dialog from 'material-ui/Dialog';
import PersonaTable from "../../Persona/PersonaTable";

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class PersonaSelectorDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bearer: props.bearer,
            sandboxApi: props.sandboxApi,
            sandboxId: props.sandboxId,
            selectDoc: null
        };
    }

    handleSelectedDoc = (doc) => {
        this.setState({selectedDoc: doc});
        this.props.handlePersonaSelection(doc);
        this.props.onClose && this.props.onClose();
    };

    render() {
        return (
            <div>
                <Dialog title="Select A Practitioner Persona" modal={false} open={this.props.open} onRequestClose={() => this.props.onClose && this.props.onClose()}>
                    <PersonaTable
                        handleSelectedDoc={this.handleSelectedDoc}
                        sandboxId={this.state.sandboxId}
                        sandboxApi={this.state.sandboxApi}
                        bearer={this.state.bearer}
                    />
                </Dialog>
            </div>
        );
    }
}
