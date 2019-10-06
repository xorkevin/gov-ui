import React, {Fragment} from 'react';
import Container from 'component/container';
import Card from 'component/card';
import Button from 'component/button';
import {mountainPreview} from 'config';

export default {title: 'Container'};

const card = (
  <Card
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
  </Card>
);

export const plain = () => <Container>{card}</Container>;

export const padded = () => <Container padded>{card}</Container>;

export const narrow = () => <Container narrow>{card}</Container>;
