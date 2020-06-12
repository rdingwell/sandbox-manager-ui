import React, {Component} from 'react';
import {TextField, Button, Tabs, Tab, CircularProgress} from '@material-ui/core';
import ReactJson from 'react-json-view';
import CodeIcon from '@material-ui/icons/Code';
import ListIcon from '@material-ui/icons/List';
import API from '../../../../lib/api';

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
        let theme = this.props.theme;
        let data = this.state.activeTab === 'data';

        return <div className='import-wrapper'>
            <Tabs className='import-tabs' style={{backgroundColor: 'white'}} onChange={(_e, activeTab) => this.setActiveTab(activeTab)} value={this.state.activeTab}>
                <Tab label={<span><ListIcon style={{color: data ? theme.p5 : theme.p3}}/> Data</span>} value='data' id='data'/>
                <Tab label={<span><CodeIcon style={{color: !data ? theme.p5 : theme.p3}}/> Results</span>} value='result' id='result'/>
            </Tabs>
            <div className='import-tabs-container'>
                {this.state.activeTab === 'data' && <div className={'data tab' + (data ? ' active' : '')}>
                    {this.props.dataImporting ?
                        <div className='loader-wrapper' style={{paddingTop: '200px'}}><CircularProgress size={80} thickness={5}/></div>
                        : <div>
                            <TextField value={this.state.input} id='input' className='import-field-wrapper' fullWidth multiline onChange={e => this.setState({input: e.target.value})}
                                       label='DATA' placeholder='Paste your FHIR resource JSON/XML here'/>
                        </div>}
                    <div>Place a FHIR resource (Patient, Bundle, etc.) in the form above or upload a file containing a resource.</div>
                    <div className='import-button'>
                        <input type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile}/>
                        <Button variant='contained' color='primary' onClick={() => this.refs.file.click()}>
                            Load from file
                        </Button>
                        <Button variant='contained' disabled={this.state.input.length === 0 || this.props.dataImporting} color='primary' onClick={this.import}>
                            Import
                        </Button>
                        {/*<Button variant='contained' color='primary' onClick={this.importSynthea}>*/}
                        {/*    Load sample from synthea*/}
                        {/*</Button>*/}
                    </div>
                </div>}
                {this.state.activeTab === 'result' && <div className={'result tab' + (!data ? ' active' : '')} ref='results'>
                    {this.props.results && this.state.input.length > 0 && <ReactJson src={this.props.results} name={false}/>}
                    {this.props.dataImporting && <div className='loader-wrapper' style={{paddingTop: '200px'}}><CircularProgress size={80} thickness={5}/></div>}
                </div>}
            </div>
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
                this.setActiveTab('result');
            });
        };

        fr.readAsText(this.refs.file.files.item(0));
    };

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.setActiveTab('result');
    };

    importSynthea = () => {
        API.get(`http://localhost:8080/greeting?sandbox=${sessionStorage.sandboxId}`);
    };
}
