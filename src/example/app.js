import React, {Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect, NavLink, Link} from 'react-router-dom';
import {
  useAuthState,
  useLogout,
  Protected,
  AntiProtected,
} from '@xorkevin/turbine';
import {
  useDarkMode,
  SnackbarContainer,
  MainContent,
  Section,
  Navbar,
  Navitem,
  Menu,
  Footer,
  Grid,
  Anchor,
  FaIcon,
} from '@xorkevin/nuke';

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
        <Suspense fallback={FallbackView}>
          <Switch>
            <Route exact path="/">
              <AdminContainer />
            </Route>
            <Route path="/x">
              <LoginContainer />
            </Route>
            <Route path="/a">
              <AccountContainer />
            </Route>
            <Route path="/u">
              <UserContainer />
            </Route>
            <Route path="/manage">
              <ManageContainer />
            </Route>
            <Route path="/health">
              <HealthContainer />
            </Route>
            <Route path="/courier">
              <CourierContainer />
            </Route>
            <Route path="/setup">
              <SetupContainer />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Suspense>
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
      <SnackbarContainer />
    </div>
  );
};

export default Admin;