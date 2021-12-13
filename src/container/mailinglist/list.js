import {lazy, Suspense, useCallback, useMemo, useContext} from 'react';
import {Routes, Route, Navigate, useHref, useParams} from 'react-router-dom';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarHeader,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';

const Threads = lazy(() => import('./threads'));
const Thread = lazy(() => import('./thread'));

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPIListMemberIDs = (api) => api.mailinglist.id.member.ids;
const selectAPIListSub = (api) => api.mailinglist.group.list.sub;
const selectAPIListUnsub = (api) => api.mailinglist.group.list.unsub;
const selectAPIUser = (api) => api.u.user.id;
const selectAPIOrg = (api) => api.orgs.id.get;

const List = () => {
  const ctx = useContext(GovUICtx);
  const matchURL = useHref('');

  const snackSub = useSnackbarView(
    <SnackbarSurface>&#x2713; Subscribed</SnackbarSurface>,
  );
  const snackUnsub = useSnackbarView(
    <SnackbarSurface>&#x2713; Unsubscribed</SnackbarSurface>,
  );
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const {listid} = useParams();

  const [list] = useResource(
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
  const [user] = useResource(
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
  const [org] = useResource(
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
  const emailDomain = isOrg ? ctx.mailinglistOrg : ctx.mailinglistUsr;
  const emailAddr = `${creatorName}.${list.data.listname}@${emailDomain}`;

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
    <Container padded narrow>
      {list.success && (
        <Grid>
          <Column fullWidth md={6}>
            <Sidebar>
              <SidebarHeader>Mailing List</SidebarHeader>
            </Sidebar>
            <ButtonGroup>
              {loggedIn && !isMember && (
                <ButtonTertiary onClick={execSub}>Subscribe</ButtonTertiary>
              )}
              {loggedIn && isMember && (
                <ButtonTertiary onClick={execUnsub}>Unsubscribe</ButtonTertiary>
              )}
            </ButtonGroup>
          </Column>
          <Column fullWidth md={18}>
            <h2>{list.data.name} </h2>
            <div>
              <AnchorText ext href={emailAddr}>
                {emailAddr}
              </AnchorText>
            </div>
            <p>{list.data.desc}</p>
            <hr />
            <Suspense fallback={ctx.fallbackView}>
              <Routes>
                <Route
                  index
                  element={
                    <Threads
                      list={list.data}
                      threadurl={`${matchURL}/threads/{0}`}
                    />
                  }
                />
                <Route
                  path="threads/:threadid"
                  element={<Thread list={list.data} back={matchURL} />}
                />
                <Route path="*" element={<Navigate to="" replace />} />
              </Routes>
            </Suspense>
          </Column>
        </Grid>
      )}
      {list.err && <p>{list.err.message}</p>}
      {members.err && <p>{members.err.message}</p>}
    </Container>
  );
};

export default List;
