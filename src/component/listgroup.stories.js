import React, {Fragment} from 'react';
import ListGroup, {ListItem} from 'component/listgroup';

export default {title: 'List Group'};

export const plain = () => (
  <ListGroup>
    <ListItem>here is a list</ListItem>
    <ListItem>of some items</ListItem>
  </ListGroup>
);

export const sm = () => (
  <ListGroup size="sm">
    <ListItem>here is a list</ListItem>
    <ListItem>of some items</ListItem>
  </ListGroup>
);

export const md = () => (
  <ListGroup size="md">
    <ListItem>here is a list</ListItem>
    <ListItem>of some items</ListItem>
  </ListGroup>
);

export const lg = () => (
  <ListGroup size="lg">
    <ListItem>here is a list</ListItem>
    <ListItem>of some items</ListItem>
  </ListGroup>
);
