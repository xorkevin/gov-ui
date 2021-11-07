import {useCallback, useMemo, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  Sidebar,
  SidebarHeader,
  ModalSurface,
  useModal,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  Chip,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {ViewMsg} from './msgcomponents';

const selectAPIList = (api) => api.mailinglist.id.get;
const selectAPIListMemberIDs = (api) => api.mailinglist.id.member.ids;
const selectAPIListMsgs = (api) => api.mailinglist.id.msgs;
const selectAPIListMsg = (api) => api.mailinglist.id.msgs.id;
const selectAPIListSub = (api) => api.mailinglist.group.list.sub;
const selectAPIListUnsub = (api) => api.mailinglist.group.list.unsub;
const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIUser = (api) => api.u.user.id;
const selectAPIOrg = (api) => api.orgs.id.get;

const MSGS_LIMIT = 32;

const MsgRow = ({
  listid,
  msgid,
  user,
  creation_time,
  spf_pass,
  dkim_pass,
  subject,
}) => {
  const modal = useModal();

  const raw = useURL(selectAPIListMsg, [listid, msgid]);

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="minwidth0" grow="1">
          <h5>
            <AnchorText ext href={raw}>
              {subject}
            </AnchorText>
          </h5>{' '}
          {user && <span>{user.username}</span>} <Time value={creation_time} />{' '}
          {spf_pass && (
            <Tooltip tooltip={spf_pass}>
              <small>
                <Chip>&#x2713; SPF</Chip>
              </small>
            </Tooltip>
          )}{' '}
          {dkim_pass && (
            <Tooltip tooltip={dkim_pass}>
              <small>
                <Chip>{dkim_pass}</Chip>
              </small>
            </Tooltip>
          )}
        </Column>
        <Column shrink="0">
          <ButtonGroup>
            <ButtonTertiary
              forwardedRef={modal.anchorRef}
              onClick={modal.toggle}
            >
              View
            </ButtonTertiary>
          </ButtonGroup>
          {modal.show && (
            <ModalSurface size="lg" anchor={modal.anchor} close={modal.close}>
              <ViewMsg
                listid={listid}
                msgid={msgid}
                user={user}
                creation_time={creation_time}
                spf_pass={spf_pass}
                dkim_pass={dkim_pass}
                subject={subject}
                close={modal.close}
              />
            </ModalSurface>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

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

  const paginate = usePaginate(MSGS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMsgs = useCallback(
    (_res, msgs) => {
      setAtEnd(msgs.length < MSGS_LIMIT);
    },
    [setAtEnd],
  );
  const [msgs] = useResource(
    list.success ? selectAPIListMsgs : selectAPINull,
    [list.data.listid, MSGS_LIMIT, paginate.index],
    [],
    {posthook: posthookMsgs},
  );

  const senderIDs = useMemo(
    () =>
      Array.isArray(msgs.data) &&
      Array.from(new Set(msgs.data.map((i) => i.userid))),
    [msgs],
  );
  const [users] = useResource(
    senderIDs.length > 0 ? selectAPIUsers : selectAPINull,
    [senderIDs],
    [],
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.data.map((i) => [i.userid, i])),
    [users],
  );

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
            <ListGroup>
              {Array.isArray(msgs.data) &&
                msgs.data.map((i) => (
                  <MsgRow
                    key={i.msgid}
                    listid={i.listid}
                    msgid={i.msgid}
                    user={userMap[i.userid]}
                    creation_time={i.creation_time}
                    spf_pass={i.spf_pass}
                    dkim_pass={i.dkim_pass}
                    subject={i.subject}
                  />
                ))}
            </ListGroup>
            <ButtonGroup>
              <ButtonTertiary
                disabled={paginate.atFirst}
                onClick={paginate.prev}
              >
                prev
              </ButtonTertiary>
              {paginate.page}
              <ButtonTertiary
                disabled={paginate.atLast}
                onClick={paginate.next}
              >
                next
              </ButtonTertiary>
            </ButtonGroup>
            {msgs.err && <p>{msgs.err.message}</p>}
          </Column>
        </Grid>
      )}
      {members.err && <p>{members.err.message}</p>}
    </Container>
  );
};

export default List;
