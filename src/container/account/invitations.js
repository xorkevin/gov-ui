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
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const INVITATION_LIMIT = 32;

const selectAPIInvitations = (api) => api.u.user.roles.invitation.get;
const selectAPIAccept = (api) => api.u.user.roles.invitation.accept;
const selectAPIDecline = (api) => api.u.user.roles.invitation.del;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIOrgs = (api) => api.orgs.get;

const InvitationRow = ({
  role,
  isOrg,
  org,
  inviter,
  creationTime,
  posthookRefresh,
  posthookErr,
}) => {
  const ctx = useContext(GovUICtx);

  const [_acceptInv, execAcceptInv] = useAuthCall(
    selectAPIAccept,
    [role],
    {},
    {posthook: posthookRefresh, errhook: posthookErr},
  );
  const [_declineInv, execDeclineInv] = useAuthCall(
    selectAPIDecline,
    [role],
    {},
    {posthook: posthookRefresh, errhook: posthookErr},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <h5>
            {inviter && (
              <AnchorText
                local
                href={formatURL(ctx.pathUserProfile, inviter.username)}
              >
                {inviter.first_name} {inviter.last_name}
              </AnchorText>
            )}{' '}
            has invited you to{' '}
            {isOrg
              ? org && (
                  <AnchorText local href={formatURL(ctx.pathOrg, org.name)}>
                    {org.display_name}
                  </AnchorText>
                )
              : role}
            <small>
              {ctx.isUsrRole(role) && <Chip>Member</Chip>}
              {ctx.isModRole(role) && <Chip>Moderator</Chip>}
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
              <MenuItem onClick={execAcceptInv} icon={<FaIcon icon="check" />}>
                Accept
              </MenuItem>
              <MenuItem onClick={execDeclineInv} icon={<FaIcon icon="times" />}>
                Decline
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const RoleInvitations = () => {
  const ctx = useContext(GovUICtx);

  const snackbar = useSnackbar();
  const posthookErr = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(INVITATION_LIMIT);
  const setAtEnd = paginate.setAtEnd;
  const posthookInvitations = useCallback(
    (_res, invitations) => {
      setAtEnd(invitations.length < INVITATION_LIMIT);
    },
    [setAtEnd],
  );
  const [invitations, reexecute] = useAuthResource(
    selectAPIInvitations,
    [INVITATION_LIMIT, paginate.index],
    [],
    {posthook: posthookInvitations},
  );

  const userids = useMemo(
    () => Array.from(new Set(invitations.data.map((i) => i.invited_by))),
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

  const orgids = useMemo(
    () =>
      Array.from(
        new Set(
          invitations.data
            .filter((i) => ctx.isOrgRole(i.role))
            .map((i) => ctx.roleToOrgID(i.role)),
        ),
      ),
    [ctx, invitations],
  );
  const [orgs] = useResource(
    orgids.length > 0 ? selectAPIOrgs : selectAPINull,
    [orgids],
    [],
  );
  const orgMap = useMemo(
    () => Object.fromEntries(orgs.data.map((i) => [i.orgid, i])),
    [orgs],
  );

  const posthookRefresh = useCallback(() => {
    reexecute();
  }, [reexecute]);

  return (
    <div>
      <h3>Invitations</h3>
      <hr />
      <Grid>
        <Column fullWidth md={24}>
          <ListGroup>
            {invitations.data.map((i) => {
              const isOrg = ctx.isOrgRole(i.role);
              return (
                <InvitationRow
                  key={i.role}
                  role={i.role}
                  isOrg={isOrg}
                  org={isOrg ? orgMap[ctx.roleToOrgID(i.role)] : null}
                  inviter={userMap[i.invited_by]}
                  creationTime={i.creation_time}
                  posthookRefresh={posthookRefresh}
                  posthookErr={posthookErr}
                />
              );
            })}
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
          {invitations.err && <p>{invitations.err.message}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default RoleInvitations;
