import React, {Component} from 'react';
import {TextField, Button, Tabs, Tab, CircularProgress} from '@material-ui/core';
import ReactJson from 'react-json-view';
import CodeIcon from '@material-ui/icons/Code';
import ListIcon from '@material-ui/icons/List';

import './styles.less';

export default class Import extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: '',
            activeTab: 'data'
        };
    }

    componentDidMount() {
        this.props.clearResults();
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let data = this.state.activeTab === 'data';
        let underlineFocusStyle = {borderColor: palette.primary2Color};
        let floatingLabelFocusStyle = {color: palette.primary2Color};

        return <div className='import-wrapper'>
            <Tabs className='import-tabs' contentContainerClassName='import-tabs-container' inkBarStyle={{backgroundColor: palette.primary2Color}} style={{backgroundColor: palette.canvasColor}}>
                <Tab label={<span><ListIcon style={{color: data ? palette.primary5Color : palette.primary3Color}}/> Data</span>} className={'data tab' + (data ? ' active' : '')}
                     onActive={() => this.setActiveTab('data')}>
                    {this.props.dataImporting ?
                        <div className='loader-wrapper' style={{paddingTop: '200px'}}><CircularProgress size={80} thickness={5}/></div>
                        : <div>
                            <TextField value={this.state.input} id='input' className='import-field-wrapper' fullWidth multiLine onChange={(_, input) => this.setState({input})}
                                       floatingLabelText='DATA' hintText='Paste your FHIR resource JSON/XML here' underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                        </div>}
                    <div>Place a FHIR resource (Patient, Bundle, etc.) in the form above or upload a file containing a resource.</div>
                    <div className='import-button'>
                        <input type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile}/>
                        <Button variant='contained' label='Load from file' primary onClick={() => this.refs.file.click()}/>
                        <Button variant='contained' label='Import' disabled={this.state.input.length === 0 || this.props.dataImporting} primary onClick={this.import}/>
                    </div>
                </Tab>
                <Tab label={<span><CodeIcon style={{color: !data ? palette.primary5Color : palette.primary3Color}}/> Results</span>} className={'result tab' + (!data ? ' active' : '')}
                     onActive={() => this.setActiveTab('result')} ref='results'>
                    {this.props.results && this.state.input.length > 0 && <ReactJson src={this.props.results} name={false}/>}
                    {this.props.dataImporting && <div className='loader-wrapper' style={{paddingTop: '200px'}}><CircularProgress size={80} thickness={5}/></div>}
                </Tab>
            </Tabs>
        </div>;
    }

    readFile = () => {
        let fr = new FileReader();

        fr.onload = (e) => {
            let formatted = '';
            try {
                let result = JSON.parse(e.target.result);
                formatted = JSON.stringify(result, null, 2);
            } catch (_e) {
                formatted = e.target.result;
            }

            this.setState({input: formatted}, () => {
                this.props.importData && this.props.importData(e.target.result);
                this.refs.results.handleClick();
            });
        };

        fr.readAsText(this.refs.file.files.item(0));
    };

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}
