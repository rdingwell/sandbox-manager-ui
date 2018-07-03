import React, { Component } from 'react';
import DownIcon from "material-ui/svg-icons/navigation/arrow-drop-down";
import { Chip, Menu, MenuItem, Popover } from 'material-ui';

import './styles.less';

export default class Filters extends Component {

    constructor (props) {
        super(props);

        this.state = {
            filters: {}
        }
    }

    render () {
        let palette = this.props.muiTheme.palette;

        let genderActive = this.state.filters.gender;
        let genderTitle = genderActive ? this.state.filters.gender : 'Gender';
        let genderDeleteCallback = genderActive ? () => this.filter('gender') : undefined;


        return <div className='filters'>
            <div>
                <span ref='gender-filter'/>
                <Chip className={'chip' + (genderActive ? ' active' : '')} onClick={() => this.showFilter('gender')} onRequestDelete={genderDeleteCallback}
                      backgroundColor={genderActive ? palette.primary2Color : undefined} labelColor={genderActive ? palette.alternateTextColor : undefined}>
                    <span className='genderTitle'>{genderTitle}</span>
                    <span className='icon-wrapper'>
                        {!genderActive && <DownIcon color={palette.primary3Color}/>}
                </span>
                </Chip>
                {this.state.visibleFilter === 'gender' &&
                <Popover open={true} anchorEl={this.refs['gender-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                    <Menu className='gender-filter-menu' width='200px' desktop autoWidth={false}>
                        <MenuItem className='gender-filter-menu-item' primaryText={'Male'} onClick={() => this.filter('gender', 'male')}/>
                        <MenuItem className='gender-filter-menu-item' primaryText={'Female'} onClick={() => this.filter('gender', 'female')}/>
                    </Menu>
                </Popover>}
            </div>
        </div>
    }

    filter = (filter, value) => {
        let filters = Object.assign({}, this.state.filters);
        value ? filters[filter] = value : delete filters[filter];

        this.setState({ filters });

        this.props.onFilter && this.props.onFilter(filters);
        this.showFilter();
    };

    showFilter = (filterName) => {
        this.setState({ visibleFilter: filterName });
    };
}
