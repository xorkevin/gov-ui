import {Fragment, useCallback, useMemo} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
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
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

const selectAPIListMsgs = (api) => api.mailinglist.id.msgs;
const selectAPIListMsg = (api) => api.mailinglist.id.msgs.id;
const selectAPIUsers = (api) => api.u.user.ids;

const MSGS_LIMIT = 32;

const ViewMsg = ({listid, msgid, user, creation_time, subject, close}) => {
  const [msg] = useResource(selectAPIListMsg, [listid, msgid], '');
  return (
    <Fragment>
      <Grid justify="space-between" align="flex-start">
        <Column grow="1">
          <h4>{subject}</h4>
          {user && <span>{user.username}</span>} <Time value={creation_time} />{' '}
        </Column>
        <Column>
          <ButtonGroup>
            <ButtonTertiary onClick={close}>Close</ButtonTertiary>
          </ButtonGroup>
        </Column>
      </Grid>
      <hr />
      {msg.success && <pre className="mailinglist-msg-content">{msg.data}</pre>}
      {msg.err && <p>{msg.err.message}</p>}
    </Fragment>
  );
};

const MsgRow = ({
  listid,
  msgid,
  user,
  creation_time,
  spf_pass,
  dkim_pass,
  subject,
}) => {
  const menu = useMenu();
  const modal = useModal();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="mailinglist-item-name">
          <h5>
            <AnchorText local href="#">
              {subject}
            </AnchorText>{' '}
          </h5>
          {user && <span>{user.username}</span>} <Time value={creation_time} />{' '}
          {spf_pass && <Chip>{spf_pass}</Chip>}{' '}
          {dkim_pass && <Chip>{dkim_pass}</Chip>}
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
              <MenuItem>Remove</MenuItem>
            </Menu>
          )}
          {modal.show && (
            <ModalSurface size="lg" anchor={modal.anchor} close={modal.close}>
              <ViewMsg
                listid={listid}
                msgid={msgid}
                user={user}
                creation_time={creation_time}
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
  const paginate = usePaginate(MSGS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMsgs = useCallback(
    (_res, msgs) => {
      setAtEnd(msgs.length < MSGS_LIMIT);
    },
    [setAtEnd],
  );
  const [msgs] = useResource(
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
            />
          ))}
      </ListGroup>
    </div>
  );
};

export default ManageMsgs;
