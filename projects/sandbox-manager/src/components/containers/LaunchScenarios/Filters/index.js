import React, { Component } from 'react';
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import { Chip, Menu, MenuItem, Popover } from 'material-ui';

import './styles.less';

export default class Filters extends Component {

    constructor (props) {
        super(props);

        this.state = {}
    }

    render () {
        let deleteCallback = this.props.appliedFilters ? () => this.filter() : undefined;
        let palette = this.props.muiTheme.palette;

        return <div className='filters'>
            <Chip className={'chip' + (deleteCallback ? ' active' : '')} onClick={() => this.showFilter('app-filter')} onRequestDelete={deleteCallback}
                  backgroundColor={deleteCallback ? palette.primary1Color : undefined} labelColor={deleteCallback ? palette.alternateTextColor : undefined}>
                <span>App</span>
                <DownIcon />
            </Chip>
            <span ref='app-filter' />
            {this.state.visibleFilter === 'app-filter' &&
            <Popover open={true} anchorEl={this.refs['app-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                <Menu className='app-filter-menu' width='200px' desktop autoWidth={false}>
                    {this.props.apps.map((app, i) =>
                        <MenuItem className='app-filter-menu-item' primaryText={app.authClient.clientName} key={i} onClick={() => this.filter(app.authClient.clientId)}
                        style={this.props.appliedFilters === app.authClient.clientId ? {backgroundColor: palette.primary5Color} : undefined}/>
                    )}
                </Menu>
            </Popover>}
        </div>
    }

    filter = (id) => {
        this.props.onFilter && this.props.onFilter(id);
    };

    showFilter = (filterName) => {
        this.setState({ visibleFilter: filterName });
    };
}
