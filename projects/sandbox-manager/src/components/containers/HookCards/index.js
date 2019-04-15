import React, { Component } from 'react';
import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { bindActionCreators } from 'redux';

class HookCards extends Component {

    constructor (props) {
        super(props);

        this.state = {
            hooks: {}
        };
    }

    componentDidMount () {
        this.props.app_setScreen(`hooks/${this.props.match.params.hookId}`);

        let onStorage = () => {
            let hooks = this.state.hooks;
            let cards = localStorage.hookCards ? JSON.parse(localStorage.hookCards) : [];
            cards.map(card => {
                let id = card.requestData.hookInstance;
                let list = hooks[id] ? hooks[id].slice() : [];
                list.push(card);
                hooks[id] = list;
            });
        };

        window.addEventListener('storage', onStorage, false);
    }

    render () {
        return <div>
            {this.getCards()}
        </div>;
    }

    getCards = () => {
        console.log(this.state.hooks);
    }
}

const mapStateToProps = state => {
    return {
        cards: state.hooks.cards
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ app_setScreen }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(HookCards)));
