import React, {Fragment} from 'react';
import ListGroup, {ListItem} from 'component/listgroup';

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
