import 'fork-awesome/css/fork-awesome.min.css';
import 'main.scss';
import 'style/storybook.scss';

import React, {Fragment} from 'react';
import {Provider} from 'react-redux';

import store from 'store';
import {useDarkMode} from 'service/settings';
import MainContent from 'component/maincontent';
import Section from 'component/section';
import {Navbar, Navitem} from 'component/navbar';
import FaIcon from 'component/faicon';
import Anchor from 'component/anchor';

const Main = ({children}) => {
  return (
    <Provider store={store}>
      <App>{children}</App>
    </Provider>
  );
};

const App = ({children}) => {
  const [dark, toggleDark] = useDarkMode();
  return (
    <div>
      <Navbar
        right={
          <Fragment>
            <Navitem>
              <span onClick={toggleDark}>{dark ? 'Dark' : 'Light'} Mode</span>
            </Navitem>
            <Navitem>
              <Anchor ext href="https://github.com/xorkevin">
                <FaIcon icon="github" /> xorkevin
              </Anchor>
            </Navitem>
          </Fragment>
        }
      />
      <MainContent>
        <Section container padded>
          {children}
        </Section>
      </MainContent>
    </div>
  );
};

export const contexts = [
  {
    icon: 'box',
    title: 'Themes',
    components: [Main],
    params: [{name: 'Theme', props: {}, default: true}],
    options: {
      deep: true,
      disable: false,
      cancelable: false,
    },
  },
];
