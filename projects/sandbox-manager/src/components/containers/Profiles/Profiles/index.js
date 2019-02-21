import React, { Component } from 'react';
import { Card, CardTitle, List, ListItem, RaisedButton } from 'material-ui';

import './styles.less';

class Profiles extends Component {
    render () {
        return <div className='profiles-tab-wrapper'>
            <Card className='card info'>
                <CardTitle className='card-title'>
                    <span>Info</span>
                </CardTitle>
                <div className='card-content url-list-wrapper'>
                    <p>
                        A profile is a set of constraints on a resource represented as a StructureDefinition which often has references to ValueSet, CodeSystem and SearchParameter resources.
                        Thus, in order to successfully validate against a given profile (aka a StructureDefinition resource), your sandbox will need the StructureDefinition along with each referenced ValueSet,
                        CodeSystem and SearchParameter uploaded to the sandbox’s FHIR server. You can do so by uploading a zip file containing all of the needed resources using the button below.
                        We are currently only accepting zip files that contain resources that are in JSON format.
                    </p>
                    <p>
                        There are several publicly available profiles that you can download. The QI-Core and US-Core are among the most popular profiles. Below are the instructions on how to upload them to your
                        sandbox.
                    </p>
                    <p>
                        How to upload the QI-Core profile:
                        <ol>
                            <li>Find the QI-Core Downloads page and download the “JSON” Definitions zip file.</li>
                            <li>Upload this zip file from your machine using the Upload Profile button.</li>
                        </ol>
                    </p>
                    <p>
                        How to upload the US-Core profile:
                        <ol>
                            <li>Download the package.tgz from their downloads page.</li>
                            <li>Unzip the above file and navigate to the “Package” folder.</li>
                            <li>Zip this “Package” folder and upload to your sandbox using the Upload Profile button.</li>
                        </ol>
                    </p>
                    <p>
                        You can also upload your own custom profile by aggregating all of the required StructureDefinition, ValueSet, CodeSystem and SearchParameters resources that you have created in JSON
                        format in a zip file.
                    </p>
                </div>
            </Card>
            <Card className='card profile-list-wrapper'>
                <CardTitle className='card-title'>
                    <span>Profiles</span>
                </CardTitle>
                <div className='card-content import-button'>
                    <div className='file-load-wrapper'>
                        <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip}/>
                        <RaisedButton label='Load Profile (zip file)' primary onClick={() => this.refs.fileZip.click()}/>
                    </div>
                    <div className='loaded-profiles-wrapper'>
                        {this.props.profiles && this.getList()}
                    </div>
                </div>
            </Card>
        </div>
    }

    getList = () => {
        return <List>
            {this.props.profiles.map((profile, key) => {
                return <ListItem key={key} className='profile-list-item' primaryText={profile.url} hoverColor='transparent'/>;
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
