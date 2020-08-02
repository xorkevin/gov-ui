import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  ListGroup,
  ListItem,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import {emailRegex} from '../../utility';

// Edit pass

const selectAPIEditPass = (api) => api.u.user.pass.edit;

const formErrCheckPass = ({new_password, password_confirm}) => {
  const err = {};
  if (new_password.length > 0 && new_password.length < 10) {
    err.new_password = true;
  }
  if (password_confirm.length > 0 && password_confirm !== new_password) {
    err.password_confirm = 'Must match password';
  }
  return err;
};

const formValidCheckPass = ({new_password, password_confirm}) => {
  const valid = {};
  if (new_password.length > 9) {
    valid.new_password = true;
  }
  if (password_confirm.length > 0 && password_confirm === new_password) {
    valid.password_confirm = true;
  }
  return valid;
};

const prehookValidatePass = ([_old_pass, new_password, password_confirm]) => {
  if (new_password !== password_confirm) {
    return 'Passwords do not match';
  }
};

// Edit email

const selectAPIAccount = (api) => api.u.user.get;
const selectAPIEditEmail = (api) => api.u.user.email.edit;

const formErrCheckEmail = ({email}) => {
  const err = {};
  if (email.length > 0 && !emailRegex.test(email)) {
    err.email = true;
  }
  return err;
};

const formValidCheckEmail = ({email}) => {
  const valid = {};
  if (emailRegex.test(email)) {
    valid.email = true;
  }
  return valid;
};

// Manage sessions

const SESSIONS_LIMIT = 32;

const selectAPISessions = (api) => api.u.user.sessions.get;
const selectAPISessionDelete = (api) => api.u.user.sessions.del;

const getPlatform = (parsePlatform, user_agent) => {
  const {name, os, mobile} = parsePlatform(user_agent);
  console.log(name, os, mobile);
  if (name.length > 0) {
    if (os.length > 0) {
      return {
        desc: `${name} on ${os}`,
        mobile,
      };
    }
    return {
      desc: name,
      mobile,
    };
  }
  return {
    desc: user_agent,
    mobile,
  };
};

const SessionRow = ({
  session_id,
  current,
  ip,
  time,
  user_agent,
  posthook,
  errhook,
  parsePlatform,
}) => {
  const [_delete, execDelete] = useAuthCall(
    selectAPISessionDelete,
    [session_id],
    {},
    {posthook, errhook},
  );

  const platform = getPlatform(parsePlatform, user_agent);

  const j = ['session-indicator'];
  if (current) {
    j.push('current');
  }

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <Grid align="center" nowrap>
            <Column shrink="0">
              <span className={j.join(' ')}></span>
            </Column>
            <Column shrink="0">
              <FaIcon
                icon={platform.mobile ? 'mobile fa-2x' : 'desktop fa-2x'}
              />
            </Column>
            <Column>
              <h5>{platform.desc}</h5>
              <p>{ip}</p>
              {current ? (
                <p>Your current session</p>
              ) : (
                <p>
                  Last accessed <Time value={time * 1000} />
                </p>
              )}
            </Column>
          </Grid>
        </Column>
        <Column shrink="0">
          <ButtonTertiary onClick={execDelete} disabled={current}>
            <h4>
              <FaIcon icon="trash" />
            </h4>
          </ButtonTertiary>
        </Column>
      </Grid>
    </ListItem>
  );
};

