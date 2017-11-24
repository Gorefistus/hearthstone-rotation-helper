import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Table } from 'semantic-ui-react';
import imageLinks from 'hearthstone-card-images';
import CardCell from '../CardCell/CardCell';

import s from './cardviewtable.css';

const rotatingSets = ['KARA', 'GANGS', 'OG'];
const rarityDustValue = {
  FREE: 0,
  COMMON: 5,
  RARE: 20,
  EPIC: 100,
  LEGENDARY: 400,
};

class CardView extends React.PureComponent {
  getRotationStatus = card => {
    let rotationMessage = 'Not rotating next time!';
    rotatingSets.forEach(rotatingSet => {
      if (rotatingSet === card.set) {
        rotationMessage = `Will dust for ${rarityDustValue[card.rarity] *
          card.count}`;
      }
    });
    return rotationMessage;
  };

  getCardImageUrl = card => {
    let cardImageUrl;
    for (let i = 0; i < imageLinks.length; i++) {
      if (imageLinks[i].dbfId === card.dbfId) {
        cardImageUrl = imageLinks[i].url;
        break;
      }
    }
    return cardImageUrl;
  };

  render() {
    return (
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Card Name</Table.HeaderCell>
            <Table.HeaderCell>Rotation Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.userDeck.map(card => (
            <Table.Row key={card.dbfId}>
              <Table.Cell>
                <CardCell card={card} cardUrl={this.getCardImageUrl(card)} />
              </Table.Cell>
              <Table.Cell>{this.getRotationStatus(card)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default withStyles(s)(CardView);
