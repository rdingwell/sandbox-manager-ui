import React, { Component } from 'react';
import DownIcon from "material-ui/svg-icons/navigation/arrow-drop-down";
import { Chip, Menu, MenuItem, Popover } from 'material-ui';

import './styles.less';

export default class Filters extends Component {

    constructor (props) {
        super(props);

        this.state = {}
    }

    render () {
        let deleteCallbackIdFilter = this.props.appliedIdFilter ? () => this.filter() : undefined;
        let deleteCallbackTypeFilter = this.props.appliedTypeFilter ? () => this.filterByType() : undefined;
        let palette = this.props.muiTheme.palette;
        let title = this.props.appliedIdFilter
            ? this.props.apps.find(a => a.authClient.clientId === this.props.appliedIdFilter).authClient.clientName
            : 'App';
        let typeFilterTitle = this.props.appliedTypeFilter ? this.props.appliedTypeFilter : 'Type';

        return <div className='filters'>
            <div>
                <span ref='app-filter'/>
                <Chip className={'chip' + (deleteCallbackIdFilter ? ' active' : '')} onClick={() => this.showFilter('app-filter')} onRequestDelete={deleteCallbackIdFilter}
                      backgroundColor={deleteCallbackIdFilter ? palette.primary2Color : undefined} labelColor={deleteCallbackIdFilter ? palette.alternateTextColor : undefined}>
                    <span className='title'>{title}</span>
                    <span className='icon-wrapper'>
                        {!deleteCallbackIdFilter && <DownIcon color={palette.primary3Color}/>}
                </span>
                </Chip>
                {this.state.visibleFilter === 'app-filter' &&
                <Popover open={true} anchorEl={this.refs['app-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                    <Menu className='app-filter-menu' width='200px' desktop autoWidth={false}>
                        {this.props.apps.map((app, i) =>
                            <MenuItem className='app-filter-menu-item' primaryText={app.clientName} key={i} onClick={() => this.filter(app.authClient.clientId)}
                                      style={this.props.appliedIdFilter === app.clientId ? { backgroundColor: palette.primary5Color } : undefined}/>
                        )}
                    </Menu>
                </Popover>}
            </div>
            <div>
                <span ref='type-filter'/>
                <Chip className={'chip' + (deleteCallbackTypeFilter ? ' active' : '')} onClick={() => this.showFilter('type-filter')} onRequestDelete={deleteCallbackTypeFilter}
                      backgroundColor={deleteCallbackTypeFilter ? palette.primary2Color : undefined} labelColor={deleteCallbackTypeFilter ? palette.alternateTextColor : undefined}>
                    <span className='title'>{typeFilterTitle}</span>
                    <span className='icon-wrapper'>
                    {!deleteCallbackTypeFilter && <DownIcon color={palette.primary3Color}/>}
                </span>
                </Chip>
                {this.state.visibleFilter === 'type-filter' &&
                <Popover open={true} anchorEl={this.refs['type-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                    <Menu className='type-filter-menu' width='200px' desktop autoWidth={false}>
                            <MenuItem className='type-filter-menu-item' primaryText={'Patient'}  onClick={() => this.filterByType('Patient')}/>
                            <MenuItem className='type-filter-menu-item' primaryText={'Practitioner'}  onClick={() => this.filterByType('Practitioner')}/>
                    </Menu>
                </Popover>}
            </div>
        </div>
    }

    filter = (id) => {
        this.props.onFilter && this.props.onFilter('appIdFilter', id);
        this.showFilter();
    };

    filterByType = (type) => {
        this.props.onFilter && this.props.onFilter('typeFilter', type);
        this.showFilter();
    };

    showFilter = (filterName) => {
        this.setState({ visibleFilter: filterName });
    };
}
