import React, {Fragment, lazy, Suspense} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  Link,
  withRouter,
} from 'react-router-dom';

import {useDarkMode} from 'service/settings';
import {
  useAuthState,
  useLogout,
  Protected,
  AntiProtected,
  ProtectedFallback,
} from 'service/auth';

import MainContent from 'component/maincontent';
import Section from 'component/section';
import {Navbar, Navitem} from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const AdminContainer = Protected(lazy(() => import('container/admin')));
const LoginContainer = AntiProtected(lazy(() => import('container/login')));
const AccountContainer = Protected(lazy(() => import('container/account')));
const UserContainer = Protected(lazy(() => import('container/user')));
const ManageContainer = Protected(
  lazy(() => import('container/manage')),
  'admin',
);
const HealthContainer = Protected(
  lazy(() => import('container/health')),
  'admin',
);
const CourierContainer = Protected(
  lazy(() => import('container/courier')),
  'admin',
);
const SetupContainer = lazy(() => import('container/setup'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const UnAuthFallback = (
  <Section container padded narrow>
    Unauthorized
  </Section>
);

const Admin = () => {
  const [dark, toggleDark] = useDarkMode();
  const logout = useLogout();
  const {loggedIn} = useAuthState();

  return (
    <div>
      {loggedIn && (
        <Navbar
          sidebar
          left={
            <Fragment>
              <Navitem home>
                <NavLink exact to="/">
                  <FaIcon icon="home" />
                  <small>Home</small>
                </NavLink>
              </Navitem>
              <Navitem>
                <NavLink to="/health">
                  <FaIcon icon="server" />
                  <small>Health</small>
                </NavLink>
              </Navitem>
              <Navitem>
                <NavLink to="/manage">
                  <FaIcon icon="building" />
                  <small>Manage</small>
                </NavLink>
              </Navitem>
              <Navitem>
                <NavLink to="/courier">
                  <FaIcon icon="paper-plane" />
                  <small>Courier</small>
                </NavLink>
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
                  <Link to="/a/account">
                    <FaIcon icon="address-card-o" /> Account
                  </Link>
                  <span onClick={toggleDark}>
                    <FaIcon icon="bolt" /> {dark ? 'Light' : 'Dark'} Mode
                  </span>
                  <Anchor ext href="https://github.com/xorkevin">
                    <FaIcon icon="github" /> xorkevin
                  </Anchor>
                  <span onClick={logout}>
                    <FaIcon icon="sign-out" /> Sign out
                  </span>
                </Menu>
              </Navitem>
            </Fragment>
          }
        />
      )}

      <MainContent withSidebar={loggedIn} sectionNoMargin>
        <ProtectedFallback value={UnAuthFallback}>
          <Suspense fallback={FallbackView}>
            <Switch>
              <Route exact path="/" component={AdminContainer} />
              <Route path="/x" component={LoginContainer} />
              <Route path="/a" component={AccountContainer} />
              <Route path="/u" component={UserContainer} />
              <Route path="/manage" component={ManageContainer} />
              <Route path="/health" component={HealthContainer} />
              <Route path="/courier" component={CourierContainer} />
              <Route path="/setup" component={SetupContainer} />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </ProtectedFallback>
      </MainContent>

      <Footer withSidebar={loggedIn}>
        <Grid map center sm={8}>
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
    </div>
  );
};

export default withRouter(Admin);
