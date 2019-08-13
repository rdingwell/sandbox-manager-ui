import React, {Component, Fragment} from 'react';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import {Chip, IconButton, Menu, MenuItem, Popover, TextField, withTheme} from '@material-ui/core';
import ContentSort from '@material-ui/icons/Sort';

import './styles.less';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        let deleteCallbackTypeFilter = this.props.appliedTypeFilter ? () => this.filterByType() : undefined;
        let palette = this.props.theme;
        let typeFilterTitle = this.props.appliedTypeFilter ? this.props.appliedTypeFilter : 'Type';

        return <div className='profiles-filters'>
            <IconButton onClick={() => this.setState({desc: !this.state.desc})} className='sort-button'>
                <ContentSort className={!this.state.desc ? 'rev' : ''} style={{color: palette.p3}}/>
            </IconButton>
            <div>
                <TextField id='profile-filter' placeholder='By name' onChange={e => this.filter(e.target.value)}/>
            </div>
            <div>
                <span ref='type-filter'/>
                <Chip className={'chip' + (deleteCallbackTypeFilter ? ' active' : '')} onClick={() => this.showFilter('type-filter')} onDelete={deleteCallbackTypeFilter}
                      title={<Fragment>
                          <span className='title'>{typeFilterTitle}</span>
                          <span className='icon-wrapper'>{!deleteCallbackTypeFilter && <DownIcon style={{color: palette.p3}}/>}</span>
                      </Fragment>}/>
                {this.state.visibleFilter === 'type-filter' &&
                <Menu open={true} anchorEl={this.refs['type-filter']} className='type-filter-menu' onExit={() => this.showFilter()}>
                    <MenuItem className='type-filter-menu-item' onClick={() => this.filterByType('Patient')}>
                        Patient
                    </MenuItem>
                    <MenuItem className='type-filter-menu-item' onClick={() => this.filterByType('Practitioner')}>
                        Practitioner
                    </MenuItem>
                    <MenuItem className='type-filter-menu-item' onClick={() => this.filterByType('Hook')}>
                        CDS Hook
                    </MenuItem>
                </Menu>}
            </div>
        </div>
    }

    filter = (id) => {
        this.props.onFilter && this.props.onFilter('nameFilter', id);
        this.showFilter();
    };

    filterByType = (type) => {
        this.props.onFilter && this.props.onFilter('typeFilter', type);
        this.showFilter();
    };

    showFilter = (filterName) => {
        this.setState({visibleFilter: filterName});
    };
}

export default withTheme(Filters);