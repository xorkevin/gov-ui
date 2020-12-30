import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useAPICall, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
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
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import ButtonDangerSecondary from '@xorkevin/nuke/src/component/button/dangersecondary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatStr} from '../../utility';

const MEMBER_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.role;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIUser = (api) => api.u.user.name;
const selectAPIEditRank = (api) => api.u.user.id.edit.rank;

const EditMembers = ({refresh, pathUserProfile, usrRole, modRole}) => {
  const auth = useAuthValue();
  const snackMemberAdded = useSnackbarView(
    <SnackbarSurface>&#x2713; Member added</SnackbarSurface>,
  );
  const snackMemberRemoved = useSnackbarView(
    <SnackbarSurface>&#x2713; Member removed</SnackbarSurface>,
  );

  const [hidden, setHidden] = useState(false);

  const form = useForm({
    username: '',
  });

  const formAssign = form.assign;
  const hide = useCallback(() => {
    setHidden(true);
    formAssign({
      username: '',
    });
  }, [formAssign, setHidden]);

  const posthookSearch = useCallback(() => {
    setHidden(false);
  }, [setHidden]);
  const [user, execSearchUser] = useAPICall(
    selectAPIUser,
    [form.state.username],
    {
      userid: '',
      username: '',
      first_name: '',
      last_name: '',
      roles: [],
      creation_time: 0,
    },
    {posthook: posthookSearch},
  );
  const userid = user.data.userid;

  const isSelf = auth.userid === userid;

  const memberRole = useMemo(
    () => ({
      add: [usrRole],
      remove: [],
    }),
    [usrRole],
  );

  const moderatorRole = useMemo(
    () => ({
      add: [usrRole, modRole],
      remove: [],
    }),
    [usrRole, modRole],
  );

  const posthookAdd = useCallback(
    (_status, _data, opts) => {
      hide();
      snackMemberAdded();
      refresh(opts);
    },
    [refresh, snackMemberAdded, hide],
  );
  const [addMember, execAddMember] = useAuthCall(
    selectAPIEditRank,
    [userid, memberRole.add, memberRole.remove],
    {},
    {posthook: posthookAdd},
  );
  const [addMod, execAddMod] = useAuthCall(
    selectAPIEditRank,
    [userid, moderatorRole.add, moderatorRole.remove],
    {},
    {posthook: posthookAdd},
  );

  const posthookRemove = useCallback(
    (_status, _data, opts) => {
      hide();
      snackMemberRemoved();
      refresh(opts);
    },
    [refresh, snackMemberRemoved, hide],
  );
  const [rmMember, execRmMember] = useAuthCall(
    selectAPIEditRank,
    [userid, moderatorRole.remove, moderatorRole.add],
    {},
    {posthook: posthookRemove},
  );

  return (
    <Fragment>
      <h4>Edit Member</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execSearchUser}
      >
        <Field name="username" label="username" nohint fullWidth />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={hide}>Clear</ButtonTertiary>
        <ButtonSecondary onClick={execSearchUser}>Search</ButtonSecondary>
      </ButtonGroup>
      {!hidden && user.success && (
        <div>
          <h5>
            <AnchorText
              local
              href={formatStr(pathUserProfile, user.data.username)}
            >
              {user.data.first_name} {user.data.last_name}
            </AnchorText>{' '}
            <small>{user.data.username}</small>
          </h5>
          <ButtonGroup>
            <ButtonPrimary onClick={execAddMember} disabled={isSelf}>
              Add as Member
            </ButtonPrimary>
            <ButtonPrimary onClick={execAddMod} disabled={isSelf}>
              Add as Moderator
            </ButtonPrimary>
            <ButtonDangerSecondary onClick={execRmMember} disabled={isSelf}>
              Remove Member
            </ButtonDangerSecondary>
          </ButtonGroup>
        </div>
      )}
      {user.err && <p>{user.err}</p>}
      {addMember.err && <p>{addMember.err}</p>}
      {addMod.err && <p>{addMod.err}</p>}
      {rmMember.err && <p>{rmMember.err}</p>}
    </Fragment>
  );
};

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
        <Column className="org-member-item-name">
          <h5 className="org-member-item-heading">
            <AnchorText local href={formatStr(pathUserProfile, username)}>
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
              <MenuItem local link={formatStr(pathUserProfile, username)}>
                Profile
              </MenuItem>
              {isViewMod && <MenuItem>Remove mod</MenuItem>}
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const OrgMembers = ({org, isMod}) => {
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
    (_status, userids) => {
      setAtEnd(userids.length < MEMBER_LIMIT);
    },
    [setAtEnd],
  );
  const [userids, reexecute] = useResource(
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
          {userids.err && <p>{userids.err}</p>}
          {users.err && <p>{users.err}</p>}
        </Column>
        <Column fullWidth md={8}>
          {isMod && (
            <EditMembers
              refresh={reexecute}
              pathUserProfile={ctx.pathUserProfile}
              usrRole={usrRole}
              modRole={modRole}
            />
          )}
        </Column>
      </Grid>
    </div>
  );
};

export default OrgMembers;
