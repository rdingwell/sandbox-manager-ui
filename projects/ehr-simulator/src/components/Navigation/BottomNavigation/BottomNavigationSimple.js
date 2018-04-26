import React, {Component} from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Logo from "../../Logo/Logo";

const logo = <Logo />;

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
const style = {
    position: 'fixed',
    bottom: '0',
    width: '100%',
}

class BottomNavigationSimple extends Component {
    state = {
        selectedIndex: 0,
    };

    select = (index) => this.setState({selectedIndex: index});

    render() {
        return (
            <Paper zDepth={1}>
                <BottomNavigation selectedIndex={this.state.selectedIndex} style={style}>
                    <BottomNavigationItem
                        icon={logo}
                        onClick={() => this.select(2)}
                    />
                </BottomNavigation>
            </Paper>
        );
    }
}

export default BottomNavigationSimple;