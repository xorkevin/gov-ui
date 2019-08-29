import React, {Fragment, useCallback} from 'react';
import {useAuthCall, useAuthResource} from 'service/auth';
import {useSnackbar, useSnackbarView} from 'service/snackbar';
import Section from 'component/section';
import Table from 'component/table';
import Button from 'component/button';
import Time from 'component/time';

const selectAPISessions = (api) => api.u.user.sessions;
const selectAPISessionDelete = (api) => api.u.user.sessions.del;

const SessionRow = ({session_id, ip, time, user_agent, posthook, errhook}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPISessionDelete,
    [session_id],
    {},
    {posthook, errhook},
  );

  return (
    <tr>
      <td>{ip}</td>
      <td>{user_agent}</td>
      <td>
        <Time value={time * 1000} />
      </td>
      <td>
        <Button text onClick={execDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

const AccountSessions = () => {
  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>Session deleted</span>
    </Fragment>,
  );

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_stage, err) => {
      snackbar(
        <Fragment>
          <span>Failed to delete session: {err}</span>
        </Fragment>,
      );
    },
    [snackbar],
  );

  const {err, data, reexecute} = useAuthResource(selectAPISessions, [], []);

  const posthookDelete = useCallback(
    (_status, _data, opts) => {
      displaySnackbar();
      reexecute(opts);
    },
    [reexecute, displaySnackbar],
  );

  return (
    <Section subsection sectionTitle="Active Sessions">
      {err && <span>{err}</span>}
      <Table
        fullWidth
        head={
          <Fragment>
            <th>IP address</th>
            <th>Browser info</th>
            <th>Last accessed</th>
            <th></th>
          </Fragment>
        }
      >
        {data.map(({session_id, ip, time, user_agent}) => {
          return (
            <SessionRow
              key={session_id}
              session_id={session_id}
              ip={ip}
              time={time}
              user_agent={user_agent}
              posthook={posthookDelete}
              errhook={displayErrSnack}
            />
          );
        })}
      </Table>
    </Section>
  );
};

export default AccountSessions;
