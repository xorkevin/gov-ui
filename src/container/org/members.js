import {Fragment, useCallback, useMemo, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  Tabbar,
  TabItem,
  useMenu,
  Menu,
  MenuItem,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const MEMBER_LIMIT = 32;

const selectAPIMembers = (api) => api.orgs.id.member;
const selectAPIRoles = (api) => api.u.user.role.get;
const selectAPIUsers = (api) => api.u.user.ids;

const MemberRow = ({isViewMod, pathUserProfile, username, user}) => {
  const name = user ? `${user.first_name} ${user.last_name}` : username;
  const subname = user ? username : '';

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <h5 className="heading-inline">
            <AnchorText local href={formatURL(pathUserProfile, username)}>
              {name}
            </AnchorText>{' '}
            <small>{subname}</small>
          </h5>
          {isViewMod && (
            <small>
              <Chip>Moderator</Chip>
            </small>
          )}
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem local link={formatURL(pathUserProfile, username)}>
                Profile
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const OrgUsers = ({org}) => {
  const ctx = useContext(GovUICtx);

  const paginate = usePaginate(MEMBER_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMembers = useCallback(
    (_res, members) => {
      setAtEnd(members.length < MEMBER_LIMIT);
    },
    [setAtEnd],
  );
  const [members] = useResource(
    selectAPIMembers,
    [org.orgid, '', MEMBER_LIMIT, paginate.index],
    [],
    {posthook: posthookMembers},
  );
  const userids = useMemo(
    () =>
      Array.isArray(members.data) &&
      Array.from(new Set(members.data.map((i) => i.userid))),
    [members],
  );
  const [users] = useResource(
    userids.length > 0 ? selectAPIUsers : selectAPINull,
    [userids],
    [],
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.data.map((i) => [i.userid, i])),
    [users],
  );

  return (
    <Fragment>
      <ListGroup>
        {Array.isArray(members.data) &&
          members.data.map((i) => (
            <MemberRow
              key={i.userid}
              isViewMod={false}
              pathUserProfile={ctx.pathUserProfile}
              userid={i.userid}
              username={i.username}
              user={userMap[i.userid]}
            />
          ))}
      </ListGroup>
      <ButtonGroup>
        <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
          prev
        </ButtonTertiary>
        {paginate.page}
        <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
          next
        </ButtonTertiary>
      </ButtonGroup>
      {members.err && <p>{members.err.message}</p>}
      {users.err && <p>{users.err.message}</p>}
    </Fragment>
  );
};

const OrgMods = ({org}) => {
  const ctx = useContext(GovUICtx);

  const paginate = usePaginate(MEMBER_LIMIT);

  const modRole = ctx.orgModRole(org.orgid);

  const setAtEnd = paginate.setAtEnd;
  const posthookUserIDs = useCallback(
    (_res, userids) => {
      setAtEnd(userids.length < MEMBER_LIMIT);
    },
    [setAtEnd],
  );
  const [userids] = useResource(
    selectAPIRoles,
    [modRole, MEMBER_LIMIT, paginate.index],
    [],
    {posthook: posthookUserIDs},
  );
  const [users] = useResource(
    userids.data.length > 0 ? selectAPIUsers : selectAPINull,
    [userids.data],
    [],
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.data.map((i) => [i.userid, i])),
    [users],
  );

  return (
    <Fragment>
      <ListGroup>
        {userids.data.length > 0 &&
          users.data.map((i) => (
            <MemberRow
              key={i.userid}
              isViewMod={true}
              pathUserProfile={ctx.pathUserProfile}
              userid={i.userid}
              username={i.username}
              user={userMap[i.userid]}
            />
          ))}
      </ListGroup>
      <ButtonGroup>
        <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
          prev
        </ButtonTertiary>
        {paginate.page}
        <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
          next
        </ButtonTertiary>
      </ButtonGroup>
      {userids.err && <p>{userids.err.message}</p>}
      {users.err && <p>{users.err.message}</p>}
    </Fragment>
  );
};

const OrgMembers = ({org}) => {
  return (
    <div>
      <h3>Members</h3>
      <hr />
      <Grid>
        <Column fullWidth md={24}>
          <Tabbar>
            <TabItem local link="users">
              Members
            </TabItem>
            <TabItem local link="mods">
              Moderators
            </TabItem>
          </Tabbar>
          <Routes>
            <Route path="users" element={<OrgUsers org={org} />} />
            <Route path="mods" element={<OrgMods org={org} />} />
            <Route path="*" element={<Navigate to="users" replace />} />
          </Routes>
        </Column>
      </Grid>
    </div>
  );
};

export default OrgMembers;
