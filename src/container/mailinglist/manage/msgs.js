import {useCallback, useMemo} from 'react';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  ModalSurface,
  useModal,
  useMenu,
  Menu,
  MenuItem,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {ViewMsg} from '../msgcomponents';

const selectAPIListMsgs = (api) => api.mailinglist.id.msgs;
const selectAPIListMsg = (api) => api.mailinglist.id.msgs.id;
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
  list,
  posthookDelete,
  errhook,
}) => {
  const menu = useMenu();
  const modal = useModal();

  const raw = useURL(selectAPIListMsg, [listid, msgid]);

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
                <Chip>&#x2713; DKIM</Chip>
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
            <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
              <FaIcon icon="ellipsis-v" />
            </ButtonTertiary>
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

const ManageMsgs = ({list}) => {
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

  const paginate = usePaginate(MSGS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMsgs = useCallback(
    (_res, msgs) => {
      setAtEnd(msgs.length < MSGS_LIMIT);
    },
    [setAtEnd],
  );
  const [msgs, reexecute] = useResource(
    selectAPIListMsgs,
    [list.listid, MSGS_LIMIT, paginate.index],
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

  const posthookDelete = useCallback(() => {
    displaySnackDeleted();
    reexecute();
  }, [displaySnackDeleted, reexecute]);

  return (
    <div>
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

export default ManageMsgs;
