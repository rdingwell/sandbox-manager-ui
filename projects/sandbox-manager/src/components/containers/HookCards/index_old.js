import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { removeResultCard } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import muiThemeable from 'material-ui/styles/muiThemeable';

import './styles.less';
import { RaisedButton, Tab, Tabs, TextField } from 'material-ui';
import ReactJson from 'react-json-view';

class HookCards extends Component {
    constructor (props) {
        super(props);

        this.state = {
            cardToRemove: undefined,
            removedCard: undefined,
            activeTab: 'view'
        }
    }

    componentWillReceiveProps (nextProps) {
        nextProps.cards.length < this.props.cards.length && this.setState({ selectedCard: undefined, cardToRemove: undefined });
    }

    render () {
        return <div className='hook-cards-wrapper' style={{ height: `${this.props.cards.length * 32}px` }}>
            {this.getCards()}
            <a ref='openLink' style={{ display: 'none' }} target='_blank'/>
        </div>;
    }

    getCards = () => {
        let palette = this.props.muiTheme.palette;

        return this.props.cards.map((card, i) => {
            let classes = `hook-card ${card.indicator}${i === this.state.removedCard ? ' remove' : ''}${i === this.state.selectedCard ? ' open' : ''}`;
            let offset = (this.props.cards.length - i - 1) * 32 - (this.state.selectedCard === i ? 0 : 468);
            this.state.cardToRemove === i && (offset -= 532);
            this.state.cardToRemove > i && (offset -= 32);
            let bottom = `${offset}px`;
            let request = card.requestData;
            let response = Object.assign({}, card);
            delete response.requestData;

            return <div key={i + card.summary.substring(0, 5)} className={classes} style={{ bottom }} onClick={() => this.toggleCard(i)}>
                <span>{card.summary}</span>
                <div className='hook-card-content-wrapper' onClick={this.preventClick}>
                    <Tabs className='card-tabs' contentContainerClassName={`card-tabs-container`} inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}
                          value={this.state.activeTab}>
                        <Tab label='Rendering' className={'view tab' + (this.state.activeTab === 'view' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'view' })} value='view'>
                            <div className='source-wrapper'>
                                <div className='title'>
                                    <span>Source</span>
                                </div>
                                <div className='hook-card-content'>
                                    {card.source && card.source.label
                                        ? <span className={`${card.source.url ? 'link' : ''}`} onClick={() => this.openUrl(card.source.url)}>{card.source.label}</span>
                                        : <span className='alert'>No source provided (this is a required field. Consider adding it to the card)!</span>}
                                </div>
                            </div>
                            {card.detail && <div className='detail-wrapper'>
                                <div className='title'>
                                    <span>Details</span>
                                </div>
                                <div className='hook-card-content' dangerouslySetInnerHTML={{ __html: card.detail }}/>
                            </div>}
                            {card.links && card.links.length && <div className='links-wrapper'>
                                <div className='title'>
                                    <span>Links</span>
                                </div>
                                <div className='hook-card-content'>
                                    {card.links && card.links.map((link, key) => {
                                        return <RaisedButton onClick={() => this.openUrl(link.url)} overlayStyle={{ padding: '0 16px' }} key={key}>
                                            <span style={{ position: 'relative', marginRight: '10px' }}>{link.label}</span>
                                        </RaisedButton>
                                    })}
                                </div>
                            </div>}
                            <div className='hook-card-actions'>
                                <RaisedButton onClick={() => this.removeCard(i)} overlayStyle={{ padding: '0 16px' }}>
                                    <span style={{ position: 'relative', marginRight: '10px' }}>Dismiss card</span>
                                </RaisedButton>
                            </div>
                        </Tab>
                        <Tab label='request' className={'request tab' + (this.state.activeTab === 'request' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'request' })} value='request'>
                            <div>
                                <ReactJson src={request} name={false}/>
                            </div>
                        </Tab>
                        <Tab label='Response' className={'response tab' + (this.state.activeTab === 'response' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'response' })} value='response'>
                            <div>
                                <ReactJson src={response} name={false}/>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        })
    };

    openUrl = (url) => {
        let openLink = this.refs.openLink;
        openLink.href = url;
        url && openLink.click();
    };

    preventClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    toggleCard = (index) => {
        let selectedCard = this.state.selectedCard !== index ? index : undefined;
        this.setState({ selectedCard });
    };

    removeCard = (index) => {
        this.setState({ cardToRemove: index }, () => {
            setTimeout(() => {
                this.props.removeResultCard(index);
            }, 300)
        });
    };
}

const mapStateToProps = state => {
    return {
        cards: state.hooks.cards
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({ removeResultCard }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(HookCards)))
