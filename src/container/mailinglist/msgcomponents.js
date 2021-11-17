import {Fragment, useMemo} from 'react';
import {useResource} from '@xorkevin/substation';
import {Grid, Column, ButtonGroup, Chip, Tooltip, Time} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIListMsgContent = (api) => api.mailinglist.id.msgs.id.content;

const ViewMsgContent = ({listid, msgid}) => {
  const [msg] = useResource(selectAPIListMsgContent, [listid, msgid], '');
  const [headers, body] = useMemo(() => {
    if (!msg.success || typeof msg.data !== 'string') {
      return [null, null];
    }
    const k = msg.data.indexOf('\r\n\r\n');
    if (k < 0) {
      return [null, msg.data];
    }
    return [msg.data.substring(0, k), msg.data.substring(k + 4)];
  }, [msg]);
  return (
    <Fragment>
      {headers && (
        <div className="mailinglist-msg-section">
          <details>
            <summary>Headers</summary>
            <pre className="mailinglist-msg-content">{headers}</pre>
          </details>
        </div>
      )}
      {body && (
        <div className="mailinglist-msg-section">
          <pre className="mailinglist-msg-content">{body}</pre>
        </div>
      )}
      {msg.err && <p>{msg.err.message}</p>}
    </Fragment>
  );
};

const ViewMsg = ({
  listid,
  msgid,
  user,
  creation_time,
  spf_pass,
  dkim_pass,
  subject,
  close,
}) => {
  return (
    <Fragment>
      <Grid justify="space-between" align="flex-start">
        <Column grow="1">
          <h4>{subject}</h4>
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
        <Column>
          <ButtonGroup>
            <ButtonTertiary onClick={close}>Close</ButtonTertiary>
          </ButtonGroup>
        </Column>
      </Grid>
      <hr />
      <ViewMsgContent listid={listid} msgid={msgid} />
    </Fragment>
  );
};

export {ViewMsgContent, ViewMsg};
