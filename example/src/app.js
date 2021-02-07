import {Fragment, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, useLocation} from 'react-router-dom';
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
  useDarkModeValue,
  useSetDarkMode,
  MainContent,
  Section,
  Container,
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
import {
  GovUICtx,
  DevtoolsContainer,
  LoginContainer,
  OAuthContainer,
  AccountContainer,
  UserContainer,
  OrgContainer,
  AdminContainer,
  CourierContainer,
  SetupContainer,
} from '@xorkevin/gov-ui';

import {permissionedRoles} from 'roles';

const LoginC = AntiProtected(LoginContainer);
const AccountC = Protected(AccountContainer);
const UserC = Protected(UserContainer);
const OrgC = Protected(OrgContainer);
const AdminC = Protected(AdminContainer, permissionedRoles);
const CourierC = Protected(CourierContainer);

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;

const useHideNav = () => {
  const loc = useLocation();
  return loc.pathname.startsWith('/oauth');
};

const Nav = () => {
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const logout = useLogout();
  const {loggedIn, userid, username, first_name, last_name} = useAuthValue();
  const [profile] = useAuthResource(selectAPIProfile, [], {
    image: '',
  });
  const imageURL = useURL(selectAPIProfileImage, [userid]);

  const hideNav = useHideNav();
  if (hideNav) {
    return null;
  }

  return (
    <Navbar
      right={
        <Fragment>
          {!loggedIn && (
            <NavItem local link="/x/login">
              Sign in
            </NavItem>
          )}
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
                  <MenuItem local link="/a" icon={<FaIcon icon="id-card-o" />}>
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
                ext
                link="https://github.com/xorkevin/gov-ui"
                icon={<FaIcon icon="github" />}
                label={<FaIcon icon="external-link" />}
              >
                gov-ui
              </MenuItem>
              <MenuItem
                ext
                link="https://xorkevin.com/"
                icon={<FaIcon icon="globe-w" />}
                label={<FaIcon icon="external-link" />}
              >
                xorkevin
              </MenuItem>
              <MenuDivider />
              <MenuItem
                local
                link="/devtools"
                icon={<FaIcon icon="terminal" />}
              >
                Devtools
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
  );
};

const Foot = () => {
  const hideNav = useHideNav();
  if (hideNav) {
    return null;
  }

  return (
    <Footer>
      <Grid className="dark" justify="center" align="center">
        <Column fullWidth sm={8}>
          <div className="text-center">
            <h4>Gov UI</h4> a reactive frontend for governor
            <ul>
              <li>
                <AnchorSecondary ext href="https://github.com/xorkevin/gov-ui">
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
  );
};

const Home = () => {
  return (
    <MainContent>
      <Section>
        <Container padded>
          <h1>Home</h1>
        </Container>
      </Section>
    </MainContent>
  );
};

const App = () => {
  const ctx = useContext(GovUICtx);
  useRefreshAuth();

  return (
    <div>
      <Nav />

      <Suspense fallback={ctx.mainFallbackView}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/devtools">
            <DevtoolsContainer />
          </Route>
          <Route path="/x">
            <LoginC />
          </Route>
          <Route path="/oauth">
            <OAuthContainer />
          </Route>
          <Route path="/a">
            <AccountC />
          </Route>
          <Route path="/u">
            <UserC />
          </Route>
          <Route path="/org">
            <OrgC />
          </Route>
          <Route path="/admin">
            <AdminC />
          </Route>
          <Route path="/courier">
            <CourierC />
          </Route>
          <Route path="/setup">
            <SetupContainer />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Suspense>

      <Foot />
      <SnackbarContainer />
    </div>
  );
};

export default App;
