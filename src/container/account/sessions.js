import React, {Fragment, useState, useCallback} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Table,
  Button,
  Time,
  useSnackbar,
  useSnackbarView,
  usePaginate,
} from '@xorkevin/nuke';

const LIMIT = 32;

const selectAPISessions = (api) => api.u.user.sessions.get;
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

  const [endPage, setEndPage] = useState(true);
  const page = usePaginate(LIMIT, endPage);

  const posthook = useCallback(
    (_status, links) => {
      setEndPage(links.length < LIMIT);
    },
    [setEndPage],
  );
  const {err, data, reexecute} = useAuthResource(
    selectAPISessions,
    [LIMIT, page.value],
    [],
    {posthook},
  );

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
      <div>
        <Button onClick={page.prev}>prev</Button>
        {page.num}
        <Button onClick={page.next}>next</Button>
      </div>
    </Section>
  );
};

export default AccountSessions;
