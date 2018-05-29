import React from "react";


export default class GuestGreeting extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <div>
                    Please open this app using the
                </div>
                <a href="https://sandbox.hspconsortium.org">
                    Sandbox.
                </a>
            </div>
        );
    }
}