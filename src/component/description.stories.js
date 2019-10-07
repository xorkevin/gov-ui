import React, {Fragment} from 'react';
import Description from 'component/description';

export default {title: 'Description'};

export const plain = () => (
  <Fragment>
    <Description label="label" item="value" />
    <Description label="another label" item="some value" />
    <Description label="name" item="Kevin Wang" />
    <Description label="project" item="Nuke" />
  </Fragment>
);
