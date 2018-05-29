import React, {Component} from 'react';
import {Menu, MenuItem} from "material-ui";

import "./AppMenu.css";

const MENU_ITEM_STYLE = {height: "50px", overflow: "hidden"};
const INNER_DIV_STYLE = {width: "224px", overflow: "hidden", boxSizing: "border-box"};
const PRIMARY_TEXT_STYLE = {display: "inline-block", width: "100%", overflow: "hidden", textOverflow: "ellipsis"};

class AppMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            token: props.bearer,
        };
    }

    componentDidMount() {
        const listItems = this.props.apps.map((d) =>
            <MenuItem key={d.id} primaryText={<span style={PRIMARY_TEXT_STYLE}>{d.authClient.clientName}</span>} style={MENU_ITEM_STYLE}
                      value={d.id} onClick={() => this.updateMenu(d.id)} innerDivStyle={INNER_DIV_STYLE}/>);
        this.setState({items: listItems});
    }

    updateMenu(i) {
        let app = this.props.apps.find(app => app.id === i);
        this.props.handleAppMenu(app);
    }

    render() {
        return <Menu value={this.props.selectedItem}>
            {this.props.patient && this.state.items}
        </Menu>;
    }
}

export default AppMenu;


