import React from "react";

export default class MainGreeting extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            check: props.match,
        };


    }

    render() {
        return (
            <div>
                {this.state.check == null ? '' : ''}
            </div>
        );
    }
}
