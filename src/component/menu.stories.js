import React, {Fragment} from 'react';
import Menu from 'component/menu';
import Button from 'component/button';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

export default {title: 'Menu'};

export const plain = () => (
  <Menu
    icon={
      <Fragment>
        <Button>
          <FaIcon icon="cog" /> Settings
        </Button>
      </Fragment>
    }
    size="md"
    fixed
    align="right"
    position="bottom"
  >
    <span>
      <FaIcon icon="bolt" /> Dark Mode
    </span>
    <Anchor ext href="https://github.com/xorkevin">
      <FaIcon icon="github" /> xorkevin
    </Anchor>
  </Menu>
);
