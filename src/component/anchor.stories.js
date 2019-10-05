import React from 'react';
import Anchor from 'component/anchor';

export default {title: 'Anchor'};

export const plain = () => <Anchor href="#">some link text</Anchor>;

export const noStyle = () => (
  <Anchor noStyle href="#">
    some link text
  </Anchor>
);

export const noColor = () => (
  <Anchor noColor href="#">
    some link text
  </Anchor>
);

export const external = () => (
  <Anchor ext href="https://github.com/xorkevin">
    xorkevin github
  </Anchor>
);
