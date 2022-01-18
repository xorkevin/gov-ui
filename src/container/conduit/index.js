import {lazy, Suspense, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
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

const ConduitFriends = lazy(() => import('./friends'));
const ConduitDMs = lazy(() => import('./dms'));

const Conduit = () => {
  const ctx = useContext(GovUICtx);
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const logout = useLogout();
  const {username, first_name, last_name} = useAuthValue();

  return (
    <MainContent>
      <Grid className="conduit-root" strict>
        <Column fullWidth lg={2} sm={4}>
          <Sidebar>
            <SidebarHeader>
              <h3>Conduit</h3>
            </SidebarHeader>
            <SidebarItem link="dms" local icon={<FaIcon icon="commenting" />}>
              DMs
            </SidebarItem>
            <SidebarItem link="friends" local icon={<FaIcon icon="users" />}>
              Friends
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
            <Routes>
              <Route path="dms/*" element={<ConduitDMs />} />
              <Route path="friends/*" element={<ConduitFriends />} />
              <Route path="*" element={<Navigate to="dms" replace />} />
            </Routes>
          </Suspense>
        </Column>
      </Grid>
    </MainContent>
  );
};

export default Conduit;
