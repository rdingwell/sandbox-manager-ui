import React, { Component } from 'react';

import { TextField, Checkbox, RaisedButton, Paper, Dialog } from 'material-ui';

import './styles.less';

class SandboxReset extends Component {

    constructor (props) {
        super(props);

        this.state = {
            del: false,
            showDeleteModal: false,
            enableDelete: ''
        };
    }

    render () {
        let actions = [
            <RaisedButton key={1} label='Delete' secondary onClick={this.deleteSandbox} disabled={this.state.enableDelete !== 'DELETE'} />,
            <RaisedButton key={2} label='Cancel' primary onClick={this.toggleModal} className='cancel-button' />
        ];

        return <Paper className='delete-wrapper' zDepth={1}>
            {this.state.showDeleteModal && <Dialog paperClassName='app-dialog auto delete-sandbox-dialog' modal={false}
                                                   open={this.state.showDeleteModal} onRequestClose={this.toggleModal} actions={actions}>
                <Paper className='paper-card delete-dialog'>
                    <h3>Delete Sandbox</h3>
                    <div className='paper-body auto'>
                        <p>
                            Are you sure you want to delete sandbox {this.props.sandbox.name}? This is not reversible and will delete all FHIR data, launch scenarios, registered
                            app, etc.
                        </p>
                        <TextField value={this.state.enableDelete} floatingLabelText='Type "DELETE"' fullWidth
                                   onChange={(_e, enableDelete) => this.setState({ enableDelete })} />
                    </div>
                </Paper>
            </Dialog>}
            <h4>Sandbox Delete</h4>
            <div className='delete-wrapper'>
                <p>Deleting the sandbox will delete:</p>
                <ul>
                    <li>all FHIR data</li>
                    <li>launch scenarios</li>
                    <li>registered apps</li>
                    <li>remove access for all sandbox members</li>
                </ul>
                <p>This is NOT reversible!</p>
                {this.props.sandbox && <Checkbox label={"Are you sure you want to delete sandbox " + this.props.sandbox.name} onCheck={(_e, del) => this.setState({ del })} />}
                <RaisedButton primary disabled={!this.state.del} label="Delete" className='button' onClick={this.toggleModal} />
            </div>
        </Paper>;
    }

    toggleModal = () => {
        this.setState({ showDeleteModal: !this.state.showDeleteModal });
    };

    deleteSandbox = () => {
        this.props.deleteCurrentSandbox(this.props.history);
        this.toggleModal();
    }
}


export default SandboxReset;
