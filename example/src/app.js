import React, {Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {
  useAuthValue,
  useLogout,
  Protected,
  AntiProtected,
} from '@xorkevin/turbine';
import {
  useDarkModeValue,
  useSetDarkMode,
  SnackbarContainer,
  Container,
  Navbar,
  NavItem,
  useMenu,
  Menu,
  MenuItem,
  MenuHeader,
  MenuDivider,
  Footer,
  Grid,
  Column,
  FaIcon,
} from '@xorkevin/nuke';
import AnchorSecondary from '@xorkevin/nuke/src/component/anchor/secondary';

const AdminContainer = Protected(lazy(() => import('admin')));
const LoginContainer = AntiProtected(
  lazy(() => import('@xorkevin/gov-ui/src/container/login')),
);
//const AccountContainer = Protected(
//  lazy(() => import('@xorkevin/gov-ui/src/container/account')),
//);
//const DeveloperContainer = Protected(
//  lazy(() => import('@xorkevin/gov-ui/src/container/developer')),
//);
//const UserContainer = Protected(
//  lazy(() => import('@xorkevin/gov-ui/src/container/user')),
//);
//const ManageContainer = lazy(() =>
//  import('@xorkevin/gov-ui/src/container/manage'),
//);
//const HealthContainer = Protected(
//  lazy(() => import('health')),
//  'admin',
//);
//const CourierContainer = Protected(
//  lazy(() => import('@xorkevin/gov-ui/src/container/courier')),
//  ['admin', 'usr_courier'],
//);
const SetupContainer = lazy(() =>
  import('@xorkevin/gov-ui/src/container/setup'),
);

const FallbackView = (
  <Container padded narrow>
    Loading
  </Container>
);

const GovContextValue = Object.freeze({
  homePath: '/',
  // eslint-disable-next-line no-undef
  courierPath: COURIERBASE_URL,
});

const App = () => {
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const logout = useLogout();
  const {loggedIn} = useAuthValue();

  return (
    <div>
      <Navbar
        right={
          <Fragment>
            <NavItem forwardedRef={menu.anchorRef} onClick={menu.toggle}>
              <FaIcon icon="cog" />
            </NavItem>
            {menu.show && (
              <Menu size="md" anchor={menu.anchor} close={menu.close}>
                <MenuHeader>Settings</MenuHeader>
                {loggedIn && (
                  <Fragment>
                    <MenuItem
                      local
                      link="/a"
                      icon={<FaIcon icon="address-card-o" />}
                    >
                      Account
                    </MenuItem>
                    <MenuItem local link="/dev" icon={<FaIcon icon="code" />}>
                      Developer
                    </MenuItem>
                  </Fragment>
                )}
                <MenuItem
                  onClick={toggleDark}
                  icon={<FaIcon icon="bolt" />}
                  label="Ctrl+B"
                >
                  {dark ? 'Light' : 'Dark'} Mode
                </MenuItem>
                {loggedIn && (
                  <MenuItem onClick={logout} icon={<FaIcon icon="sign-out" />}>
                    Sign out
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuHeader>About</MenuHeader>
                <MenuItem
                  link="https://github.com/xorkevin/gov-ui"
                  ext
                  icon={<FaIcon icon="github" />}
                  label={<FaIcon icon="external-link" />}
                >
                  gov-ui
                </MenuItem>
                <MenuItem
                  link="https://xorkevin.com/"
                  ext
                  icon={<FaIcon icon="globe-w" />}
                  label={<FaIcon icon="external-link" />}
                >
                  xorkevin
                </MenuItem>
              </Menu>
            )}
          </Fragment>
        }
      >
        <NavItem local link="/">
          <FaIcon icon="home" />
          <small>Home</small>
        </NavItem>
        {loggedIn && (
          <Fragment>
            <NavItem local link="/health">
              <FaIcon icon="server" />
              <small>Health</small>
            </NavItem>
            <NavItem local link="/manage">
              <FaIcon icon="building" />
              <small>Manage</small>
            </NavItem>
            <NavItem local link="/courier">
              <FaIcon icon="paper-plane" />
              <small>Courier</small>
            </NavItem>
          </Fragment>
        )}
      </Navbar>

      <Suspense fallback={FallbackView}>
        <Switch>
          <Route exact path="/">
            <AdminContainer />
          </Route>
          <Route path="/x">
            <LoginContainer />
          </Route>
          {/*<Route path="/a">
              <AccountContainer showProfile />
            </Route>
            <Route path="/dev">
              <DeveloperContainer />
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
              <CourierContainer courierPath={GovContextValue.courierPath} />
            </Route>*/}
          <Route path="/setup">
            <SetupContainer homePath={GovContextValue.homePath} />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Suspense>

      <Footer>
        <Grid className="dark" justify="center" align="center">
          <Column sm={8}>
            <div className="text-center">
              <h4>Gov UI</h4> a reactive frontend for governor
              <ul>
                <li>
                  <AnchorSecondary
                    ext
                    href="https://github.com/xorkevin/gov-ui"
                  >
                    <FaIcon icon="github" /> Github
                  </AnchorSecondary>
                </li>
                <li>
                  Designed for{' '}
                  <AnchorSecondary
                    ext
                    href="https://github.com/xorkevin/governor"
                  >
                    xorkevin/governor
                  </AnchorSecondary>
                </li>
              </ul>
              <h5>
                <FaIcon icon="code" /> with <FaIcon icon="heart-o" /> by{' '}
                <AnchorSecondary ext href="https://xorkevin.com/">
                  <FaIcon icon="github" /> xorkevin
                </AnchorSecondary>
              </h5>
            </div>
          </Column>
        </Grid>
      </Footer>
      <SnackbarContainer />
    </div>
  );
};

export default App;
