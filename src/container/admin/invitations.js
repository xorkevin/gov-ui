import {useCallback, useMemo, useContext} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  FieldSearchSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const INVITATION_LIMIT = 32;

const selectAPIInvitations = (api) => api.u.user.role.invitation.get;
const selectAPIWithdraw = (api) => api.u.user.role.invitation.del;
const selectAPIUsers = (api) => api.u.user.ids;

const InvitationRow = ({
  userid,
  role,
  invitedBy,
  creationTime,
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

const Invitations = () => {
  const ctx = useContext(GovUICtx);

  const paginate = usePaginate(INVITATION_LIMIT);

  const form = useForm({
    role: '',
  });

  const roleOpts = useMemo(
    () => ctx.permissionedRoles.map((i) => ({display: i, value: i})),
    [ctx],
  );

  const setAtEnd = paginate.setAtEnd;
  const posthookInvitations = useCallback(
    (_status, invitations) => {
      setAtEnd(invitations.length < INVITATION_LIMIT);
    },
    [setAtEnd],
  );
  const [invitations, reexecute] = useAuthResource(
    form.state.role.length > 0 ? selectAPIInvitations : selectAPINull,
    [form.state.role, INVITATION_LIMIT, paginate.index],
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
          <Form formState={form.state} onChange={form.update}>
            <FieldSearchSelect name="role" options={roleOpts} label="Role" />
          </Form>
          <ListGroup>
            {invitations.data.map((i) => (
              <InvitationRow
                key={i.userid}
                userid={i.userid}
                role={i.role}
                invitedBy={i.invited_by}
                creationTime={i.creation_time}
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
    </div>
  );
};

export default Invitations;
