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
            let type = this.props.query.split('/')[0];
            this.props.loadProfilesBySD(type);
            this.setState({type});
        } else if (this.props.fileJson) {
            try {
                let json = JSON.parse(this.props.fileJson);
                this.props.loadProfilesBySD(json.resourceType);
                this.setState({type: json.resourceType});
            } catch (e) {
                console.log(e);
            }
        }
    }

    render() {
        return <div className='profile-selection'>
            {this.props.fetchingProfilesByDefinition && <div className='loader'>
                <CircularProgress/>
                <div>
                    Searching for relevant profiles
                </div>
            </div>}
            {!this.props.fetchingProfilesByDefinition && <div className='profile-list'>
                <List subheader={<ListSubheader>
                    Profiles with structure definition for "{this.state.type}"
                </ListSubheader>}>
                    {Object.keys(this.props.profiles).map((profile, id) =>
                        <ListItem key={id} className='profile' button onClick={() => this.props.profileSelected({id: this.props.profiles[profile].fhirProfileId, profile: this.props.profiles[profile]})}>
                            {profile}
                        </ListItem>
                    )}
                    {!this.props.profiles && <ListItem className='profile'>
                        There is no profile with structure definition for "{this.state.type}"
                    </ListItem>}
                </List>
            </div>}
        </div>;
    }
}

export default ProfileSelection;