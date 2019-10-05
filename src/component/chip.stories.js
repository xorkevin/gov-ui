import React, {Fragment} from 'react';
import Chip from 'component/chip';

export default {title: 'Chip'};

export const plain = () => (
  <Fragment>
    <Chip>here</Chip>
    <Chip>are</Chip>
    <Chip>some chips</Chip>
  </Fragment>
);
