import {useCallback, useMemo, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../../middleware';

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPIListMemberIDs = (api) => api.mailinglist.id.member.ids;
const selectAPIListSub = (api) => api.mailinglist.group.list.sub;
const selectAPIListUnsub = (api) => api.mailinglist.group.list.unsub;
const selectAPIUser = (api) => api.u.user.id;
const selectAPIOrg = (api) => api.orgs.id.get;

const List = () => {
  const ctx = useContext(GovUICtx);

  const snackSub = useSnackbarView(
    <SnackbarSurface>&#x2713; Subscribed</SnackbarSurface>,
  );
  const snackUnsub = useSnackbarView(
    <SnackbarSurface>&#x2713; Unsubscribed</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const {listid} = useParams();

  const [list, _reexecute] = useResource(
    listid.length > 0 ? selectAPIList : selectAPINull,
    [listid],
    {
      listid: '',
      creatorid: '',
      listname: '',
      name: '',
      desc: '',
      archive: false,
      sender_policy: 'owner',
      member_policy: 'owner',
      last_updated: 0,
      creation_time: 0,
    },
  );

  const isOrg = list.success && ctx.isOrgName(list.data.creatorid);
  const [user, _execUser] = useResource(
    list.success && !isOrg ? selectAPIUser : selectAPINull,
    [list.data.creatorid],
    {
      userid: '',
      username: '',
      first_name: '',
      last_name: '',
      roles: [],
      creation_time: 0,
    },
  );
  const [org, _reexecuteOrg] = useResource(
    isOrg ? selectAPIOrg : selectAPINull,
    [ctx.orgNameToOrgID(list.data.creatorid)],
    {
      orgid: '',
      name: '',
      display_name: '',
      desc: '',
      creation_time: 0,
    },
  );
  const creatorName = isOrg
    ? org.success
      ? org.data.name
      : ''
    : user.success
    ? user.data.username
    : '';

  const {loggedIn, userid} = useAuthValue();
  const useridArr = useMemo(() => [userid], [userid]);
  const [members, reexecuteMember] = useResource(
    list.success && loggedIn ? selectAPIListMemberIDs : selectAPINull,
    [list.data.listid, useridArr],
    [],
  );
  const isMember =
    Array.isArray(members.data) && members.data.some((i) => i === userid);

  const posthookSub = useCallback(() => {
    snackSub();
    reexecuteMember();
  }, [reexecuteMember, snackSub]);
  const [_sub, execSub] = useAuthCall(
    selectAPIListSub,
    [list.data.creatorid, list.data.listname],
    {},
    {posthook: posthookSub, errhook: displayErrSnack},
  );

  const posthookUnsub = useCallback(() => {
    snackUnsub();
    reexecuteMember();
  }, [reexecuteMember, snackUnsub]);
  const [_unsub, execUnsub] = useAuthCall(
    selectAPIListUnsub,
    [list.data.creatorid, list.data.listname],
    {},
    {posthook: posthookUnsub, errhook: displayErrSnack},
  );

  return (
    <div>
      {list.success && (
        <Grid justify="space-between" align="flex-end">
          <Column grow="1">
            <h2>
              {list.data.name}{' '}
              <small>{`${creatorName}.${list.data.listname}`}</small>
            </h2>
            <p>{list.data.desc}</p>
          </Column>
          <Column>
            <ButtonGroup>
              {loggedIn && !isMember && (
                <ButtonTertiary onClick={execSub}>Subscribe</ButtonTertiary>
              )}
              {loggedIn && isMember && (
                <ButtonTertiary onClick={execUnsub}>Unsubscribe</ButtonTertiary>
              )}
            </ButtonGroup>
          </Column>
        </Grid>
      )}
      {members.err && <p>{members.err.message}</p>}
    </div>
  );
};

export default List;
