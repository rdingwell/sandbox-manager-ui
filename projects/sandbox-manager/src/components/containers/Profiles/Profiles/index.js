import React, { Component } from 'react';
import { Card, CardTitle, List, ListItem, RaisedButton } from 'material-ui';

import './styles.less';

class Profiles extends Component {
    render () {
        return <div className='profiles-tab-wrapper'>
            <Card className='card profile-list-wrapper'>
                <CardTitle className='card-title'>
                    <span>Available Profiles</span>
                </CardTitle>
                <div className='card-content url-list-wrapper'>
                    {this.props.profiles && this.getList()}
                </div>
            </Card>
            <Card className='card profiles-actions-wrapper'>
                <CardTitle className='card-title'>
                    <span>Import profile</span>
                </CardTitle>
                <div className='card-content import-button'>
                    <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip}/>
                    <RaisedButton label='Load Profile (zip file)' primary onClick={() => this.refs.fileZip.click()}/>
                </div>
            </Card>
        </div>
    }

    getList = () => {
        let profiles = Object.keys(this.props.profiles);
        return <List>
            {profiles.map((profile, key) => {
                //Group the items
                let grouping = {};
                this.props.profiles[profile].map(item => {
                    !grouping[item.resourceType] && (grouping[item.resourceType] = []);
                    grouping[item.resourceType].push(item);
                });

                //Build child components
                let nestedItems = Object.keys(grouping).map((i, k) => {
                    return <ListItem key={k} className='profile-list-item' primaryText={i} initiallyOpen={false} primaryTogglesNestedList hoverColor='transparent'
                                     nestedItems={grouping[i].map(q => <ListItem className='profile-list-item' key={q.id} primaryText={q.title} hoverColor='transparent'/>)}/>
                });

                return <ListItem key={key} className='profile-list-item' primaryText={profile} initiallyOpen={false} primaryTogglesNestedList nestedItems={nestedItems} hoverColor='transparent'/>;
            })}
        </List>
    };

    loadZip = () => {
        this.props.uploadProfile(this.refs.fileZip.files[0]);
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

export default Profiles;
