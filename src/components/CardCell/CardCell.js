import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Popup, Image } from 'semantic-ui-react';

import s from './cardcell.css'; //eslint-disable-line

import karaSymbol from '../../../public/images/set_symbols/exp6-icon.png';
import wtogSymbol from '../../../public/images/set_symbols/exp5-icon.png';
import gadgetSymbol from '../../../public/images/set_symbols/exp7-icon.png';
import goroSymbol from '../../../public/images/set_symbols/exp8-icon.png';
import frozenSymbol from '../../../public/images/set_symbols/exp9-icon.png';

const standardSets = ['KARA', 'GANGS', 'OG', 'UNGORO', 'ICECROWN'];

const rarityEnum = {
  FREE: 'free',
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

class CardCell extends React.PureComponent {
  static propTypes = {
    card: PropTypes.objectOf(PropTypes.any).isRequired,
    cardUrl: PropTypes.string.isRequired,
  };

  getImageSrc = setName => {
    let imageSrc;
    switch (setName) {
      case standardSets[0]:
        imageSrc = karaSymbol;
        break;
      case standardSets[1]:
        imageSrc = gadgetSymbol;
        break;
      case standardSets[2]:
        imageSrc = wtogSymbol;
        break;
      case standardSets[3]:
        imageSrc = goroSymbol;
        break;
      case standardSets[4]:
        imageSrc = frozenSymbol;
        break;
      default:
      // do nothing
    }
    return imageSrc;
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s[rarityEnum[this.props.card.rarity]]}>
          <Popup
            trigger={
              <div>
                <Image
                  src={this.getImageSrc(this.props.card.set)}
                  floated="left"
                />
                {this.props.card.name}
              </div>
            }
            content={<Image src={this.props.cardUrl} />}
          />
        </div>
        <div className={s.count}> {` x${this.props.card.count}`}</div>
      </div>
    );
  }
}

export default withStyles(s)(CardCell);
