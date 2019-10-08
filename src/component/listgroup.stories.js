import React, {Fragment} from 'react';
import ListGroup, {ListItem} from 'component/listgroup';
import Grid, {Column} from 'component/grid';
import Chip from 'component/chip';
import Time from 'component/time';

export default {title: 'List Group'};

export const plain = () => (
  <ListGroup>
    <ListItem>
      <div>here is a list</div>
    </ListItem>
    <ListItem>
      <div>of some items</div>
    </ListItem>
    <ListItem>
      <div>in a list group</div>
    </ListItem>
  </ListGroup>
);

export const sm = () => (
  <ListGroup size="sm">
    <ListItem>
      <div>here is a list</div>
    </ListItem>
    <ListItem>
      <div>of some items</div>
    </ListItem>
    <ListItem>
      <div>in a list group</div>
    </ListItem>
  </ListGroup>
);

export const md = () => (
  <ListGroup size="md">
    <ListItem>
      <div>here is a list</div>
    </ListItem>
    <ListItem>
      <div>of some items</div>
    </ListItem>
    <ListItem>
      <div>in a list group</div>
    </ListItem>
  </ListGroup>
);

export const lg = () => (
  <ListGroup size="lg">
    <ListItem>
      <div>here is a list</div>
    </ListItem>
    <ListItem>
      <div>of some items</div>
    </ListItem>
    <ListItem>
      <div>in a list group</div>
    </ListItem>
  </ListGroup>
);

export const badge = () => (
  <ListGroup size="sm">
    <ListItem>
      <div>
        <h5>Inbox</h5>
        <Chip primary>16</Chip>
      </div>
    </ListItem>
    <ListItem>
      <div>
        <h5>Sent</h5>
        <Chip primary>8</Chip>
      </div>
    </ListItem>
    <ListItem>
      <div>
        <h5>Trash</h5>
        <Chip primary>2</Chip>
      </div>
    </ListItem>
  </ListGroup>
);

export const title = () => (
  <ListGroup size="lg">
    <ListItem>
      <Grid>
        <Column md={20}>
          <h3>Lorem ipsum</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
            dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
            sit amet, egestas ut risus.
          </p>
        </Column>
        <Column md={4}>
          <Time value={Date.now() - 86400000} />
        </Column>
      </Grid>
    </ListItem>
    <ListItem>
      <Grid>
        <Column md={20}>
          <h3>Dolor sit amet</h3>
          <p>
            In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
            consequat at, sagittis in magna.
          </p>
        </Column>
        <Column md={4}>
          <Time value={Date.now() - 86400000} />
        </Column>
      </Grid>
    </ListItem>
    <ListItem>
      <Grid>
        <Column md={20}>
          <h3>Consectetur adipiscing elit</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
            dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
            sit amet, egestas ut risus.
          </p>
        </Column>
        <Column md={4}>
          <Time value={Date.now() - 3 * 86400000} />
        </Column>
      </Grid>
    </ListItem>
  </ListGroup>
);
