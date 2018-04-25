import React, { Component } from 'react';
import './styles.less';

export default class PatientFullName extends Component {
    render () {
        return <span>{getName(this.props.name)}</span>
    }

    getName = (name) => {
        let nameVal = name.given[0];
        if (name.given.length > 1) {
            nameVal += ' ' + name.given[1];
        }
        nameVal += ' ' + name.family;
        return nameVal;
    }
}
