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

export const primary = () => (
  <Fragment>
    <Chip primary>here</Chip>
    <Chip primary>are</Chip>
    <Chip primary>some chips</Chip>
  </Fragment>
);
