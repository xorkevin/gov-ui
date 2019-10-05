import React from 'react';
import Article from 'component/article';
import Img from 'component/image';
import {thamesPreview} from 'config';

export default {title: 'Article'};

export const plain = () => (
  <Article
    title="Lorem ipsum"
    subtitle="Dolor sit amet"
    author={{
      name: 'Kevin Wang',
      bio: 'Tech evangelist and web dev. Experiences decision fatigue daily.',
    }}
    time={Date.now() - 86400000}
    tags={['list', 'of', 'tags']}
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla
      aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta
      at.
    </p>
    <p>
      Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In
      hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat
      at, sagittis in magna. Aliquam accumsan, nisl vel sollicitudin fringilla,
      libero neque vehicula mauris, eu laoreet nunc ligula convallis nulla.
      Aliquam felis elit, fermentum ac felis sagittis, porttitor placerat odio.
    </p>
    <p>
      Ut consectetur est lectus, sed maximus libero malesuada ut. Proin aliquet,
      sapien et pretium feugiat, dui diam posuere diam, ut tempor elit purus
      quis metus.
    </p>
    <Img
      className="outset"
      imgWidth={1920}
      imgHeight={1080}
      preview={thamesPreview}
      src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
    />
    <div className="caption">Hello, World</div>
    <Img
      imgWidth={1920}
      imgHeight={1080}
      preview={thamesPreview}
      src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
    />
    <Img
      className="inset"
      imgWidth={1920}
      imgHeight={1080}
      preview={thamesPreview}
      src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
    />
    <Img
      className="inset-half"
      imgWidth={1920}
      imgHeight={1080}
      preview={thamesPreview}
      src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
    />
    <div className="contentrow outset">
      <Img
        imgWidth={1920}
        imgHeight={1080}
        preview={thamesPreview}
        src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
      />
      <Img
        imgWidth={1920}
        imgHeight={1080}
        preview={thamesPreview}
        src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
      />
      <Img
        imgWidth={1920}
        imgHeight={1080}
        preview={thamesPreview}
        src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
      />
    </div>
    <p>
      Nulla facilisi. Phasellus blandit interdum est, in pellentesque nunc
      fermentum et. Proin nibh risus, sollicitudin ac urna sed, aliquet
      hendrerit massa. Pellentesque vehicula fringilla purus, sit amet bibendum
      turpis malesuada in. Aliquam nisl enim, elementum id dapibus at, suscipit
      non arcu. Suspendisse sodales massa vitae dolor vestibulum, lacinia congue
      enim hendrerit.
    </p>
    <pre>
      This is some example preformatted text that is extremely long and might
      take more than one line.
    </pre>
    <p>
      Curabitur dapibus, arcu a pulvinar pulvinar, lectus elit eleifend dolor,
      id tincidunt nunc dolor eu orci. Sed neque massa, cursus et enim quis,
      gravida fermentum est. Nam non justo accumsan arcu volutpat ullamcorper
      sit amet nec mi.
    </p>
    <p>
      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
      inceptos himenaeos. Integer a sagittis nibh, sit amet posuere sapien.
      Aliquam erat volutpat. Phasellus vitae cursus turpis, posuere viverra
      diam.
    </p>
    <p>
      Fusce mollis consectetur ligula. <code>Code: Hello, World</code>
    </p>
  </Article>
);
