import {Fragment, useCallback, useMemo, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  Tabbar,
  TabItem,
  useMenu,
  Menu,
  MenuItem,
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

const FRIENDS_LIMIT = 32;
const INVITATION_LIMIT = 32;

const selectAPIFriends = (api) => api.conduit.friend;
const selectAPIUnfriend = (api) => api.conduit.friend.id.remove;
const selectAPIInvitations = (api) => api.conduit.friend.invitation;
const selectAPIInvited = (api) => api.conduit.friend.invitation.invited;
const selectAPIAccept = (api) => api.conduit.friend.invitation.id.accept;
const selectAPIDecline = (api) => api.conduit.friend.invitation.id.del;
const selectAPIWithdraw = (api) => api.conduit.friend.invitation.invited.del;
const selectAPIUsers = (api) => api.u.user.ids;

const FriendsRow = ({id, user, posthookRefresh, posthookErr}) => {
  const ctx = useContext(GovUICtx);

  const [_unfriend, execUnfriend] = useAuthCall(
    selectAPIUnfriend,
    [id],
    {},
    {posthook: posthookRefresh, errhook: posthookErr},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <h5>
            {user && (
              <AnchorText
                local
                href={formatURL(ctx.pathUserProfile, user.username)}
              >
                {user.first_name} {user.last_name}
              </AnchorText>
            )}
          </h5>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={execUnfriend} icon={<FaIcon icon="times" />}>
                Unfriend
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const FriendsList = () => {
  const snackbar = useSnackbar();
  const posthookErr = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(FRIENDS_LIMIT);
  const setAtEnd = paginate.setAtEnd;
  const posthookFriends = useCallback(
    (_res, friends) => {
      setAtEnd(friends.length < FRIENDS_LIMIT);
    },
    [setAtEnd],
  );
  const [friends, reexecute] = useAuthResource(
    selectAPIFriends,
    ['', FRIENDS_LIMIT, paginate.index],
    [],
    {posthook: posthookFriends},
  );

  const [users] = useResource(
    friends.data.length > 0 ? selectAPIUsers : selectAPINull,
    [friends.data],
    [],
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.data.map((i) => [i.userid, i])),
    [users],
  );

  const posthookRefresh = useCallback(() => {
    reexecute();
  }, [reexecute]);

  return (
    <Fragment>
      <h4>Friends</h4>
      <hr />
      <ListGroup>
        {friends.data.map((i) => {
          return (
            <FriendsRow
              key={i}
              id={i}
              user={userMap[i]}
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
      {friends.err && <p>{friends.err.message}</p>}
      {users.err && <p>{users.err.message}</p>}
    </Fragment>
  );
};

const InvitationRow = ({
  id,
  inviter,
  creationTime,
  posthookRefresh,
  posthookErr,
}) => {
  const ctx = useContext(GovUICtx);

  const [_acceptInv, execAcceptInv] = useAuthCall(
    selectAPIAccept,
    [id],
    {},
    {posthook: posthookRefresh, errhook: posthookErr},
  );
  const [_declineInv, execDeclineInv] = useAuthCall(
    selectAPIDecline,
    [id],
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

const Invitations = () => {
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

  const posthookRefresh = useCallback(() => {
    reexecute();
  }, [reexecute]);

  return (
    <Fragment>
      <h4>Invitations</h4>
      <hr />
      <ListGroup>
        {invitations.data.map((i) => {
          return (
            <InvitationRow
              key={i.invited_by}
              id={i.invited_by}
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
    </Fragment>
  );
};

const SentRow = ({id, invited, creationTime, posthookRefresh, posthookErr}) => {
  const ctx = useContext(GovUICtx);

  const [_withdrawInv, execWithdrawInv] = useAuthCall(
    selectAPIWithdraw,
    [id],
    {},
    {posthook: posthookRefresh, errhook: posthookErr},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <h5>
            {invited && (
              <AnchorText
                local
                href={formatURL(ctx.pathUserProfile, invited.username)}
              >
                {invited.first_name} {invited.last_name}
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

const Sent = () => {
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
    selectAPIInvited,
    [INVITATION_LIMIT, paginate.index],
    [],
    {posthook: posthookInvitations},
  );

  const userids = useMemo(
    () => Array.from(new Set(invitations.data.map((i) => i.userid))),
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

  const posthookRefresh = useCallback(() => {
    reexecute();
  }, [reexecute]);

  return (
    <Fragment>
      <h4>Sent Invitations</h4>
      <hr />
      <ListGroup>
        {invitations.data.map((i) => {
          return (
            <SentRow
              key={i.userid}
              id={i.userid}
              invited={userMap[i.userid]}
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
    </Fragment>
  );
};

const Friends = () => {
  return (
    <Container padded narrow>
      <h3>Friends</h3>
      <Tabbar>
        <TabItem local link="list">
          Friends
        </TabItem>
        <TabItem local link="invitations">
          Invitations
        </TabItem>
        <TabItem local link="sent">
          Sent
        </TabItem>
      </Tabbar>
      <Routes>
        <Route path="list" element={<FriendsList />} />
        <Route path="invitations" element={<Invitations />} />
        <Route path="sent" element={<Sent />} />
        <Route path="*" element={<Navigate to="list" replace />} />
      </Routes>
    </Container>
  );
};

export default Friends;
