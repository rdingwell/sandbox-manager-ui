import React, {Component, Fragment} from 'react';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import {Chip, IconButton, Menu, MenuItem, Popover, TextField, withTheme} from '@material-ui/core';
import ContentSort from '@material-ui/icons/Sort';

import './styles.less';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: ''
        }
    }

    componentDidMount() {
        this.props.fetchDefinitionTypes();
    }

    render() {
        let deleteCallbackTypeFilter = this.props.appliedTypeFilter ? () => this.filterByType() : undefined;
        let palette = this.props.theme;
        let typeFilterTitle = !!this.state.filter ? this.state.filter : 'Type';

        return <div className='profiles-filters'>
            <IconButton onClick={() => this.setState({desc: !this.state.desc})} className='sort-button'>
                <ContentSort className={!this.state.desc ? 'rev' : ''} style={{color: palette.p3}}/>
            </IconButton>
            <div>
                <TextField id='profile-filter' placeholder='By name' value={this.props.filter} onChange={e => this.filter(e.target.value)}/>
            </div>
            {this.props.showType && <div>
                <span ref='type-filter'/>
                <Chip className={'chip' + (deleteCallbackTypeFilter ? ' active' : '')} onClick={() => this.showFilter('type-filter')} onDelete={deleteCallbackTypeFilter}
                      label={<Fragment>
                          <span className='title'>{typeFilterTitle}</span>
                          <span className='icon-wrapper'>{!deleteCallbackTypeFilter && <DownIcon style={{color: palette.p3}}/>}</span>
                      </Fragment>}/>
                {this.state.visibleFilter === 'type-filter' &&
                <Menu open={true} anchorEl={this.refs['type-filter']} className='type-filter-menu' onExit={() => this.showFilter()}>
                    {this.props.definitionTypes.map(definition => {
                        return <MenuItem key={definition} className='type-filter-menu-item' onClick={() => this.filterByType(definition)}>
                            {definition}
                        </MenuItem>
                    })}
                </Menu>}
            </div>}
        </div>
    }

    filter = (id) => {
        this.props.onFilter && this.props.onFilter('nameFilter', id);
        this.showFilter();
    };

    filterByType = (filter) => {
        this.setState({filter});
        this.props.onFilter && this.props.onFilter('typeFilter', filter);
        this.showFilter();
    };

    showFilter = (filterName) => {
        this.setState({visibleFilter: filterName});
    };
}

export default withTheme(Filters);