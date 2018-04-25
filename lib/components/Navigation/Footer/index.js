import React, { Component } from 'react';
import strings from '../../../strings';
import './styles.less';

export default class Footer extends Component {
    render () {
        return <footer className='footer-wrapper'>
            <div className='footer-text'>
                <p>
                    {strings.footerLineOne}
                    • <a>{strings.footerLineTwo}</a>
                </p>
            </div>
        </footer>
    };
}
