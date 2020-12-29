import {useState, useCallback, useContext} from 'react';
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
import {formatStr} from '../../utility';

const MEMBER_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.role;
const selectAPIUsers = (api) => api.u.user.ids;

const MemberRow = ({
  isMod,
  pathUserProfile,
  username,
  first_name,
  last_name,
}) => {
  const menu = useMenu();
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="org-member-item-name">
          <h5 className="org-member-item-heading">
            <AnchorText local href={formatStr(pathUserProfile, username)}>
              {first_name} {last_name}
            </AnchorText>{' '}
            <small>{username}</small>
          </h5>
          {isMod && (
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
              <MenuItem local link={formatStr(pathUserProfile, username)}>
                Profile
              </MenuItem>
              {isMod && <MenuItem>Remove mod</MenuItem>}
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const OrgMembers = ({org}) => {
  const ctx = useContext(GovUICtx);

  const [isViewMod, setViewMod] = useState(false);
  const viewUsr = useCallback(() => {
    setViewMod(false);
  }, [setViewMod]);
  const viewMod = useCallback(() => {
    setViewMod(true);
  }, [setViewMod]);

  const paginate = usePaginate(MEMBER_LIMIT);

  const usrRole = ctx.orgUsrRole(org.orgid);
  const modRole = ctx.orgModRole(org.orgid);

  const setAtEnd = paginate.setAtEnd;
  const posthookUserIDs = useCallback(
    (_status, userids) => {
      setAtEnd(userids.length < MEMBER_LIMIT);
    },
    [setAtEnd],
  );
  const [userids, _reexecute] = useResource(
    selectAPIRoles,
    [isViewMod ? modRole : usrRole, MEMBER_LIMIT, paginate.index],
    [],
    {posthook: posthookUserIDs},
  );
  const [users] = useResource(
    userids.data.length > 0 ? selectAPIUsers : selectAPINull,
    [userids.data],
    [],
  );

  return (
    <div>
      <h3>Members</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Tabbar>
            <TabItem className={!isViewMod ? 'active' : ''} onClick={viewUsr}>
              Members
            </TabItem>
            <TabItem className={isViewMod ? 'active' : ''} onClick={viewMod}>
              Moderators
            </TabItem>
          </Tabbar>
          <ListGroup>
            {userids.data.length > 0 &&
              users.data.map((i) => (
                <MemberRow
                  key={i.userid}
                  isMod={isViewMod}
                  pathUserProfile={ctx.pathUserProfile}
                  userid={i.userid}
                  username={i.username}
                  first_name={i.first_name}
                  last_name={i.last_name}
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
          {userids.err && <p>{userids.err}</p>}
          {users.err && <p>{users.err}</p>}
        </Column>
        <Column fullWidth md={8}></Column>
      </Grid>
    </div>
  );
};

export default OrgMembers;
