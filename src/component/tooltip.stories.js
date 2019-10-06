import React from 'react';
import Tooltip from 'component/tooltip';

export default {title: 'Tooltip'};

export const plain = () => (
  <Tooltip tooltip="some text here">Hover over</Tooltip>
);

export const left = () => (
  <Tooltip position="left" tooltip="some text here">
    Hover over
  </Tooltip>
);

export const right = () => (
  <Tooltip position="right" tooltip="some text here">
    Hover over
  </Tooltip>
);

export const bottom = () => (
  <Tooltip position="bottom" tooltip="some text here">
    Hover over
  </Tooltip>
);
