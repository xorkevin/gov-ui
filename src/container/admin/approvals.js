import {Fragment, useCallback} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Table,
  useMenu,
  Menu,
  MenuItem,
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const APPROVALS_LIMIT = 32;

const selectAPIApprovals = (api) => api.u.user.approvals.get;
const selectAPIApprove = (api) => api.u.user.approvals.id.approve;
const selectAPIDelete = (api) => api.u.user.approvals.id.del;

const ApprovalsRow = ({
  userid,
  username,
  email,
  first_name,
  last_name,
  creation_time,
  approved,
  code_time,
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

  const menu = useMenu();

  return (
    <tr>
      <td>{userid}</td>
      <td>{username}</td>
      <td>{`${first_name} ${last_name}`}</td>
      <td>{email}</td>
      <td>
        <Time value={creation_time * 1000} />
      </td>
      <td>
        {approved ? (
          <Fragment>
            Yes, <Time value={code_time * 1000} />
          </Fragment>
        ) : (
          'No'
        )}
      </td>
      <td>
        <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
          <FaIcon icon="ellipsis-v" />
        </ButtonTertiary>
        {menu.show && (
          <Menu size="md" anchor={menu.anchor} close={menu.close}>
            <MenuItem onClick={execApprove} icon={<FaIcon icon="check" />}>
              Approve
            </MenuItem>
            <MenuItem onClick={execDelete} icon={<FaIcon icon="trash" />}>
              Reject
            </MenuItem>
          </Menu>
        )}
      </td>
    </tr>
  );
};

const Approvals = () => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_status, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(APPROVALS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_status, approvals) => {
      setAtEnd(approvals.length < APPROVALS_LIMIT);
    },
    [setAtEnd],
  );
  const [approvals, reexecute] = useAuthResource(
    selectAPIApprovals,
    [APPROVALS_LIMIT, paginate.index],
    [],
    {posthook},
  );

  return (
    <div>
      <h3>Approvals</h3>
      <hr />
      {approvals.err && <p>{approvals.err.message}</p>}
      {approvals.success && (
        <Fragment>
          <Table
            head={
              <Fragment>
                <th>Userid</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Creation time</th>
                <th>Approved</th>
                <th></th>
              </Fragment>
            }
          >
            {approvals.data.map(
              ({
                userid,
                username,
                email,
                first_name,
                last_name,
                creation_time,
                approved,
                code_time,
              }) => (
                <ApprovalsRow
                  key={userid}
                  userid={userid}
                  username={username}
                  email={email}
                  first_name={first_name}
                  last_name={last_name}
                  creation_time={creation_time}
                  approved={approved}
                  code_time={code_time}
                  posthook={reexecute}
                  errhook={displayErrSnack}
                />
              ),
            )}
          </Table>
          <ButtonGroup>
            <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
              prev
            </ButtonTertiary>
            {paginate.page}
            <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
              next
            </ButtonTertiary>
          </ButtonGroup>
        </Fragment>
      )}
    </div>
  );
};

export default Approvals;
