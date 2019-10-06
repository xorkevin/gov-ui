import React, {Fragment} from 'react';
import ListItem from 'component/list';

export default {title: 'ListItem'};

export const plain = () => (
  <Fragment>
    <ListItem label="label" item="value" />
    <ListItem label="another label" item="some value" />
    <ListItem label="name" item="Kevin Wang" />
    <ListItem label="project" item="Nuke" />
  </Fragment>
);
