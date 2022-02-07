import {
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useURL} from '@xorkevin/substation';
import {useAuthValue, useRelogin, useLogout} from '@xorkevin/turbine';
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
  ButtonGroup,
  FaIcon,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';
import {WSProvider, useWS} from '../../component/ws';

const ConduitFriends = lazy(() => import('./friends'));
const ConduitDMs = lazy(() => import('./dms'));
const ConduitGDMs = lazy(() => import('./gdms'));

const WS_STATE = 'conduit:chat';

const selectAPIWS = (api) => api.ws;

const Conduit = () => {
  const ctx = useContext(GovUICtx);
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const navmenu = useMenu();
  const logout = useLogout();
  const {username, first_name, last_name} = useAuthValue();

  const wsurl = useURL(selectAPIWS);

  const relogin = useRelogin();
  const prehookWS = useCallback(async () => {
    const [_data, _res, err] = await relogin();
    return err;
  }, [relogin]);
  const ws = useWS(WS_STATE, wsurl, {
    prehook: prehookWS,
  });

  const [isMobile, setIsMobile] = useState(false);
  const {conduitMobileBreakpoint} = ctx;
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries.length < 0 || entries[0].borderBoxSize.length < 0) {
        return;
      }
      const width = entries[0].borderBoxSize[0].inlineSize;
      setIsMobile(width < conduitMobileBreakpoint);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, [conduitMobileBreakpoint, setIsMobile]);

  return (
    <WSProvider value={ws}>
      <MainContent>
        <Grid
          className="conduit-root"
          direction={isMobile ? 'column' : 'row'}
          strict
        >
          <Column fullWidth lg={2} md={4}>
            {isMobile ? (
              <Grid justify="space-between" align="center" nowrap>
                <Column>
                  <h3>Conduit</h3>
                </Column>
                <Column shrink="0">
                  <ButtonGroup>
                    <ButtonTertiary
                      forwardedRef={navmenu.anchorRef}
                      onClick={navmenu.toggle}
                    >
                      <FaIcon icon="bars" />
                    </ButtonTertiary>
                    {navmenu.show && (
                      <Menu
                        size="md"
                        position="bottom"
                        anchor={navmenu.anchor}
                        close={navmenu.close}
                        onClick={navmenu.close}
                      >
                        <MenuItem
                          link="dms"
                          local
                          icon={<FaIcon icon="commenting" />}
                        >
                          DMs
                        </MenuItem>
                        <MenuItem
                          link="gdms"
                          local
                          icon={<FaIcon icon="commenting" />}
                        >
                          Group Chats
                        </MenuItem>
                        <MenuItem
                          link="friends"
                          local
                          icon={<FaIcon icon="users" />}
                        >
                          Friends
                        </MenuItem>
                      </Menu>
                    )}
                    <ButtonTertiary
                      forwardedRef={menu.anchorRef}
                      onClick={menu.toggle}
                    >
                      <FaIcon icon="caret-down" />
                    </ButtonTertiary>
                  </ButtonGroup>
                </Column>
              </Grid>
            ) : (
              <Sidebar>
                <SidebarHeader>
                  <h3>Conduit</h3>
                </SidebarHeader>
                <SidebarItem
                  link="dms"
                  local
                  icon={<FaIcon icon="commenting" />}
                >
                  DMs
                </SidebarItem>
                <SidebarItem
                  link="gdms"
                  local
                  icon={<FaIcon icon="commenting" />}
                >
                  Group Chats
                </SidebarItem>
                <SidebarItem
                  link="friends"
                  local
                  icon={<FaIcon icon="users" />}
                >
                  Friends
                </SidebarItem>
                <SidebarItem
                  forwardedRef={menu.anchorRef}
                  onClick={menu.toggle}
                  icon={<FaIcon icon="bars" />}
                >
                  Settings
                </SidebarItem>
              </Sidebar>
            )}
          </Column>
          <Column fullWidth lg={22} md={20} grow={isMobile && '1'}>
            <Suspense fallback={ctx.fallbackView}>
              <Routes>
                <Route
                  path="dms/*"
                  element={<ConduitDMs isMobile={isMobile} />}
                />
                <Route
                  path="gdms/*"
                  element={<ConduitGDMs isMobile={isMobile} />}
                />
                <Route path="friends/*" element={<ConduitFriends />} />
                <Route path="*" element={<Navigate to="dms" replace />} />
              </Routes>
            </Suspense>
          </Column>
        </Grid>
        {menu.show && (
          <Menu
            size="md"
            position={isMobile ? 'bottom' : 'right'}
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
              label={<kbd>^B</kbd>}
            >
              {dark ? 'Light' : 'Dark'} Mode
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={logout} icon={<FaIcon icon="sign-out" />}>
              Sign out
            </MenuItem>
          </Menu>
        )}
      </MainContent>
    </WSProvider>
  );
};

export default Conduit;
