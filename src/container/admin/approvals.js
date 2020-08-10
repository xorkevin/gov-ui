import React, {Fragment, useState, useCallback} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Table,
  Menu,
  Button,
  Chip,
  Time,
  Tooltip,
  FaIcon,
  usePaginate,
  useSnackbar,
} from '@xorkevin/nuke';

const LIMIT = 32;

const selectAPIApprovals = (api) => api.u.user.approvals.get;
const selectAPIApprove = (api) => api.u.user.approvals.id.approve;
const selectAPIDelete = (api) => api.u.user.approvals.id.del;

const ApprovalsRow = ({
  userid,
  username,
  auth_tags,
  email,
  first_name,
  last_name,
  creation_time,
  posthook,
  errhook,
}) => {
  const [_approveState, execApprove] = useAuthCall(
    selectAPIApprove,
    [userid],
    {},
    {posthook, errhook},
  );
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [userid],
    {},
    {posthook, errhook},
  );

  return (
    <tr>
      <td>
        <Tooltip tooltip={userid}>{username}</Tooltip>
      </td>
      <td>{email}</td>
      <td>
        {auth_tags.split(',').map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </td>
      <td>
        {first_name} {last_name}
      </td>
      <td>
        <Time value={creation_time * 1000} />
      </td>

      <td>
        <Menu
          icon={
            <Button text>
              <FaIcon icon="ellipsis-v" />
            </Button>
          }
          size="md"
          fixed
          align="right"
          position="bottom"
        >
          <span onClick={execApprove}>
            <FaIcon icon="check" /> Approve
          </span>
          <span onClick={execDelete}>
            <FaIcon icon="trash" /> Delete
          </span>
        </Menu>
      </td>
    </tr>
  );
};

const Approvals = () => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(
        <Fragment>
          <span>{err}</span>
        </Fragment>,
      );
    },
    [snackbar],
  );

  const [endPage, setEndPage] = useState(true);
  const page = usePaginate(LIMIT, endPage);

  const posthook = useCallback(
    (_status, approvals) => {
      setEndPage(approvals.length < LIMIT);
    },
    [setEndPage],
  );
  const [approvals, reexecute] = useAuthResource(
    selectAPIApprovals,
    [LIMIT, page.value],
    [],
    {posthook},
  );

  return (
    <div>
      {approvals.err && <span>{approvals.err}</span>}
      <Section subsection sectionTitle="New User Requests">
        <Table
          fullWidth
          head={
            <Fragment>
              <th>Username</th>
              <th>Email</th>
              <th>Permissions</th>
              <th>Name</th>
              <th>Creation time</th>
            </Fragment>
          }
        >
          {approvals.data.map(
            ({
              userid,
              username,
              auth_tags,
              email,
              first_name,
              last_name,
              creation_time,
            }) => (
              <ApprovalsRow
                key={userid}
                userid={userid}
                username={username}
                auth_tags={auth_tags}
                email={email}
                first_name={first_name}
                last_name={last_name}
                creation_time={creation_time}
                posthook={reexecute}
                errhook={displayErrSnack}
              />
            ),
          )}
        </Table>
        <div>
          <Button onClick={page.prev}>prev</Button>
          {page.num}
          <Button onClick={page.next}>next</Button>
        </div>
      </Section>
    </div>
  );
};

export default Approvals;
