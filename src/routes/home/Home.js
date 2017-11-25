/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {
  Grid,
  Form,
  Button,
  Message,
  Segment,
  Header,
  Image,
} from 'semantic-ui-react';
import { decode } from 'deckstrings';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CardViewTable from '../../components/CardViewTable/CardViewTable';
import s from './Home.css';
import frozenImage from '../../../public/images/frozen.png';
import goroImage from '../../../public/images/goro.png';
import gadgetImage from '../../../public/images/gadget.png';
import wtogImage from '../../../public/images/wtog.png';
import karaImage from '../../../public/images/kara.png';

const initialState = {
  isError: false,
  deckInputString: '',
  userDeck: undefined,
  userDeckFull: [],
  allCards: undefined,
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.json', {
      method: 'GET',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return response.error("Server didn't answer");
      })
      .then(data => {
        this.setState({ allCards: data });
      })
      .catch(() => {
        console.error('We had some error');
      });
  }

  getDeckString = () => {
    let decodedDeck;
    const deckInput = this.state.deckInputString;
    if (deckInput.length > 0) {
      try {
        decodedDeck = decode(deckInput);
        this.setState({ userDeck: decodedDeck }, this.getFullDeckInfo);
      } catch (e) {
        this.setState({ isError: true });
        console.error('Deck hash is wrong');
      }
    }
  };

  getFullDeckInfo = () => {
    const { userDeck } = this.state.userDeck;
    if (userDeck.format !== 2) {
      this.setState({ isError: true });
    } else {
      const deckInfo = [];
      this.state.allCards.forEach(card => {
        userDeck.cards.forEach(userCard => {
          if (userCard[0] === card.dbfId) {
            deckInfo.push({ ...card, count: userCard[1] });
          }
        });
      });
      this.setState({ userDeckFull: deckInfo });
    }
  };

  deckInputOnChange = (event, input) => {
    if (input && input.value.length > 0) {
      this.setState({
        deckInputString: input.value,
        isError: false,
      });
    }
  };

  // resetForm = () => {
  //   this.setState({
  //     isError: false,
  //     deckInputString: '',
  //     userDeck: undefined,
  //     userDeckFull: [],
  //   });
  // };

  render() {
    return (
      <div>
        <Grid className={s.container} columns={3} divided>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header as="h3">Deck Input</Header>
              <Form error={this.state.isError} onSubmit={this.getDeckString}>
                <Form.Input
                  name="deck"
                  onChange={this.deckInputOnChange}
                  autoComplete="off"
                  placeholder="Paste your deck here!"
                  fluid
                />
                <Message
                  error
                  header="Wrong Hash"
                  content="Looks like the hash you've provided is invalid, please provide correct deck hash"
                />
                <Button type="submit"> Check Deck</Button>
              </Form>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h3">Deck stats</Header>
              <CardViewTable
                userDeck={this.state.userDeckFull.sort(
                  (a, b) => a.cost - b.cost,
                )}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Header as="h3">Standard Sets</Header>
              <Segment.Group>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=2&filter-unreleased=1">
                    Basic
                  </a>
                </Segment>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=3&filter-unreleased=1">
                    Classic
                  </a>
                </Segment>
                <Segment inverted color="olive" size="tiny">
                  {`Default part of Standard, won't be removed`}
                </Segment>
              </Segment.Group>
              <Segment.Group>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=105&filter-unreleased=1">
                    Whispers of the Old God
                  </a>
                  <Image src={wtogImage} floated="right" />
                </Segment>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=106&filter-unreleased=1">
                    One Night in Karazhan
                    <Image src={karaImage} floated="right" />
                  </a>
                </Segment>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=107&filter-unreleased=1">
                    Mean Streets of Gadgetzan
                    <Image src={gadgetImage} floated="right" />
                  </a>
                </Segment>
                <Segment inverted color="olive" size="tiny">
                  Until the first release of a new set in 2018
                </Segment>
              </Segment.Group>
              <Segment.Group>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=108&filter-unreleased=1">
                    {`Journey to Un'Goro`}
                    <Image src={goroImage} floated="right" />
                  </a>
                </Segment>
                <Segment>
                  <a href="http://www.hearthpwn.com/cards?display=1&filter-premium=1&filter-set=109&filter-unreleased=1">
                    Knights of the Frozen Throne
                    <Image src={frozenImage} floated="right" />
                  </a>
                </Segment>
                <Segment inverted color="teal" size="tiny">
                  Until the first release of a new set in 2019
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default withStyles(s)(Home);
