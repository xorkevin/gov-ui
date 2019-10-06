import React, {Fragment} from 'react';
import Grid from 'component/grid';
import Card from 'component/card';
import Button from 'component/button';
import {mountainPreview, thamesPreview} from 'config';

export default {title: 'Grid'};

const cards = [
  <Card
    key="underground"
    size="md"
    restrictHeight
    background="https://xorkevin.github.io/stratosphere/assets/underground.jpg"
    title={
      <Fragment>
        <h3>Lorem ipsum</h3>
      </Fragment>
    }
    bar={<Button>View</Button>}
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </Card>,
  <Card
    key="mountain"
    size="md"
    restrictHeight
    background="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
    title={
      <Fragment>
        <h3>Dolor sit amet</h3>
      </Fragment>
    }
    bar={<Button>View</Button>}
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla
      aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta
      at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus.
      In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
      consequat at, sagittis in magna.
    </p>
  </Card>,
  <Card
    key="forest"
    size="md"
    restrictHeight
    background="https://xorkevin.github.io/stratosphere/assets/forest.jpg"
    title={
      <Fragment>
        <h3>Consectetur</h3>
      </Fragment>
    }
    bar={<Button>View</Button>}
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </Card>,
  <Card
    key="climb"
    size="md"
    restrictHeight
    background="https://xorkevin.github.io/stratosphere/assets/climb.jpg"
    title={
      <Fragment>
        <h3>Integer fringilla</h3>
      </Fragment>
    }
    bar={<Button>View</Button>}
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </Card>,
  <Card
    key="thames"
    size="md"
    restrictHeight
    background="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
    preview={thamesPreview}
    title={
      <Fragment>
        <h3>Aliquet</h3>
      </Fragment>
    }
    bar={<Button>View</Button>}
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </Card>,
];

export const plain = () => (
  <Grid map md={8} sm={12}>
    {cards}
  </Grid>
);

export const strict = () => (
  <Grid map strict md={8} sm={12}>
    {cards}
  </Grid>
);

export const verticalCenter = () => (
  <Grid map verticalCenter md={8} sm={12}>
    {cards}
  </Grid>
);

export const horizontalCenter = () => (
  <Grid map horizontalCenter md={8} sm={12}>
    {cards}
  </Grid>
);
