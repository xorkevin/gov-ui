import {lazy, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {useAuthValue, useLogout} from '@xorkevin/turbine';
import {
  useDarkModeValue,
  useSetDarkMode,
  MainContent,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  useMenu,
  Menu,
  MenuItem,
  MenuHeader,
  MenuDivider,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const ConduitChat = lazy(() => import('./chat'));

const Conduit = () => {
  const ctx = useContext(GovUICtx);
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const logout = useLogout();
  const {username, first_name, last_name} = useAuthValue();
  const match = useRouteMatch();

  return (
    <MainContent>
      <Grid className="conduit-root">
        <Column fullWidth lg={2} sm={4}>
          <Sidebar>
            <SidebarHeader>
              <h3>Conduit</h3>
            </SidebarHeader>
            <SidebarItem
              link={`${match.url}/chat`}
              local
              icon={<FaIcon icon="commenting" />}
            >
              DMs
            </SidebarItem>
            <SidebarItem
              forwardedRef={menu.anchorRef}
              onClick={menu.toggle}
              icon={<FaIcon icon="bars" />}
            >
              Settings
            </SidebarItem>
            {menu.show && (
              <Menu
                size="md"
                position="right"
                anchor={menu.anchor}
                close={menu.close}
                onClick={menu.close}
              >
                <MenuHeader>Profile</MenuHeader>
                <MenuItem
                  local
                  link={formatURL(ctx.pathUserProfile, username)}
                  icon={<FaIcon icon="user" />}
                >
                  {`${first_name} ${last_name}`}
                </MenuItem>
                <MenuHeader>Settings</MenuHeader>
                <MenuItem
                  local
                  link={ctx.pathAccount}
                  icon={<FaIcon icon="id-card-o" />}
                >
                  Account
                </MenuItem>
                <MenuItem
                  local
                  link={ctx.pathLogin}
                  icon={<FaIcon icon="exchange" />}
                >
                  Switch account
                </MenuItem>
                <MenuItem
                  onClick={toggleDark}
                  icon={<FaIcon icon="bolt" />}
                  label="Ctrl+B"
                >
                  {dark ? 'Light' : 'Dark'} Mode
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout} icon={<FaIcon icon="sign-out" />}>
                  Sign out
                </MenuItem>
              </Menu>
            )}
          </Sidebar>
        </Column>
        <Column fullWidth lg={22} sm={20}>
          <Suspense fallback={ctx.fallbackView}>
            <Switch>
              <Route path={`${match.path}/chat`}>
                <ConduitChat />
              </Route>
              <Redirect to={`${match.url}/chat`} />
            </Switch>
          </Suspense>
        </Column>
      </Grid>
    </MainContent>
  );
};

export default Conduit;
