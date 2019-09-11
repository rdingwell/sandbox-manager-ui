import React, {Component} from 'react';
import HelpIcon from '@material-ui/icons/InfoOutlined';

import './styles.less';

class HelpButton extends Component {
    render = () => <HelpIcon style={this.props.style} className='help-button' onClick={() => this.openURL()}/>;

    openURL = () => !!this.props.url && window.open(this.props.url, '_blank');
}

export default HelpButton;
