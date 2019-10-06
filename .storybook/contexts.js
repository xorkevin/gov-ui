import 'fork-awesome/css/fork-awesome.min.css';
import 'main.scss';
import 'style/storybook.scss';

import React, {Fragment} from 'react';
import {Provider} from 'react-redux';

import store from 'store';
import {useDarkMode} from 'service/settings';
import MainContent from 'component/maincontent';
import Section from 'component/section';
import Button from 'component/button';
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
      <MainContent>
        <Section container padded>
          {children}
        </Section>
      </MainContent>
      <Button onClick={toggleDark}>{dark ? 'Dark' : 'Light'} Mode</Button>
      <Anchor ext href="https://github.com/xorkevin">
        <FaIcon icon="github" /> xorkevin
      </Anchor>
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
