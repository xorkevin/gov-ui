import React from 'react';
import {action} from '@storybook/addon-actions';

import 'main.scss';
import 'style/storybook.scss';

import Button from 'component/button';

export default {title: 'Button'};

export const plain = () => <Button onClick={action('clicked')}>Button</Button>;

export const fixedWidth = () => <Button fixedWidth>Fixed Width</Button>;

export const callToAction = () => <Button cta>Call To Action</Button>;

export const raised = () => <Button raised>Raised Button</Button>;

export const primary = () => (
  <Button fixedWidth primary>
    Primary
  </Button>
);

export const outline = () => (
  <Button fixedWidth outline>
    Outline
  </Button>
);

export const text = () => (
  <Button fixedWidth text>
    Text
  </Button>
);

export const raisedPrimary = () => (
  <Button raised fixedWidth primary>
    Raised Primary
  </Button>
);

export const raisedOutline = () => (
  <Button raised fixedWidth outline>
    Raised Outline
  </Button>
);

export const raisedText = () => (
  <Button raised fixedWidth text>
    Raised Text
  </Button>
);
