import {useCallback, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  Card,
  ModalSurface,
  useModal,
  useMenu,
  Menu,
  MenuItem,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  Anchor,
  ButtonGroup,
  FaIcon,
  Chip,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {ViewMsgContent, ViewMsg} from '../msgcomponents';

const selectAPIThreadMsgs = (api) => api.mailinglist.id.threads.id.msgs;
const selectAPIListMsg = (api) => api.mailinglist.id.msgs.id;
const selectAPIListMsgContent = (api) => api.mailinglist.id.msgs.id.content;
const selectAPIListMsgDel = (api) => api.mailinglist.group.list.msgs.del;
const selectAPIUsers = (api) => api.u.user.ids;

const MSGS_LIMIT = 32;

const MsgRow = ({
  listid,
  msgid,
  user,
  creation_time,
  spf_pass,
  dkim_pass,
  subject,
  deleted,
  list,
  posthookDelete,
  errhook,
}) => {
  const menu = useMenu();
  const modal = useModal();

  const raw = useURL(selectAPIListMsgContent, [listid, msgid]);

  const msgidArr = useMemo(() => [msgid], [msgid]);
  const [_delState, execRmMsg] = useAuthCall(
    selectAPIListMsgDel,
    [list.creatorid, list.listname, msgidArr],
    {},
    {posthook: posthookDelete, errhook: errhook},
  );

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        {deleted && (
          <Column className="minwidth0" grow="1">
            [deleted]
          </Column>
        )}
        {!deleted && (
          <Column className="minwidth0" grow="1">
            <h5>
              <AnchorText ext href={raw}>
                {subject}
              </AnchorText>
            </h5>{' '}
            {user && <span>{user.username}</span>}{' '}
            <Time value={creation_time} />{' '}
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
                  <Chip>&#x2713; DKIM</Chip>
                </small>
              </Tooltip>
            )}
          </Column>
        )}
        <Column shrink="0">
          <ButtonGroup>
            {!deleted && (
              <ButtonTertiary
                forwardedRef={modal.anchorRef}
                onClick={modal.toggle}
              >
                View
              </ButtonTertiary>
            )}
            {!deleted && (
              <ButtonTertiary
                forwardedRef={menu.anchorRef}
                onClick={menu.toggle}
              >
                <FaIcon icon="ellipsis-v" />
              </ButtonTertiary>
            )}
          </ButtonGroup>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={execRmMsg}>Remove</MenuItem>
            </Menu>
          )}
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

const ViewThread = ({msg, user, list, posthookDelete, errhook}) => {
  const menu = useMenu();

  const raw = useURL(selectAPIListMsgContent, [msg.listid, msg.msgid]);

  const msgid = msg.msgid;
  const msgidArr = useMemo(() => [msgid], [msgid]);
  const [_delState, execRmMsg] = useAuthCall(
    selectAPIListMsgDel,
    [list.creatorid, list.listname, msgidArr],
    {},
    {posthook: posthookDelete, errhook: errhook},
  );

  return (
    <Card>
      <Container padded>
        <Grid justify="space-between" align="center" nowrap>
          {msg.deleted && (
            <Column className="minwidth0" grow="1">
              [deleted]
            </Column>
          )}
          {!msg.deleted && (
            <Column className="minwidth0" grow="1">
              <h4>
                <AnchorText ext href={raw}>
                  {msg.subject}
                </AnchorText>
              </h4>{' '}
              {user && <span>{user.username}</span>}{' '}
              <Time value={msg.creation_time} />{' '}
              {msg.spf_pass && (
                <Tooltip tooltip={msg.spf_pass}>
                  <small>
                    <Chip>&#x2713; SPF</Chip>
                  </small>
                </Tooltip>
              )}{' '}
              {msg.dkim_pass && (
                <Tooltip tooltip={msg.dkim_pass}>
                  <small>
                    <Chip>&#x2713; DKIM</Chip>
                  </small>
                </Tooltip>
              )}
            </Column>
          )}
          <Column shrink="0">
            <ButtonGroup>
              {!msg.deleted && (
                <ButtonTertiary
                  forwardedRef={menu.anchorRef}
                  onClick={menu.toggle}
                >
                  <FaIcon icon="ellipsis-v" />
                </ButtonTertiary>
              )}
            </ButtonGroup>
            {menu.show && (
              <Menu
                size="md"
                anchor={menu.anchor}
                close={menu.close}
                onClick={menu.close}
              >
                <MenuItem onClick={execRmMsg}>Remove</MenuItem>
              </Menu>
            )}
          </Column>
        </Grid>
        {!msg.deleted && (
          <ViewMsgContent listid={msg.listid} msgid={msg.msgid} />
        )}
      </Container>
    </Card>
  );
};

const ManageThread = ({list, back}) => {
  const {threadid} = useParams();

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const displaySnackDeleted = useSnackbarView(
    <SnackbarSurface>&#x2713; Message deleted</SnackbarSurface>,
  );

  const [msg, reexecuteMsg] = useResource(
    threadid && threadid.length > 0 ? selectAPIListMsg : selectAPINull,
    [list.listid, threadid],
    {
      listid: '',
      msgid: '',
      userid: '',
      creation_time: 0,
      spf_pass: '',
      dkim_pass: '',
      subject: '',
      deleted: '',
    },
  );

  const paginate = usePaginate(MSGS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMsgs = useCallback(
    (_res, msgs) => {
      setAtEnd(msgs.length < MSGS_LIMIT);
    },
    [setAtEnd],
  );
  const [msgs, reexecute] = useResource(
    threadid && threadid.length > 0 ? selectAPIThreadMsgs : selectAPINull,
    [list.listid, threadid, MSGS_LIMIT, paginate.index],
    [],
    {posthook: posthookMsgs},
  );

  const threadUserid = msg.success ? msg.data.userid : '';
  const senderIDs = useMemo(
    () =>
      Array.isArray(msgs.data) &&
      Array.from(
        new Set(
          (threadUserid.length > 0 ? [threadUserid] : []).concat(
            msgs.data.flatMap((i) => (i.deleted ? [] : [i.userid])),
          ),
        ),
      ),
    [threadUserid, msgs],
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

  const posthookDelete = useCallback(() => {
    displaySnackDeleted();
    reexecuteMsg();
    reexecute();
  }, [displaySnackDeleted, reexecuteMsg, reexecute]);

  return (
    <div>
      <ButtonGroup>
        <Anchor local href={back}>
          <ButtonTertiary>
            <FaIcon icon="chevron-left" /> Back
          </ButtonTertiary>
        </Anchor>
      </ButtonGroup>
      {msg.success && (
        <ViewThread
          msg={msg.data}
          user={userMap[msg.data.userid]}
          list={list}
          posthookDelete={posthookDelete}
          errhook={displayErrSnack}
        />
      )}
      {msg.err && <p>{msg.err.message}</p>}
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
              deleted={i.deleted}
              list={list}
              posthookDelete={posthookDelete}
              errhook={displayErrSnack}
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
      {msgs.err && <p>{msgs.err.message}</p>}
    </div>
  );
};

export default ManageThread;
