import React, {Fragment} from 'react';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

export default {title: 'Footer'};

export const plain = () => (
  <Footer>
    <Grid center map sm={8}>
      <div className="text-center">
        <h4>Nuke</h4>a reactive frontend for governor
      </div>
      <div className="text-center">
        <ul>
          <li>
            <Anchor noColor ext href="https://github.com/xorkevin/nuke">
              <FaIcon icon="github" /> Github
            </Anchor>
          </li>
          <li>
            Designed for{' '}
            <Anchor noColor ext href="https://github.com/xorkevin/governor">
              xorkevin/governor
            </Anchor>
          </li>
        </ul>
      </div>
      <div className="text-center">
        <h5>
          <FaIcon icon="code" /> with <FaIcon icon="heart-o" /> by{' '}
          <Anchor noColor ext href="https://github.com/xorkevin">
            <FaIcon icon="github" /> xorkevin
          </Anchor>
        </h5>
      </div>
    </Grid>
  </Footer>
);
