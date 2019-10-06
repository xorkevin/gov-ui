import React, {Fragment} from 'react';
import Navbar, {Navitem} from 'component/navbar';
import Menu from 'component/menu';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

export default {title: 'Navbar'};

export const plain = () => (
  <Navbar
    hideOnScroll
    styletop={false}
    left={
      <Fragment>
        <Navitem>
          <div>Home</div>
        </Navitem>
        <Navitem>
          <div>Typography</div>
        </Navitem>
        <Navitem>
          <div>Form</div>
        </Navitem>
        <Navitem>
          <div>Cards</div>
        </Navitem>
      </Fragment>
    }
    right={
      <Fragment>
        <Navitem>
          <Menu
            icon={
              <Fragment>
                <FaIcon icon="cog" /> Settings
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
        </Navitem>
      </Fragment>
    }
  />
);

export const transparent = () => (
  <Navbar
    hideOnScroll
    styletop={true}
    left={
      <Fragment>
        <Navitem>
          <div>Home</div>
        </Navitem>
        <Navitem>
          <div>Typography</div>
        </Navitem>
        <Navitem>
          <div>Form</div>
        </Navitem>
        <Navitem>
          <div>Cards</div>
        </Navitem>
      </Fragment>
    }
    right={
      <Fragment>
        <Navitem>
          <Menu
            icon={
              <Fragment>
                <FaIcon icon="cog" /> Settings
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
        </Navitem>
      </Fragment>
    }
  />
);

export const sidebar = () => (
  <Navbar
    sidebar
    left={
      <Fragment>
        <Navitem home>
          <div>
            <FaIcon icon="home" />
            <small>Home</small>
          </div>
        </Navitem>
        <Navitem>
          <div>
            <FaIcon icon="server" />
            <small>Health</small>
          </div>
        </Navitem>
        <Navitem>
          <div>
            <FaIcon icon="building" />
            <small>Manage</small>
          </div>
        </Navitem>
        <Navitem>
          <div>
            <FaIcon icon="paper-plane" />
            <small>Courier</small>
          </div>
        </Navitem>
      </Fragment>
    }
    right={
      <Fragment>
        <Navitem>
          <Menu
            icon={
              <Fragment>
                <FaIcon icon="cog" /> <small>Settings</small>
              </Fragment>
            }
            size="md"
            fixed
            align="left"
            position="top"
          >
            <div>
              <FaIcon icon="address-card-o" /> Account
            </div>
            <span>
              <FaIcon icon="bolt" /> Dark Mode
            </span>
            <Anchor ext href="https://github.com/xorkevin">
              <FaIcon icon="github" /> xorkevin
            </Anchor>
            <span>
              <FaIcon icon="sign-out" /> Sign out
            </span>
          </Menu>
        </Navitem>
      </Fragment>
    }
  />
);
