import React, {Fragment} from 'react';
import Card from 'component/card';
import Button from 'component/button';
import FaIcon from 'component/faicon';
import Description from 'component/description';
import {mountainPreview} from 'config';

export default {title: 'Card'};

export const plain = () => (
  <Card
    size="md"
    restrictHeight
    background="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
    title={
      <Fragment>
        <h3>Dolor sit amet</h3>
        <Button label="favorite">
          <FaIcon icon="heart" />
        </Button>
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

export const lg = () => (
  <Card
    size="lg"
    square
    background="https://xorkevin.github.io/stratosphere/assets/climb.jpg"
    title={
      <Fragment>
        <h3>Vivamus nibh enim</h3>
        <Button label="favorite">
          <FaIcon icon="heart" />
        </Button>
      </Fragment>
    }
    bar={<Button>Share</Button>}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla
    aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta
    at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus.
    In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
    consequat at, sagittis in magna.
    <Description label="Project" item="Nuke" />
    <Description label="Language" item="Javascript" />
  </Card>
);

export const md = () => (
  <Card
    size="md"
    square
    background="https://xorkevin.github.io/stratosphere/assets/flower.jpg"
    title={
      <Fragment>
        <h3>Vivamus nibh enim</h3>
        <Button label="favorite">
          <FaIcon icon="heart" />
        </Button>
      </Fragment>
    }
    bar={<Button>Share</Button>}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla
    aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta
    at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus.
    In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
    consequat at, sagittis in magna.
  </Card>
);

export const sm = () => (
  <Card
    size="sm"
    square
    background="https://xorkevin.github.io/stratosphere/assets/underground.jpg"
    title={
      <Fragment>
        <h3>Vivamus nibh enim</h3>
        <Button label="favorite">
          <FaIcon icon="heart" />
        </Button>
      </Fragment>
    }
    bar={<Button>Share</Button>}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla
    aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta
    at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus.
    In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
    consequat at, sagittis in magna.
  </Card>
);

export const textTitle = () => (
  <Card
    size="md"
    restrictWidth
    titleBar
    title={
      <Fragment>
        <h3>Vivamus nibh enim</h3>
        <Button label="favorite">
          <FaIcon icon="heart" />
        </Button>
      </Fragment>
    }
    bar={<Button>Share</Button>}
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla
    aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta
    at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus.
    In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
    consequat at, sagittis in magna.
  </Card>
);
