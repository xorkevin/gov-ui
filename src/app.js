import React, {Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect, NavLink, useLocation} from 'react-router-dom';

import {useDarkMode} from 'service/settings';
import {SnackbarContainer} from 'service/snackbar';

import MainContent from 'component/maincontent';
import Section from 'component/section';
import {Navbar, Navitem} from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const HomeContainer = lazy(() => import('container/home'));
const FormContainer = lazy(() => import('container/form'));
const CardContainer = lazy(() => import('container/card'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const styletoppaths = new Set(['/']);

const App = () => {
  const {pathname} = useLocation();
  const [dark, toggleDark] = useDarkMode();

  return (
    <div>
      <Navbar
        hideOnScroll
        styletop={styletoppaths.has(pathname)}
        left={
          <Fragment>
            <Navitem home scroll>
              <NavLink exact to="/">
                Home
              </NavLink>
            </Navitem>
            <Navitem scroll="typography">
              <div>Typography</div>
            </Navitem>
            <Navitem>
              <NavLink to="/form">Form</NavLink>
            </Navitem>
            <Navitem>
              <NavLink to="/cards">Cards</NavLink>
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
                <span onClick={toggleDark}>
                  <FaIcon icon="bolt" /> {dark ? 'Light' : 'Dark'} Mode
                </span>
                <Anchor ext href="https://github.com/xorkevin">
                  <FaIcon icon="github" /> xorkevin
                </Anchor>
              </Menu>
            </Navitem>
          </Fragment>
        }
      />

      <MainContent>
        <Suspense fallback={FallbackView}>
          <Switch>
            <Route exact path="/">
              <HomeContainer />
            </Route>
            <Route path="/form">
              <FormContainer />
            </Route>
            <Route path="/cards">
              <CardContainer />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </MainContent>

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
      <SnackbarContainer />
    </div>
  );
};

export default App;
