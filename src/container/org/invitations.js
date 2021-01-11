import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useAPICall, useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
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
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import ButtonDangerSecondary from '@xorkevin/nuke/src/component/button/dangersecondary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const INVITATION_LIMIT = 32;

const selectAPIInvitations = (api) => api.u.user.role.invitation.get;
const selectAPIWithdraw = (api) => api.u.user.role.invitation.del;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIUser = (api) => api.u.user.name;
const selectAPIEditRank = (api) => api.u.user.id.edit.rank;

const EditMembers = ({refresh, pathUserProfile, usrRole, modRole}) => {
  const {userid: auth_userid} = useAuthValue();

  const snackMemberAdded = useSnackbarView(
    <SnackbarSurface>&#x2713; Member invited</SnackbarSurface>,
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

  const isSelf = auth_userid === userid;

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
      <h3>Edit Member</h3>
      <hr />
      <Grid>
        <Column fullWidth md={24}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execSearchUser}
          >
            <Field name="username" label="username" nohint />
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
                  href={formatURL(pathUserProfile, user.data.username)}
                >
                  {user.data.first_name} {user.data.last_name}
                </AnchorText>{' '}
                <small>{user.data.username}</small>
              </h5>
              <ButtonGroup>
                <ButtonPrimary onClick={execAddMember}>
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
        </Column>
      </Grid>
    </Fragment>
  );
};

const InvitationRow = ({
  userid,
  role,
  invitedBy,
  creationTime,
  isViewMod,
  refresh,
  userMap,
}) => {
  const ctx = useContext(GovUICtx);

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err}</SnackbarSurface>);
    },
    [snackbar],
  );

  const subject = userMap[userid];
  const inviter = userMap[invitedBy];

  const posthookRefresh = useCallback(
    (_status, _data, opts) => {
      refresh(opts);
    },
    [refresh],
  );
  const [_withdrawInv, execWithdrawInv] = useAuthCall(
    selectAPIWithdraw,
    [role, userid],
    {},
    {posthook: posthookRefresh, errhook: displayErrSnack},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>
            {inviter && (
              <AnchorText
                local
                href={formatURL(ctx.pathUserProfile, inviter.username)}
              >
                {inviter.first_name} {inviter.last_name}
              </AnchorText>
            )}{' '}
            invited{' '}
            {subject && (
              <AnchorText
                local
                href={formatURL(ctx.pathUserProfile, subject.username)}
              >
                {subject.first_name} {subject.last_name}
              </AnchorText>
            )}
            <small>
              {isViewMod ? <Chip>Moderator</Chip> : <Chip>Member</Chip>}
            </small>
          </h5>
          <Time value={creationTime * 1000} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem
                onClick={execWithdrawInv}
                icon={<FaIcon icon="times" />}
              >
                Withdraw
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const Invitations = ({org}) => {
  const ctx = useContext(GovUICtx);

  const [isViewMod, setViewMod] = useState(false);

  const paginate = usePaginate(INVITATION_LIMIT);

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
  const posthookInvitations = useCallback(
    (_status, invitations) => {
      setAtEnd(invitations.length < INVITATION_LIMIT);
    },
    [setAtEnd],
  );
  const [invitations, reexecute] = useAuthResource(
    selectAPIInvitations,
    [isViewMod ? modRole : usrRole, INVITATION_LIMIT, paginate.index],
    [],
    {posthook: posthookInvitations},
  );

  const userids = useMemo(
    () =>
      Array.from(
        new Set(invitations.data.flatMap((i) => [i.userid, i.invited_by])),
      ),
    [invitations],
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
    <div>
      <h3>Invitations</h3>
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
            {invitations.data.map((i) => (
              <InvitationRow
                key={i.userid}
                userid={i.userid}
                role={i.role}
                invitedBy={i.invited_by}
                creationTime={i.creation_time}
                isViewMod={isViewMod}
                refresh={reexecute}
                userMap={userMap}
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
          {invitations.err && <p>{invitations.err}</p>}
        </Column>
      </Grid>
      <EditMembers
        refresh={reexecute}
        pathUserProfile={ctx.pathUserProfile}
        usrRole={usrRole}
        modRole={modRole}
      />
    </div>
  );
};

export default Invitations;
