import React from 'react';

export default class ChoosePatient extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            bearer: props.bearer,
            sandboxApi: props.sandboxApi,
            sandboxId: props.sandboxId,
            title: "Choose Patient",
            open: false,

        };

    }

    handleOpen = () => {
        this.setState({open: true});
    };

    render(){
        return(
            <div>
                <div>This Patient</div>
                <button onClick={this.handleOpen}>
                    {this.state.title}
                </button>
            </div>
        )
    }
}