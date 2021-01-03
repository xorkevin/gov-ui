import {useCallback, useMemo, useContext} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatStr} from '../../utility';

const INVITATION_LIMIT = 32;

const selectAPIInvitations = (api) => api.u.user.roles.invitation.get;
const selectAPIUsers = (api) => api.u.user.ids;

const InvitationRow = ({role, invitedBy, creationTime, userMap}) => {
  const ctx = useContext(GovUICtx);
  const menu = useMenu();
  const inviter = userMap[invitedBy];

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>
            {inviter && (
              <AnchorText
                local
                href={formatStr(ctx.pathUserProfile, inviter.username)}
              >
                {inviter.first_name} {inviter.last_name}
              </AnchorText>
            )}{' '}
            has invited you to
          </h5>
          {ctx.isUsrRole(role) && <Chip>Member</Chip>}
          {ctx.isModRole(role) && <Chip>Moderator</Chip>}
          <Time value={creationTime * 1000} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem icon={<FaIcon icon="check" />}>Accept</MenuItem>
              <MenuItem icon={<FaIcon icon="times" />}>Decline</MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const RoleInvitations = () => {
  const paginate = usePaginate(INVITATION_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookInvitations = useCallback(
    (_status, invitations) => {
      setAtEnd(invitations.length < INVITATION_LIMIT);
    },
    [setAtEnd],
  );
  const [invitations, _reexecute] = useAuthResource(
    selectAPIInvitations,
    [INVITATION_LIMIT, paginate.index],
    [],
    {posthook: posthookInvitations},
  );

  const userids = useMemo(() => invitations.data.map((i) => i.invited_by), [
    invitations,
  ]);
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
        <Column fullWidth md={16}>
          <ListGroup>
            {invitations.data.map((i) => (
              <InvitationRow
                key={i.role}
                role={i.role}
                invitedBy={i.invited_by}
                creationTime={i.creation_time}
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
        <Column fullWidth md={8}></Column>
      </Grid>
    </div>
  );
};

export default RoleInvitations;
