import React from 'react';
import Section from 'component/section';
import Grid from 'component/grid';
import Card from 'component/card';
import Button from 'component/button';
import FaIcon from 'component/faicon';

import {mountainPreview, thamesPreview} from 'config';

const CardContainer = () => {
  return (
    <div>
      <Section id="cards" sectionTitle="Cards anyone?" container padded>
        <Grid map md={8} sm={12}>
          <Card
            colkey="underground"
            size="md"
            restrictHeight
            background="https://xorkevin.github.io/stratosphere/assets/underground.jpg"
            title={[
              <h3>Lorem ipsum</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>View</Button>]}
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Card>
          <Card
            colkey="mountain"
            size="md"
            restrictHeight
            background="https://xorkevin.github.io/stratosphere/assets/mountain.jpg"
            preview={mountainPreview}
            title={[
              <h3>Dolor sit amet</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>View</Button>]}
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
              dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
              sit amet, egestas ut risus. In hac habitasse platea dictumst.
              Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
            </p>
          </Card>
          <Card
            colkey="forest"
            size="md"
            restrictHeight
            background="https://xorkevin.github.io/stratosphere/assets/forest.jpg"
            title={[
              <h3>Consectetur</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>View</Button>]}
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Card>
          <Card
            colkey="flower"
            size="md"
            restrictHeight
            background="https://xorkevin.github.io/stratosphere/assets/flower.jpg"
            title={[
              <h3>Adipiscing elit</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>View</Button>]}
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Card>
          <Card
            colkey="climb"
            size="md"
            restrictHeight
            background="https://xorkevin.github.io/stratosphere/assets/climb.jpg"
            title={[
              <h3>Integer fringilla</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>View</Button>]}
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Card>
          <Card
            colkey="thames"
            size="md"
            restrictHeight
            background="https://xorkevin.github.io/stratosphere/assets/thames.jpg"
            preview={thamesPreview}
            title={[
              <h3>Aliquet</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>View</Button>]}
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Card>
        </Grid>
        <div>
          <Card
            size="lg"
            square
            background="https://xorkevin.github.io/stratosphere/assets/climb.jpg"
            title={[
              <h3>Vivamus nibh enim</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>Share</Button>]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
            dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
            sit amet, egestas ut risus. In hac habitasse platea dictumst.
            Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
          </Card>
          <Card
            size="md"
            square
            background="https://xorkevin.github.io/stratosphere/assets/flower.jpg"
            title={[
              <h3>Vivamus nibh enim</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>Share</Button>]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
            dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
            sit amet, egestas ut risus. In hac habitasse platea dictumst.
            Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
          </Card>
          <Card
            size="sm"
            square
            background="https://xorkevin.github.io/stratosphere/assets/underground.jpg"
            title={[
              <h3>Vivamus nibh enim</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>Share</Button>]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
            dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
            sit amet, egestas ut risus. In hac habitasse platea dictumst.
            Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
          </Card>
          <Card
            size="md"
            restrictWidth
            titleBar
            title={[
              <h3>Vivamus nibh enim</h3>,
              <Button label="favorite">
                <FaIcon icon="heart" />
              </Button>,
            ]}
            bar={[<Button>Share</Button>]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet
            dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit
            sit amet, egestas ut risus. In hac habitasse platea dictumst.
            Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default CardContainer;
