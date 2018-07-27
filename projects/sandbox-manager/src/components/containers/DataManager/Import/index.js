import React, { Component } from 'react';
import { TextField, RaisedButton, Tabs, Tab } from 'material-ui';
import ReactJson from 'react-json-view';
import CodeIcon from 'material-ui/svg-icons/action/code';
import ListIcon from 'material-ui/svg-icons/action/list';

import './styles.less';

export default class Import extends Component {
    constructor (props) {
        super(props);

        this.state = {
            input: '',
            activeTab: 'data'
        };
    }

    componentDidMount () {
        this.props.clearResults();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let data = this.state.activeTab === 'data';
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };

        return <div className='import-wrapper'>
            <Tabs className='import-tabs' contentContainerClassName='import-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}>
                <Tab label={<span><ListIcon style={{ color: data ? palette.primary5Color : palette.primary3Color }}/> Data</span>} className={'data tab' + (data ? ' active' : '')}
                     onActive={() => this.setActiveTab('data')}>
                    <div>
                        <TextField value={this.state.input} id='input' className='import-field-wrapper' fullWidth multiLine onChange={(_, input) => this.setState({ input })}
                                   floatingLabelText='JSON' hintText='Paste you json here' underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                    </div>
                    <div className='import-button'>
                        <RaisedButton label='Import' disabled={this.state.input.length === 0} primary onClick={this.import}/>
                    </div>
                </Tab>
                <Tab label={<span><CodeIcon style={{ color: !data ? palette.primary5Color : palette.primary3Color }}/> Results</span>} className={'result tab' + (!data ? ' active' : '')}
                     onActive={() => this.setActiveTab('result')} ref='results'>
                    {this.props.results && <ReactJson src={this.props.results}/>}
                </Tab>
            </Tabs>
        </div>;
    }

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}
