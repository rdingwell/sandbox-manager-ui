import React, {PureComponent} from "react"

class ShowApp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
        };
    }

    render() {
        let mrn = (this.props.patient && this.props.patient.resource.identifier) ? this.props.patient.resource.identifier[0].value : "null";

        return <iframe id={mrn} key={mrn} url={this.props.url != null ? this.props.url : this.state.url} className="myClassname" position="relative" width="100%" allowFullScreen/>;
    }
}

export default ShowApp;
