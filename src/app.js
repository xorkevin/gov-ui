import 'main.scss';

import {h, Component} from 'preact';
import Navbar from 'component/navbar';
import Header from 'component/header';
import Footer from 'component/footer';
import Section from 'component/section';
import Grid from 'component/grid';
import Card from 'component/card';
import Article from 'component/article';
import {CommentSection, Comment} from 'component/comment';
import Input from 'component/form';
import Button from 'component/button';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const App = (props)=>{
  return <div id="mount">
    <Navbar left={[
      {key: 'home', scroll: true, component: 'Home', target: ''},
      {key: 'cards', scroll: true, component: 'Cards', target: 'cards'},
      {key: 'typography', scroll: true, component: 'Typography', target: 'typography'},
      {key: 'form', scroll: true, component: 'Form', target: 'form'},
      {key: 'buttons', scroll: true, component: 'Buttons', target: 'buttons'},
    ]} right={[
      {key: 'contact', scroll: false, component: 'Contact'},
      {key: 'xorkevin', scroll: false, component: <span><FaIcon icon="github"/> xorkevin</span>, ext: true, target: 'https://github.com/xorkevin'},
    ]}>
    </Navbar>

    <Header fixed color="#F1F5FD" image="https://xorkevin.github.io/stratosphere/assets/mountain.jpg">
      <h1 className="colossal">Nuke</h1>
      <h4>a reactive frontend for governor</h4>
    </Header>

    <Section id="cards" sectionTitle="Cards anyone?" container padded>
      <Grid md={8} sm={12}>
        <Card colkey="underground" size="md" restrictHeight background="https://xorkevin.github.io/stratosphere/assets/underground.jpg" title={[
            <h3>Lorem ipsum</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>View</Button>
          ]}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Card>
        <Card colkey="mountain" size="md" restrictHeight background="https://xorkevin.github.io/stratosphere/assets/mountain.jpg" title={[
            <h3>Dolor sit amet</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>View</Button>
          ]}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.</p>
        </Card>
        <Card colkey="forest" size="md" restrictHeight background="https://xorkevin.github.io/stratosphere/assets/forest.jpg" title={[
            <h3>Consectetur</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>View</Button>
          ]}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Card>
        <Card colkey="flower" size="md" restrictHeight background="https://xorkevin.github.io/stratosphere/assets/flower.jpg" title={[
            <h3>Adipiscing elit</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>View</Button>
          ]}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Card>
        <Card colkey="climb" size="md" restrictHeight background="https://xorkevin.github.io/stratosphere/assets/climb.jpg" title={[
            <h3>Integer fringilla</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>View</Button>
          ]}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Card>
        <Card colkey="thames" size="md" restrictHeight background="https://xorkevin.github.io/stratosphere/assets/thames.jpg" title={[
            <h3>Aliquet</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>View</Button>
          ]}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Card>
        {'String'}
      </Grid>
      <div>
        <Card size="lg" square background="https://xorkevin.github.io/stratosphere/assets/climb.jpg" title={[
            <h3>Vivamus nibh enim</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>Share</Button>
          ]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
        </Card>
        <Card size="md" square background="https://xorkevin.github.io/stratosphere/assets/flower.jpg" title={[
            <h3>Vivamus nibh enim</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>Share</Button>
          ]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
        </Card>
        <Card size="sm" square background="https://xorkevin.github.io/stratosphere/assets/underground.jpg" title={[
            <h3>Vivamus nibh enim</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>Share</Button>
          ]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
        </Card>
        <Card size="md" restrictWidth titleBar title={[
            <h3>Vivamus nibh enim</h3>,<Button label="favorite"><FaIcon icon="heart"/></Button>
          ]} bar={[
            <Button>Share</Button>
          ]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat at, sagittis in magna.
        </Card>
      </div>
    </Section>

    <Header image="https://xorkevin.github.io/stratosphere/assets/thames.jpg" fixed size="lg"/>

    <Section id="typography" sectionTitle="Typography" container padded>
      <h1>Heading 1 <small>small</small></h1>
      <h2>Heading 2 <small>small</small></h2>
      <h3>Heading 3 <small>small</small></h3>
      <h4>Heading 4 <small>small</small></h4>
      <h5>Heading 5 <small>small</small></h5>
      <h6>Heading 6 <small>small</small></h6>
      <span>Text <small>small</small></span>

      <Article title="Lorem ipsum" author="Kevin Wang" time={Date.now()-86400000}>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla aliquet condimentum. Nunc facilisis orci dui, sit amet dictum massa porta at. Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus. In hac habitasse platea dictumst. Vivamus nibh enim, dignissim quis consequat at, sagittis in magna. Aliquam accumsan, nisl vel sollicitudin fringilla, libero neque vehicula mauris, eu laoreet nunc ligula convallis nulla. Aliquam felis elit, fermentum ac felis sagittis, porttitor placerat odio. Ut consectetur est lectus, sed maximus libero malesuada ut. Proin aliquet, sapien et pretium feugiat, dui diam posuere diam, ut tempor elit purus quis metus.</p>
        <p>Nulla facilisi. Phasellus blandit interdum est, in pellentesque nunc fermentum et. Proin nibh risus, sollicitudin ac urna sed, aliquet hendrerit massa. Pellentesque vehicula fringilla purus, sit amet bibendum turpis malesuada in. Aliquam nisl enim, elementum id dapibus at, suscipit non arcu. Suspendisse sodales massa vitae dolor vestibulum, lacinia congue enim hendrerit. Curabitur dapibus, arcu a pulvinar pulvinar, lectus elit eleifend dolor, id tincidunt nunc dolor eu orci. Sed neque massa, cursus et enim quis, gravida fermentum est. Nam non justo accumsan arcu volutpat ullamcorper sit amet nec mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a sagittis nibh, sit amet posuere sapien. Aliquam erat volutpat. Phasellus vitae cursus turpis, posuere viverra diam. Fusce mollis consectetur ligula.</p>
      </Article>
      <h4>Comments</h4>
      <CommentSection>
        <Comment username="xorkevin" score={256} time={Date.now()-0.5*86400000}
          content="Lorem ipsum dolor sit amet">
          <Comment username="xorkevin" score={32} time={Date.now()-0.25*86400000}
            content="Consectetur adipiscing elit">
            <Comment username="xorkevin" score={16} time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
            </Comment>
          </Comment>
          <Comment username="xorkevin" score={128} time={Date.now()-0.325*86400000}
            content="Nunc facilisis orci dui, sit amet dictum massa porta at">
            <Comment username="xorkevin" score={16} time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
            </Comment>
            <Comment username="xorkevin" score={16} time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
              <Comment username="xorkevin" score={16} time={Date.now()}
                content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                <Comment username="xorkevin" score={16} time={Date.now()}
                  content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                </Comment>
              </Comment>
            </Comment>
            <Comment username="xorkevin" score={16} time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
            </Comment>
          </Comment>
        </Comment>
        <Comment username="xorkevin" score={64} time={Date.now()-0.75*86400000}
          content="Integer fringilla aliquet condimentum">
          <Comment username="xorkevin" score={8} time={Date.now()-0.015625*86400000}
            content="In hac habitasse platea dictumst">
          </Comment>
          <Comment username="xorkevin" score={16} time={Date.now()}
            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
          </Comment>
        </Comment>
        <Comment username="xorkevin" score={1} time={Date.now()-180000}
          content="Vivamus nibh enim, dignissim quis consequat at, sagittis in magna">
          <Comment username="xorkevin" score={16} time={Date.now()}
            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
            <Comment username="xorkevin" score={16} time={Date.now()}
              content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
              <Comment username="xorkevin" score={16} time={Date.now()}
                content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                <Comment username="xorkevin" score={16} time={Date.now()}
                  content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                  <Comment username="xorkevin" score={16} time={Date.now()}
                    content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                    <Comment username="xorkevin" score={16} time={Date.now()}
                      content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                      <Comment username="xorkevin" score={16} time={Date.now()}
                        content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                        <Comment username="xorkevin" score={16} time={Date.now()}
                          content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                          <Comment username="xorkevin" score={16} time={Date.now()}
                            content="Mauris augue nisi, scelerisque ac suscipit sit amet, egestas ut risus">
                          </Comment>
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
    </Section>

    <Section id="form" sectionTitle="Form" container padded>
      <Input label="Name"/>
      <Input label="Email" error="not an email"/>
      <Input label="Phone" valid/>
      <Input label="Tagline" info="What describes you?"/>
      <Card size="lg" restrictWidth titleBar title={[
          <h3>Vivamus nibh enim</h3>
        ]} bar={[
          <Button fixedWidth text>Cancel</Button>,
          <Button fixedWidth outline>Save</Button>,
          <Button fixedWidth primary>Submit</Button>
        ]}>
        <Input textarea fullWidth label="Biography" info="Tell us about yourself"/>
      </Card>
    </Section>
    <Section id="buttons" sectionTitle="Buttons" container padded>
      <Button fixedWidth primary>Primary</Button>
      <Button fixedWidth outline>Outline</Button>
      <Button fixedWidth text>Text</Button>
      <Button raised fixedWidth primary>Raised Primary</Button>
      <Button raised fixedWidth outline>Raised Outline</Button>
      <Button raised fixedWidth text>Raised Text</Button>
    </Section>

    <Footer>
      <Grid center md={6} sm={8}>
        <div colkey="left" className="text-center">
         <h4>Nuke</h4>
         a reactive frontend for governor
        </div>
        <div colkey="center" className="text-center">
          <ul>
            <li><Anchor noColor ext href="https://github.com/hackform/nuke"><FaIcon icon="github"/> Github</Anchor></li>
            <li>Designed for <Anchor noColor ext href="https://github.com/hackform/governor">hackform/governor</Anchor></li>
          </ul>
        </div>
        <div colkey="right" className="text-center">
          <h5>
            <FaIcon icon="code"/> with <FaIcon icon="heart-o"/> by <Anchor noColor ext href="https://github.com/xorkevin"><FaIcon icon="github"/> xorkevin</Anchor>
          </h5>
        </div>
      </Grid>
    </Footer>
  </div>;
};

export default App
