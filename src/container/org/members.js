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
import {formatURL} from '../../utility';

const MEMBER_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.role.get;
const selectAPIUsers = (api) => api.u.user.ids;

const MemberRow = ({
  isViewMod,
  pathUserProfile,
  username,
  first_name,
  last_name,
}) => {
  const menu = useMenu();
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <h5 className="heading-inline">
            <AnchorText local href={formatURL(pathUserProfile, username)}>
              {first_name} {last_name}
            </AnchorText>{' '}
            <small>{username}</small>
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

const OrgMembers = ({org}) => {
  const ctx = useContext(GovUICtx);

  const [isViewMod, setViewMod] = useState(false);

  const paginate = usePaginate(MEMBER_LIMIT);

  const setFirst = paginate.first;
  const viewUsr = useCallback(() => {
    setViewMod(false);
    setFirst();
  }, [setViewMod, setFirst]);
  const viewMod = useCallback(() => {
    setViewMod(true);
    setFirst();
  }, [setViewMod, setFirst]);

  const usrRole = ctx.orgUsrRole(org.orgid);
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
        <Column fullWidth md={24}>
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
                  isViewMod={isViewMod}
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
          {userids.err && <p>{userids.err.message}</p>}
          {users.err && <p>{users.err.message}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default OrgMembers;
