import {useCallback, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {
  Container,
  Grid,
  Column,
  ListGroup,
  ListItem,
  Card,
  ModalSurface,
  useModal,
  usePaginate,
  Anchor,
  ButtonGroup,
  Chip,
  FaIcon,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {ViewMsgContent, ViewMsg} from './msgcomponents';

const selectAPIThreadMsgs = (api) => api.mailinglist.id.threads.id.msgs;
const selectAPIListMsg = (api) => api.mailinglist.id.msgs.id;
const selectAPIListMsgContent = (api) => api.mailinglist.id.msgs.id.content;
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
}) => {
  const modal = useModal();

  const raw = useURL(selectAPIListMsgContent, [listid, msgid]);

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

const ViewThread = ({msg, user}) => {
  const raw = useURL(selectAPIListMsgContent, [msg.listid, msg.msgid]);

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
        </Grid>
        {!msg.deleted && (
          <ViewMsgContent listid={msg.listid} msgid={msg.msgid} />
        )}
      </Container>
    </Card>
  );
};

const Thread = ({list, back}) => {
  const {threadid} = useParams();

  const [msg] = useResource(
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
  const [msgs] = useResource(
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

  return (
    <div>
      <ButtonGroup>
        <Anchor local href={back}>
          <ButtonTertiary>
            <FaIcon icon="chevron-left" /> Back
          </ButtonTertiary>
        </Anchor>
      </ButtonGroup>
      <h5>Thread</h5>
      {msg.success && (
        <ViewThread msg={msg.data} user={userMap[msg.data.userid]} />
      )}
      {msg.err && <p>{msg.err.message}</p>}
      <h5>Replies</h5>
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

export default Thread;
