import React, { Component } from 'react';
import { Card, CardTitle, CircularProgress, FloatingActionButton, RaisedButton, Tab, Tabs, TextField } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CodeIcon from 'material-ui/svg-icons/action/code';
import ListIcon from 'material-ui/svg-icons/action/list';
import ReactJson from 'react-json-view';

import './styles.less';

class Validate extends Component {

    constructor (props) {
        super(props);

        this.state = {
            query: '',
            activeTab: 'input',
            canFit: 2
        };
    }

    componentWillReceiveProps (nextProps) {
        nextProps.results && nextProps.results.issue && this.setState({ activeTab: 'json' });
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let json = this.state.activeTab === 'json';
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        let styleProps = { underlineFocusStyle, floatingLabelFocusStyle };

        return <div className='validate-wrapper'>
            <Tabs className='validate-tabs' contentContainerClassName='validate-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}
                  value={this.state.activeTab}>
                <Tab label={<span><ListIcon style={{ color: !json ? palette.primary5Color : palette.primary3Color }}/> Input</span>} className={'manual-input tab' + (!json ? ' active' : '')}
                     onActive={() => this.setActiveTab('input')} value='input'>
                    <Card>
                        <CardTitle className='card-title' style={{ color: palette.primary2Color }}>
                            Validate an existing resource
                        </CardTitle>
                        <div className='card-content'>
                            <div className='input-wrapper'>
                                <TextField fullWidth id='query' {...styleProps} onChange={(_, query) => this.setState({ query, manualJson: '', file: '', fileJson: '' })} hintText='/Patient/smart-613876'
                                           value={this.state.query}/>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <CardTitle className='card-title' style={{ color: palette.primary2Color }}>
                            Validate a file
                        </CardTitle>
                        <div className='card-content'>
                            <input type='file' id='file' ref='file' style={{ display: 'none' }} onChange={this.readFile}/>
                            <RaisedButton label='Browse for file' primary onClick={() => this.refs.file.click()}/>
                            {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                        </div>
                    </Card>
                    <Card>
                        <CardTitle className='card-title' style={{ color: palette.primary2Color }}>
                            Validate JSON
                        </CardTitle>
                        <div>
                            <TextField className='manual-input' hintText='Paste JSON here' onChange={(_, manualJson) => this.setState({ query: '', file: '', fileJson: '', manualJson })}
                                       {...styleProps} multiLine fullWidth value={this.state.manualJson}/>
                        </div>
                    </Card>
                    <div>
                        <RaisedButton label='Validate' primary onClick={this.search}/>
                    </div>
                </Tab>
                <Tab label={<span><CodeIcon style={{ color: json ? palette.primary5Color : palette.primary3Color }}/> RESULT</span>} className={'json tab' + (json ? ' active' : '')}
                     onActive={() => this.setActiveTab('json')} value='json'>
                    {this.props.results && <ReactJson src={this.props.results} name={false}/>}
                    {this.props.executing && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                </Tab>
            </Tabs>
        </div>;
    }

    readFile = () => {
        let fr = new FileReader();
        let file = this.refs.file.files.item(0);

        fr.onload = (e) => {
            let fileJson = e.target.result;
            this.setState({ query: '', manualJson: '', fileJson, file: file.name });
        };

        fr.readAsText(file);
    };

    search = () => {
        this.state.fileJson
            ? this.props.validate(JSON.parse(this.state.fileJson))
            : this.state.manualJson
            ? this.props.validate(JSON.parse(this.state.manualJson))
            : this.props.validateExisting(this.state.query);
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };
}

export default Validate;