import React, {Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {useURL} from '@xorkevin/substation';
import {
  useAuthValue,
  useAuthResource,
  useLogout,
  useRefreshAuth,
  Protected,
  AntiProtected,
} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  useDarkModeValue,
  useSetDarkMode,
  SnackbarContainer,
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
import Img from '@xorkevin/nuke/src/component/image/circle';
import platform from 'platform';

import {
  modRoles,
  orgUsrPrefix,
  orgModPrefix,
  allScopes,
  allScopeDesc,
  rolesToScopes,
} from 'roles';

const DashContainer = Protected(lazy(() => import('dash')));
const LoginContainer = AntiProtected(
  lazy(() => import('@xorkevin/gov-ui/src/container/login')),
);
const AccountContainer = Protected(
  lazy(() => import('@xorkevin/gov-ui/src/container/account')),
);
const UserContainer = Protected(
  lazy(() => import('@xorkevin/gov-ui/src/container/user')),
);
const OrgContainer = Protected(
  lazy(() => import('@xorkevin/gov-ui/src/container/org')),
);
const AdminContainer = Protected(
  lazy(() => import('@xorkevin/gov-ui/src/container/admin')),
  modRoles.concat(['usr.gov.user', 'usr.gov.oauth']),
);
const CourierContainer = Protected(
  lazy(() => import('@xorkevin/gov-ui/src/container/courier')),
);
const SetupContainer = lazy(() =>
  import('@xorkevin/gov-ui/src/container/setup'),
);

const FallbackView = (
  <MainContent>
    <Section>
      <Container padded narrow>
        <h4>Loading</h4>
      </Container>
    </Section>
  </MainContent>
);

const GovContextValue = Object.freeze({
  userApprovals: false,
  // eslint-disable-next-line no-undef
  courierPath: COURIERBASE_URL,
});

const mobileSet = new Set(['Android', 'iOS']);
const parsePlatform = (user_agent) => {
  const info = platform.parse(user_agent);
  return {
    name: info.name,
    os: info.os.toString(),
    mobile: mobileSet.has(info.os.family),
  };
};

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;

const App = () => {
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const logout = useLogout();
  const {loggedIn, userid, username, first_name, last_name} = useAuthValue();
  useRefreshAuth();

  const [profile] = useAuthResource(selectAPIProfile, [], {
    image: '',
  });
  const imageURL = useURL(selectAPIProfileImage, [userid]);

  return (
    <div>
      <Navbar
        right={
          <Fragment>
            <NavItem forwardedRef={menu.anchorRef} onClick={menu.toggle}>
              {profile.success && profile.data.image && (
                <Img
                  className="navbar-image"
                  src={imageURL}
                  preview={profile.data.image}
                  ratio={1}
                />
              )}
              <FaIcon icon="caret-down" />
            </NavItem>
            {menu.show && (
              <Menu size="md" anchor={menu.anchor} close={menu.close}>
                {loggedIn && (
                  <Fragment>
                    <MenuHeader>Profile</MenuHeader>
                    <MenuItem
                      local
                      link={`/u/${username}`}
                      icon={<FaIcon icon="user" />}
                    >
                      {`${first_name} ${last_name}`}
                    </MenuItem>
                  </Fragment>
                )}
                <MenuHeader>Settings</MenuHeader>
                {loggedIn && (
                  <Fragment>
                    <MenuItem
                      local
                      link="/a"
                      icon={<FaIcon icon="id-card-o" />}
                    >
                      Account
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
            <NavItem local link="/admin">
              <FaIcon icon="building-o" />
              <small>Admin</small>
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
            <DashContainer />
          </Route>
          <Route path="/x">
            <LoginContainer userApprovals={GovContextValue.userApprovals} />
          </Route>
          <Route path="/a">
            <AccountContainer
              showProfile
              showOrgs
              orgUsrPrefix={orgUsrPrefix}
              orgModPrefix={orgModPrefix}
              pathOrg="/org/{0}"
              pathOrgSettings="/org/{0}/settings"
              parsePlatform={parsePlatform}
              allScopes={allScopes}
              allScopeDesc={allScopeDesc}
              rolesToScopes={rolesToScopes}
            />
          </Route>
          <Route path="/u">
            <UserContainer pathHome="/" />
          </Route>
          <Route path="/org">
            <OrgContainer pathHome="/" />
          </Route>
          <Route path="/admin">
            <AdminContainer />
          </Route>
          <Route path="/courier">
            <CourierContainer courierPath={GovContextValue.courierPath} />
          </Route>
          <Route path="/setup">
            <SetupContainer />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Suspense>

      <Footer>
        <Grid className="dark" justify="center" align="center">
          <Column fullWidth sm={8}>
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
