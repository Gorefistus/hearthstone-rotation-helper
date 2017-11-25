import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Table, Image } from 'semantic-ui-react';
import imageLinks from 'hearthstone-card-images'; //eslint-disable-line
import CardCell from '../CardCell/CardCell';

import manaIcon from '../../../public/images/mana_icon.png';
import dustIcon from '../../../public/images/icon-dust.png';

import s from './cardviewtable.css';

const rotatingSets = ['KARA', 'GANGS', 'OG'];
const rarityDustValue = {
  FREE: 0,
  COMMON: 5,
  RARE: 20,
  EPIC: 100,
  LEGENDARY: 400,
};

class CardView extends React.Component {
  static propTypes = {
    userDeck: PropTypes.arrayOf(PropTypes.any).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      column: undefined,
      order: undefined,
      userDeck: props.userDeck,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ userDeck: nextProps.userDeck });
  }

  getRotationStatus = card => {
    let rotationMessage = 'Not rotating next time';
    rotatingSets.forEach(rotatingSet => {
      if (rotatingSet === card.set) {
        rotationMessage = (
          <div>
            {rarityDustValue[card.rarity] * card.count}
            <Image inline spaced="left" src={dustIcon} />
          </div>
        );
      }
    });
    return rotationMessage;
  };

  getCardImageUrl = card => {
    let cardImageUrl;
    for (let i = 0; i < imageLinks.length; i += 1) {
      if (imageLinks[i].dbfId === card.dbfId) {
        cardImageUrl = imageLinks[i].url;
        break;
      }
    }
    return cardImageUrl;
  };

  isCardRotating = card => {
    let dustValue;
    rotatingSets.forEach(ratatingSet => {
      if (ratatingSet === card.set) {
        dustValue = rarityDustValue[card.rarity] * card.count;
      }
    });
    return dustValue;
  };

  handleSort = sortedParam => {
    const { column, order, userDeck } = this.state;

    if (column !== sortedParam) {
      let sortedDeck = userDeck;
      switch (sortedParam) {
        case 'name':
          sortedDeck = sortedDeck.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          break;
        case 'cost':
          sortedDeck = sortedDeck.sort((a, b) => {
            if (a.cost < b.cost) return -1;
            if (a.cost > b.cost) return 1;
            return 0;
          });
          break;
        case 'dust':
          sortedDeck = sortedDeck.sort((a, b) => {
            if (
              this.isCardRotating(a) !== undefined &&
              this.isCardRotating(b) !== undefined
            ) {
              if (this.isCardRotating(a) < this.isCardRotating(b)) return -1;
              if (this.isCardRotating(a) > this.isCardRotating(b)) return 1;
              return 0;
            } else if (this.isCardRotating(a) !== undefined) {
              return 1;
            }
            return -1;
          });
          break;
        default:
        // do nothing
      }
      this.setState({
        column: sortedParam,
        userDeck: sortedDeck,
        order: 'ascending',
      });

      return;
    }

    this.setState({
      userDeck: userDeck.reverse(),
      order: order === 'ascending' ? 'descending' : 'ascending',
    });
  };

  render() {
    return (
      <Table basic="very" celled sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={this.state.column === 'name' ? this.state.order : null}
              onClick={() => this.handleSort('name')}
            >
              Card Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={this.state.column === 'cost' ? this.state.order : null}
              onClick={() => this.handleSort('cost')}
            >
              Mana Cost
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={this.state.column === 'dust' ? this.state.order : null}
              onClick={() => this.handleSort('dust')}
            >
              Rotation Status
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.userDeck.map(card => (
            <Table.Row key={card.dbfId}>
              <Table.Cell>
                <CardCell card={card} cardUrl={this.getCardImageUrl(card)} />
              </Table.Cell>
              <Table.Cell>
                {card.cost}
                <Image inline spaced="left" src={manaIcon} />{' '}
              </Table.Cell>
              <Table.Cell>{this.getRotationStatus(card)} </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default withStyles(s)(CardView);
