import React, {Component} from 'react';
import {CircularProgress, List, ListItem, ListSubheader, Button} from "@material-ui/core";

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
            this.props.loadQueryObject(this.props.query);
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
        let obj = this.props.queryObject;
        let hasProfile = !!obj && !!obj.meta && !!obj.meta.profle && obj.meta.profile.length > 0;

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
                    {hasProfile && <Button variant='contained' color='primary' className='own-button' onClick={() => this.props.continue()}>
                        Use own
                    </Button>}
                </ListSubheader>}>
                    {!this.state.wrongFile && !!this.props.profiles && Object.keys(this.props.profiles).map((profile, id) =>
                        this.props.profiles[profile].map((sd, i) =>
                            <ListItem key={`${id}${i}`} className='profile' button
                                      onClick={() => this.props.profileSelected({id: this.props.profiles[profile][i].fhirProfileId, profile: this.props.profiles[profile][i]})}>
                                <span style={{display: 'inline-block', minWidth: '200px'}}>{profile}</span> {this.props.profiles[profile].length > 1 && sd.relativeUrl.split('/')[1]}
                            </ListItem>)
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