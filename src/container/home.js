import {h} from 'preact';
import Section from 'component/section';
import Container from 'component/container';
import Article from 'component/article';
import {CommentSection, Comment} from 'component/comment';
import Img from 'component/image';

import {mountainPreview, thamesPreview} from 'config';

const HomeContainer = () => {
  return (
    <div>
      <Img
        size="full"
        imgWidth={1920}
        imgHeight={1080}
        src="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
        preview={mountainPreview}
      >
        <header style={{width: '100%'}}>
          <Container padded narrow>
            <h1 className="colossal">Nuke</h1>
            <h4>a reactive frontend for governor</h4>
          </Container>
        </header>
      </Img>

      <Section
        id="typography"
        sectionTitle="Typography"
        container
        padded
        narrow
      >
        <h1>
          Heading 1 <small>small</small>
        </h1>
        <h2>
          Heading 2 <small>small</small>
        </h2>
        <h3>
          Heading 3 <small>small</small>
        </h3>
        <h4>
          Heading 4 <small>small</small>
        </h4>
        <h5>
          Heading 5 <small>small</small>
        </h5>
        <h6>
          Heading 6 <small>small</small>
        </h6>
        <span>
          Text <small>small</small>
        </span>
      </Section>

      <Article
        title="Lorem ipsum"
        author="Kevin Wang"
        time={Date.now() - 86400000}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
          dictum massa porta at.
        </p>
        <p>
          Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus.
          In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis
          consequat at, sagittis in magna. Aliquam accumsan, nisl vel
          sollicitudin fringilla, libero neque vehicula mauris, eu laoreet nunc
          ligula convallis nulla. Aliquam felis elit, fermentum ac felis
          sagittis, porttitor placerat odio.
        </p>
        <p>
          Ut consectetur est lectus, sed maximus libero malesuada ut. Proin
          aliquet, sapien et pretium feugiat, dui diam posuere diam, ut tempor
          elit purus quis metus.
        </p>
        <Img
          className="outset"
          imgWidth={1920}
          imgHeight={1080}
          preview={thamesPreview}
          src="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
        />
        <p>
          Nulla facilisi. Phasellus blandit interdum est, in pellentesque nunc
          fermentum et. Proin nibh risus, sollicitudin ac urna sed, aliquet
          hendrerit massa. Pellentesque vehicula fringilla purus, sit amet
          bibendum turpis malesuada in. Aliquam nisl enim, elementum id dapibus
          at, suscipit non arcu. Suspendisse sodales massa vitae dolor
          vestibulum, lacinia congue enim hendrerit.
        </p>
        <p>
          Curabitur dapibus, arcu a pulvinar pulvinar, lectus elit eleifend
          dolor, id tincidunt nunc dolor eu orci. Sed neque massa, cursus et
          enim quis, gravida fermentum est. Nam non justo accumsan arcu volutpat
          ullamcorper sit amet nec mi.
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Integer a sagittis nibh, sit amet posuere
          sapien. Aliquam erat volutpat. Phasellus vitae cursus turpis, posuere
          viverra diam.
        </p>
        <p>Fusce mollis consectetur ligula.</p>
      </Article>
      <CommentSection>
        <Comment
          username="xorkevin"
          score={256}
          time={Date.now() - 0.5 * 86400000}
          content="Lorem ipsum dolor sit amet"
        >
          <Comment
            username="xorkevin"
            score={32}
            time={Date.now() - 0.25 * 86400000}
            content="Consectetur adipiscing elit"
          >
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            />
          </Comment>
          <Comment
            username="xorkevin"
            score={128}
            time={Date.now() - 0.325 * 86400000}
            content="Nunc facilisis orci dui, sit amet dictum massa porta at"
          >
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            />
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            >
              <Comment
                username="xorkevin"
                score={16}
                time={Date.now()}
                content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
              >
                <Comment
                  username="xorkevin"
                  score={16}
                  time={Date.now()}
                  content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                />
              </Comment>
            </Comment>
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            />
          </Comment>
        </Comment>
        <Comment
          username="xorkevin"
          score={64}
          time={Date.now() - 0.75 * 86400000}
          content="Integer fringilla aliquet condimentum"
        >
          <Comment
            username="xorkevin"
            score={8}
            time={Date.now() - 0.015625 * 86400000}
            content="In hac habitasse platea dictumst"
          />
          <Comment
            username="xorkevin"
            score={16}
            time={Date.now()}
            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
          />
        </Comment>
        <Comment
          username="xorkevin"
          score={1}
          time={Date.now() - 180000}
          content="Vivamus nibh enim, dignissim quis consequat at, sagittis in magna"
        >
          <Comment
            username="xorkevin"
            score={16}
            time={Date.now()}
            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
          >
            <Comment
              username="xorkevin"
              score={16}
              time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
            >
              <Comment
                username="xorkevin"
                score={16}
                time={Date.now()}
                content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
              >
                <Comment
                  username="xorkevin"
                  score={16}
                  time={Date.now()}
                  content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                >
                  <Comment
                    username="xorkevin"
                    score={16}
                    time={Date.now()}
                    content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                  >
                    <Comment
                      username="xorkevin"
                      score={16}
                      time={Date.now()}
                      content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                    >
                      <Comment
                        username="xorkevin"
                        score={16}
                        time={Date.now()}
                        content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                      >
                        <Comment
                          username="xorkevin"
                          score={16}
                          time={Date.now()}
                          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                        >
                          <Comment
                            username="xorkevin"
                            score={16}
                            time={Date.now()}
                            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus"
                          />
                        </Comment>
                      </Comment>
                    </Comment>
                  </Comment>
                </Comment>
              </Comment>
            </Comment>
          </Comment>
        </Comment>
      </CommentSection>
    </div>
  );
};

export default HomeContainer;
