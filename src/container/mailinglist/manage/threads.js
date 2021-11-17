import {useCallback, useMemo} from 'react';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  ModalSurface,
  useModal,
  usePaginate,
  Anchor,
  ButtonGroup,
  Chip,
  Tooltip,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {formatURL} from '../../../utility';
import {ViewMsg} from '../msgcomponents';

const selectAPIListThreads = (api) => api.mailinglist.id.threads;
const selectAPIListMsgContent = (api) => api.mailinglist.id.msgs.id.content;
const selectAPIUsers = (api) => api.u.user.ids;

const MSGS_LIMIT = 32;

const ThreadRow = ({
  listid,
  msgid,
  user,
  creation_time,
  spf_pass,
  dkim_pass,
  subject,
  deleted,
  threadurl,
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
            <Anchor local href={formatURL(threadurl, msgid)}>
              <ButtonTertiary>Thread</ButtonTertiary>
            </Anchor>
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

const ManageThreads = ({list, threadurl}) => {
  const paginate = usePaginate(MSGS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookMsgs = useCallback(
    (_res, msgs) => {
      setAtEnd(msgs.length < MSGS_LIMIT);
    },
    [setAtEnd],
  );
  const [msgs] = useResource(
    selectAPIListThreads,
    [list.listid, MSGS_LIMIT, paginate.index],
    [],
    {posthook: posthookMsgs},
  );

  const senderIDs = useMemo(
    () =>
      Array.isArray(msgs.data) &&
      Array.from(
        new Set(msgs.data.flatMap((i) => (i.deleted ? [] : [i.userid]))),
      ),
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
            <ThreadRow
              key={i.msgid}
              listid={i.listid}
              msgid={i.msgid}
              user={userMap[i.userid]}
              creation_time={i.creation_time}
              spf_pass={i.spf_pass}
              dkim_pass={i.dkim_pass}
              subject={i.subject}
              deleted={i.deleted}
              threadurl={threadurl}
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

export default ManageThreads;