const AccountSessions = ({parsePlatform}) => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>Session deleted</SnackbarSurface>,
  );

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_stage, err) => {
      snackbar(
        <SnackbarSurface>Failed to delete session: {err}</SnackbarSurface>,
      );
    },
    [snackbar],
  );

  const paginate = usePaginate(SESSIONS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_status, sessions) => {
      setAtEnd(sessions.length < SESSIONS_LIMIT);
    },
    [setAtEnd],
  );
  const [sessions, reexecute] = useAuthResource(
    selectAPISessions,
    [SESSIONS_LIMIT, paginate.index],
    [],
    {posthook},
  );

  const {sessionid} = useAuthValue();

  const posthookDelete = useCallback(
    (_status, _data, opts) => {
      displaySnackbar();
      reexecute(opts);
    },
    [reexecute, displaySnackbar],
  );

  return (
    <Fragment>
      <h3>Sessions</h3>
      <hr />
      <Grid>
        <Column md={16}>
          <ListGroup>
            {sessions.data.map(({session_id, ip, time, user_agent}) => (
              <SessionRow
                key={session_id}
                session_id={session_id}
                current={session_id === sessionid}
                ip={ip}
                time={time}
                user_agent={user_agent}
                posthook={posthookDelete}
                errhook={displayErrSnack}
                parsePlatform={parsePlatform}
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
          {sessions.err && <p>{sessions.err}</p>}
        </Column>
      </Grid>
    </Fragment>
  );
};

const AccountSecurity = ({pathConfirm, parsePlatform}) => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>&#x2713; Password updated</SnackbarSurface>,
  );

  const formPass = useForm({
    old_password: '',
    new_password: '',
    password_confirm: '',
  });

  const formPassAssign = formPass.assign;
  const posthookPass = useCallback(
    (_status, _data) => {
      formPassAssign({
        old_password: '',
        new_password: '',
        password_confirm: '',
      });
      displaySnackbar();
    },
    [formPassAssign, displaySnackbar],
  );

  const [editPass, execEditPass] = useAuthCall(
    selectAPIEditPass,
    [
      formPass.state.old_password,
      formPass.state.new_password,
      formPass.state.password_confirm,
    ],
    {},
    {prehook: prehookValidatePass, posthook: posthookPass},
  );

  const formEmail = useForm({
    email: '',
    password: '',
  });

  const [editEmail, execEditEmail] = useAuthCall(selectAPIEditEmail, [
    formEmail.state.email,
    formEmail.state.password,
  ]);

  const [account] = useAuthResource(selectAPIAccount, [], {
    email: '',
  });

  return (
    <div>
      {account.success && (
        <Fragment>
          <h3>Change password</h3>
          <hr />
          <Grid>
            <Column md={16}>
              <Form
                formState={formPass.state}
                onChange={formPass.update}
                onSubmit={execEditPass}
                errCheck={formErrCheckPass}
                validCheck={formValidCheckPass}
              >
                <Field
                  name="old_password"
                  type="password"
                  label="Old password"
                  fullWidth
                />
                <Field
                  name="new_password"
                  type="password"
                  label="New password"
                  hint="Must be at least 10 characters"
                  hintRight={`${formPass.state.new_password.length} chars`}
                  fullWidth
                />
                <Field
                  name="password_confirm"
                  type="password"
                  label="Confirm password"
                  fullWidth
                />
              </Form>
              <ButtonGroup>
                <ButtonPrimary onClick={execEditPass}>
                  Update Password
                </ButtonPrimary>
              </ButtonGroup>
              {editPass.err && <p>{editPass.err}</p>}
            </Column>
          </Grid>
          <h3>Change email</h3>
          <hr />
          <Grid>
            <Column md={16}>
              <Form
                formState={formEmail.state}
                onChange={formEmail.update}
                onSubmit={execEditEmail}
                errCheck={formErrCheckEmail}
                validCheck={formValidCheckEmail}
              >
                <Field name="email" label="New email" fullWidth />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                />
              </Form>
              <ButtonGroup>
                {editEmail.success ? (
                  <Link to={pathConfirm}>
                    <ButtonSecondary>Confirm</ButtonSecondary>
                  </Link>
                ) : (
                  <ButtonPrimary onClick={execEditEmail}>
                    Update Email
                  </ButtonPrimary>
                )}
              </ButtonGroup>
              {editEmail.err && <p>{editEmail.err}</p>}
              {editEmail.success && (
                <p>
                  Confirm your email change with the code emailed to the address
                  provided above.
                </p>
              )}
            </Column>
            <Column md={8}>
              <h5>Current email</h5>
              {account.data.email}
            </Column>
          </Grid>
        </Fragment>
      )}
      {account.err && <p>{account.err}</p>}
      <AccountSessions parsePlatform={parsePlatform} />
    </div>
  );
};

export default AccountSecurity;
