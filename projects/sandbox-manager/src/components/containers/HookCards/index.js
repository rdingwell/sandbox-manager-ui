import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { removeResultCard } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import muiThemeable from 'material-ui/styles/muiThemeable';

import './styles.less';
import FeedbackIcon from '../../App';
import { RaisedButton } from 'material-ui';

class HookCards extends Component {
    constructor (props) {
        super(props);

        this.state = {
            cardToRemove: undefined,
            removedCard: undefined
        }
    }

    render () {
        return <div className='hook-cards-wrapper' style={{ height: `${this.props.cards.length * 32}px` }}>
            {this.getCards()}
            <a ref='openLink' style={{ display: 'none' }} target='_blank'/>
        </div>;
    }

    getCards = () => {
        return this.props.cards.map((card, i) => {
            let classes = `hook-card ${card.indicator}${i === this.state.removedCard ? ' remove' : ''}${i === this.state.selectedCard ? ' open' : ''}`;
            if (this.state.cardToRemove !== undefined && this.state.cardToRemove > i) {
                i++;
            }

            return <div key={i} className={classes} style={{ bottom: `${(this.props.cards.length - i - 1) * 32 - (this.state.selectedCard === i ? 32 : 300)}px` }} onClick={() => this.toggleCard(i)}>
                <span>{card.summary}</span>
                <div className='hook-card-content-wrapper' onClick={this.preventClick}>
                    <span>
                        Source: {card.source && card.source.label
                        ? <span className={`${card.source.url ? 'link' : ''}`} onClick={() => this.openUrl(card.source.url)}>{card.source.label}</span>
                        : <span className='alert'>No source provided (this is a required field. Consider adding it to the card)!</span>}
                    </span>
                    {card.detail && <div className='detail-wrapper' dangerouslySetInnerHTML={{ __html: card.detail }}/>}
                    <div className='links-wrapper'>
                        {card.links && card.links.map(link => {
                            return <RaisedButton onClick={() => this.openUrl(link.url)} overlayStyle={{ padding: '0 16px' }}>
                                <span style={{ position: 'relative', marginRight: '10px' }}>{link.label}</span>
                            </RaisedButton>
                        })}
                    </div>
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
            this.setState({ removedCard: index });
            setTimeout(() => {
                this.props.removeResultCard(index);
                this.setState({ removedCard: index }, () => {

                });
            }, 500);
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
