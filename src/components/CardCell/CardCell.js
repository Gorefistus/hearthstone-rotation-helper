import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './cardcell.css';
import {Popup, Image} from 'semantic-ui-react';

const rarityEnum = {
  FREE: 'free',
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

class CardCell extends React.PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s[rarityEnum[this.props.card.rarity]]}>
          <Popup trigger={<div>{this.props.card.name}</div>} content={<Image src={this.props.cardUrl}/>}/>
        </div>
        <div className={s.count}> {` x${this.props.card.count}`}</div>
      </div>
    );
  }
}

export default withStyles(s)(CardCell);
