import React from 'react';
import Img from 'component/image';
import Container from 'component/container';
import {mountainPreview} from 'config';

export default {title: 'Image'};

export const plain = () => (
  <Img
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
  />
);

export const rounded = () => (
  <Img
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
    rounded
  />
);

const headerText = (
  <header style={{width: '100%'}}>
    <Container padded narrow>
      <h1 className="colossal">Nuke</h1>
      <h4>a reactive frontend for governor</h4>
    </Container>
  </header>
);

export const text = () => (
  <Img
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
  >
    {headerText}
  </Img>
);

export const light = () => (
  <Img
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
    light
  >
    {headerText}
  </Img>
);

export const noShadow = () => (
  <Img
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
    noShadow
  >
    {headerText}
  </Img>
);

export const fullSize = () => (
  <Img
    size="full"
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
  >
    {headerText}
  </Img>
);

export const fixed = () => (
  <Img
    fixed
    size="full"
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    preview={mountainPreview}
  >
    {headerText}
  </Img>
);

export const colorFixed = () => (
  <Img
    fixed
    size="full"
    imgWidth={1920}
    imgHeight={1080}
    src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
    color="#30343F"
  >
    {headerText}
  </Img>
);
