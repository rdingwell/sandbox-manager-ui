import React, {Component} from 'react';
import {CircularProgress, List, ListItem, ListSubheader} from "@material-ui/core";

import './styles.less';

class ProfileSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        // Query
        if (!!this.props.query) {
            let type = this.props.query.split('/')[0];
            this.props.loadProfilesBySD(type);
            this.setState({type});
        } else if (!!this.props.fileJson || !!this.props.manualJson) {
            let j = this.props.fileJson || this.props.manualJson;
            try {
                let json = JSON.parse(j);
                this.props.loadProfilesBySD(json.resourceType);
                this.setState({type: json.resourceType});
            } catch (e) {
                console.log(e);
                this.setState({wrongFile: true});
            }
        } else {
            this.setState({wrongFile: true});
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
            {!this.props.fetchingProfilesByDefinition && !this.state.wrongFile && <div className='profile-list'>
                <List subheader={<ListSubheader>
                    Profiles with structure definition for "{this.state.type}"
                </ListSubheader>}>
                    {!this.state.wrongFile && !!this.props.profiles && Object.keys(this.props.profiles).map((profile, id) =>
                        <ListItem key={id} className='profile' button onClick={() => this.props.profileSelected({id: this.props.profiles[profile].fhirProfileId, profile: this.props.profiles[profile]})}>
                            {profile}
                        </ListItem>
                    )}
                    {!this.props.profiles && <ListItem className='profile'>
                        There is no profile with structure definition for "{this.state.type}"
                    </ListItem>}
                </List>
            </div>}
            {this.state.wrongFile && <div className='profile-list' style={{padding: '20px'}}>
                The provided json does not match the requested format.
            </div>}
        </div>;
    }
}

export default ProfileSelection;