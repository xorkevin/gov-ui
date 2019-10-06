import React, {Fragment} from 'react';
import Tabbar from 'component/tabbar';
import FaIcon from 'component/faicon';

export default {title: 'Tabbar'};

export const plain = () => (
  <Tabbar
    left={
      <Fragment>
        <div>
          <FaIcon icon="newspaper-o" /> Newsfeed
        </div>
        <div>
          <FaIcon icon="fire" /> Popular
        </div>
        <div>
          <FaIcon icon="users" /> Friends
        </div>
        <div>
          <FaIcon icon="paper-plane" /> Post
        </div>
      </Fragment>
    }
    right={
      <Fragment>
        <div>
          <FaIcon icon="user" /> Profile
        </div>
        <div>
          <FaIcon icon="cog" /> Settings
        </div>
      </Fragment>
    }
  />
);
