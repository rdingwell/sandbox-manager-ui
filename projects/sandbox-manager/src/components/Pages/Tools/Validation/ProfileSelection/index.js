import React, {Component} from 'react';
import {CircularProgress, List, ListItem, ListSubheader} from "@material-ui/core";

import './styles.less';

class ProfileSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        // Query
        if (this.props.query) {
            // let type = this.props.query.split('/')[0];
            // this.props.loadResource(this.props.query);
            // this.props.loadRelativeProfiles(type);
        }
        this.props.loadProfiles();
    }

    render() {
        return <div className='profile-selection'>
            {this.props.profilesLoading && <div className='loader'>
                <CircularProgress/>
                <div>
                    Searching for relevant profiles
                </div>
            </div>}
            {this.props.profiles && <div className='profile-list'>
                <List subheader={<ListSubheader>
                    Profiles with structure definition for "{this.props.query.split('/')[0]}"
                </ListSubheader>}>
                    {this.props.profiles.map((profile, id) =>
                        <ListItem key={id} className='profile' button onClick={() => this.props.profileSelected(profile)}>
                            {profile.profileId}
                        </ListItem>
                    )}
                </List>
            </div>}
        </div>;
    }
}

export default ProfileSelection;