import {Fragment, useContext} from 'react';
import {useURL} from '@xorkevin/substation';
import {useAuthValue, useAuthResource, useLogout} from '@xorkevin/turbine';
import {
  useDarkModeValue,
  useSetDarkMode,
  Navbar,
  NavItem,
  useMenu,
  Menu,
  MenuItem,
  MenuHeader,
  MenuDivider,
  FaIcon,
} from '@xorkevin/nuke';
import Img from '@xorkevin/nuke/src/component/image/circle';

import {GovUICtx} from '../middleware';
import {formatURL} from '../utility';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;

const Nav = ({children, right, menucontent, menuend}) => {
  const ctx = useContext(GovUICtx);
  const dark = useDarkModeValue();
  const toggleDark = useSetDarkMode();
  const menu = useMenu();
  const logout = useLogout();
  const {loggedIn, userid, username, first_name, last_name} = useAuthValue();
  const [profile] = useAuthResource(selectAPIProfile, [], {
    image: '',
  });
  const imageURL = useURL(selectAPIProfileImage, [userid]);

  return (
    <Navbar
      right={
        <Fragment>
          {right}
          {!loggedIn && (
            <NavItem local link={ctx.pathLogin}>
              Sign in
            </NavItem>
          )}
          <NavItem forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            {profile.success && profile.data.image && (
              <Img
                className="navbar-profile-picture"
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
                    link={formatURL(ctx.pathUserProfile, username)}
                    icon={<FaIcon icon="user" />}
                  >
                    {`${first_name} ${last_name}`}
                  </MenuItem>
                </Fragment>
              )}
              {menucontent}
              <MenuHeader>Settings</MenuHeader>
              {loggedIn && (
                <Fragment>
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
                <Fragment>
                  <MenuDivider />
                  <MenuItem onClick={logout} icon={<FaIcon icon="sign-out" />}>
                    Sign out
                  </MenuItem>
                </Fragment>
              )}
              {menuend}
            </Menu>
          )}
        </Fragment>
      }
    >
      {children}
    </Navbar>
  );
};

export default Nav;
