import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {Link} from 'react-router-dom';
import {
  useAuthValue,
  useAuthCall,
  useAuthResource,
  useRefreshUser,
} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ModalSurface,
  useModal,
  Field,
  FieldSelect,
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

import {GovUICtx} from '../../middleware';
import {emailRegex} from '../../utility';
import {QRCode, QRECLevel} from '../../component/qrcode';

// Edit pass

const selectAPIEditPass = (api) => api.u.user.pass.edit;

const formErrCheckPass = ({new_password}) => {
  const err = {};
  if (new_password.length > 0 && new_password.length < 10) {
    err.new_password = true;
  }
  return err;
};

const formValidCheckPass = ({new_password}) => {
  const valid = {};
  if (new_password.length > 9) {
    valid.new_password = true;
  }
  return valid;
};

const AccountPass = () => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>&#x2713; Password updated</SnackbarSurface>,
  );

  const form = useForm({
    old_password: '',
    new_password: '',
  });

  const formAssign = form.assign;
  const posthook = useCallback(() => {
    formAssign({
      old_password: '',
      new_password: '',
    });
    displaySnackbar();
  }, [formAssign, displaySnackbar]);

  const [edit, execEdit] = useAuthCall(
    selectAPIEditPass,
    [form.state.old_password, form.state.new_password],
    {},
    {posthook},
  );

  return (
    <Fragment>
      <h3>Change password</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execEdit}
            errCheck={formErrCheckPass}
            validCheck={formValidCheckPass}
          >
            <Field
              name="old_password"
              type="password"
              label="Old password"
              fullWidth
              autoComplete="current-password"
            />
            <Field
              name="new_password"
              type="password"
              label="New password"
              hint="Must be at least 10 characters"
              hintRight={
                form.state.new_password.length > 0
                  ? form.state.new_password.length
                  : ''
              }
              fullWidth
              autoComplete="new-password"
            />
          </Form>
          <ButtonGroup>
            <ButtonPrimary onClick={execEdit}>Update Password</ButtonPrimary>
          </ButtonGroup>
          {edit.err && <p>{edit.err.message}</p>}
        </Column>
      </Grid>
    </Fragment>
  );
};

// Edit email

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

const AccountEmail = ({pathConfirm}) => {
  const {email} = useAuthValue();

  const form = useForm({
    email: '',
    password: '',
  });

  const [edit, execEdit] = useAuthCall(selectAPIEditEmail, [
    form.state.email,
    form.state.password,
  ]);

  return (
    <Fragment>
      <h3>Change email</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execEdit}
            errCheck={formErrCheckEmail}
            validCheck={formValidCheckEmail}
          >
            <Field
              name="email"
              label="New email"
              nohint
              fullWidth
              autoComplete="email"
            />
            <Field
              name="password"
              type="password"
              label="Password"
              nohint
              fullWidth
              autoComplete="current-password"
            />
          </Form>
          <ButtonGroup>
            {edit.success ? (
              <Link to={pathConfirm}>
                <ButtonSecondary>Confirm</ButtonSecondary>
              </Link>
            ) : (
              <ButtonPrimary onClick={execEdit}>Update Email</ButtonPrimary>
            )}
          </ButtonGroup>
          {edit.err && <p>{edit.err.message}</p>}
          {edit.success && (
            <p>
              Confirm your email change with the code emailed to the address
              provided above.
            </p>
          )}
        </Column>
        <Column fullWidth md={8}>
          <h5>Current email</h5>
          {email}
        </Column>
      </Grid>
    </Fragment>
  );
};

// Manage 2FA

const selectAPIOTPAdd = (api) => api.u.user.otp.add;
const selectAPIOTPConfirm = (api) => api.u.user.otp.confirm;
const selectAPIOTPRemove = (api) => api.u.user.otp.remove;

const otpAlgOpts = [
  {display: 'SHA-1 (highest compatibility)', value: 'SHA1'},
  {display: 'SHA-256 (more secure)', value: 'SHA256'},
];
const otpDigitsOpts = [
  {display: '6 (highest compatibility)', value: '6'},
  {display: '8 (more secure)', value: '8'},
];

const URIHider = ({uri}) => {
  const [display, setDisplay] = useState(false);
  const toggle = useCallback(() => {
    setDisplay((i) => !i);
  }, [setDisplay]);

  return (
    <Fragment>
      <ButtonTertiary onClick={toggle}>
        {display ? 'Hide' : 'Show Key URI'}
      </ButtonTertiary>
      {display && <code>{uri}</code>}
    </Fragment>
  );
};

const Account2FAConfirm = ({addRes, close}) => {
  const form = useForm({
    code: '',
  });

  const [confirmOTP, execConfirm] = useAuthCall(
    selectAPIOTPConfirm,
    [form.state.code],
    {},
  );

  if (confirmOTP.success) {
    return (
      <Fragment>
        <h4>TOTP Authenticator App</h4>
        <p>2FA with TOTP is enabled.</p>
        <ButtonGroup>
          <ButtonSecondary onClick={close}>Finish</ButtonSecondary>
        </ButtonGroup>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h4>TOTP Authenticator App</h4>
      <p>
        Store the following code in a safe and secure place as you will be able
        to use this code to log in to your account if you lose access to your
        OTP device or authenticator app. You will <strong>not</strong> be able
        to view it again.
      </p>
      <code>{addRes.backup}</code>
      <p>
        Scan the following qr code or add the key uri with your authenticator
        app of choice. Enter a code generated by your device to finish enabling
        OTP 2FA.
      </p>
      <QRCode data={addRes.uri} level={QRECLevel.L} scale={8} />
      <URIHider uri={addRes.uri} />
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execConfirm}
      >
        <Field name="code" label="Code" nohint fullWidth inputMode="numeric" />
      </Form>
      <ButtonGroup>
        <ButtonPrimary onClick={execConfirm}>Enable</ButtonPrimary>
      </ButtonGroup>
      {confirmOTP.err && <p>{confirmOTP.err.message}</p>}
    </Fragment>
  );
};

const Account2FAAdd = ({close}) => {
  const form = useForm({
    alg: 'SHA1',
    digits: '6',
    password: '',
  });

  const digits = (() => {
    const k = parseInt(form.state.digits, 10);
    if (Number.isNaN(k)) {
      return 6;
    }
    return k;
  })();
  const [add, execAdd] = useAuthCall(
    selectAPIOTPAdd,
    [form.state.alg, digits, form.state.password],
    {uri: '', backup: ''},
  );

  if (add.success) {
    return <Account2FAConfirm addRes={add.data} close={close} />;
  }

  return (
    <Fragment>
      <h4>TOTP Authenticator App</h4>
      <Form formState={form.state} onChange={form.update} onSubmit={execAdd}>
        <Field
          name="password"
          type="password"
          label="Password"
          nohint
          fullWidth
          autoComplete="current-password"
        />
        <FieldSelect
          name="alg"
          label="Hash algorithm"
          options={otpAlgOpts}
          nohint
          fullWidth
        />
        <FieldSelect
          name="digits"
          label="OTP Code Digits"
          options={otpDigitsOpts}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonPrimary onClick={execAdd}>Enable</ButtonPrimary>
      </ButtonGroup>
      {add.err && <p>{add.err.message}</p>}
    </Fragment>
  );
};

const Account2FARm = ({close}) => {
  const form = useForm({
    code: '',
    backup: '',
    password: '',
  });

  const formAssign = form.assign;

  const [displayBackup, setDisplayBackup] = useState(false);
  const toggleBackup = useCallback(() => {
    formAssign({
      code: '',
      backup: '',
    });
    setDisplayBackup((i) => !i);
  }, [setDisplayBackup, formAssign]);

  const [remove, execRemove] = useAuthCall(
    selectAPIOTPRemove,
    [form.state.code, form.state.backup, form.state.password],
    {},
  );

  if (remove.success) {
    return (
      <Fragment>
        <h4>TOTP Authenticator App</h4>
        <p>2FA with TOTP is disabled.</p>
        <ButtonGroup>
          <ButtonSecondary onClick={close}>Finish</ButtonSecondary>
        </ButtonGroup>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h4>TOTP Authenticator App</h4>
      <Form formState={form.state} onChange={form.update} onSubmit={execRemove}>
        <Field
          name="password"
          type="password"
          label="Password"
          nohint
          fullWidth
          autoComplete="current-password"
        />
        {displayBackup ? (
          <Field
            name="backup"
            label="Backup"
            nohint
            fullWidth
            inputMode="numeric"
          />
        ) : (
          <Field
            name="code"
            label="Code"
            nohint
            fullWidth
            inputMode="numeric"
          />
        )}
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Cancel</ButtonTertiary>
        <ButtonTertiary onClick={toggleBackup}>
          {displayBackup ? 'Use regular code' : 'Use backup code'}
        </ButtonTertiary>
        <ButtonPrimary onClick={execRemove}>Disable</ButtonPrimary>
      </ButtonGroup>
      {remove.err && <p>{remove.err.message}</p>}
    </Fragment>
  );
};

const Account2FA = () => {
  const {otp_enabled} = useAuthValue();
  const [_user, refreshUser] = useRefreshUser();

  const modal = useModal();
  const modalClose = modal.close;

  const closeRefresh = useCallback(() => {
    modalClose();
    refreshUser();
  }, [modalClose, refreshUser]);

  return (
    <Fragment>
      <h3>Two-factor Authentication</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <ListGroup>
            <ListItem>
              <Grid justify="space-between" align="center" nowrap>
                <Column>
                  <h5>TOTP Authenticator App</h5>
                </Column>
                <Column shrink="0">
                  <ButtonTertiary
                    forwardedRef={modal.anchorRef}
                    onClick={modal.toggle}
                  >
                    {otp_enabled ? 'Remove' : 'Add'}
                  </ButtonTertiary>
                </Column>
                {modal.show && (
                  <ModalSurface
                    size="md"
                    anchor={modal.anchor}
                    close={modal.close}
                  >
                    {otp_enabled ? (
                      <Account2FARm close={closeRefresh} />
                    ) : (
                      <Account2FAAdd close={closeRefresh} />
                    )}
                  </ModalSurface>
                )}
              </Grid>
            </ListItem>
          </ListGroup>
        </Column>
      </Grid>
    </Fragment>
  );
};

// Manage sessions

const SESSIONS_LIMIT = 32;

const selectAPISessions = (api) => api.u.user.sessions.get;
const selectAPISessionDelete = (api) => api.u.user.sessions.del;

const getPlatform = (parsePlatform, user_agent) => {
  const {name, os, mobile} = parsePlatform(user_agent);
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
  auth_time,
  user_agent,
  posthook,
  errhook,
  parsePlatform,
}) => {
  const ids = useMemo(() => [session_id], [session_id]);
  const [_delete, execDelete] = useAuthCall(
    selectAPISessionDelete,
    [ids],
    {},
    {posthook, errhook},
  );

  const platform = getPlatform(parsePlatform, user_agent);

  const j = ['account-session-indicator'];
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
              <div>{ip}</div>
              {current ? (
                <div>Your current session</div>
              ) : (
                <div>
                  Last accessed <Time value={time * 1000} />
                </div>
              )}
              <div>
                Last logged in <Time value={auth_time * 1000} />
              </div>
            </Column>
          </Grid>
        </Column>
        <Column shrink="0">
          <ButtonTertiary onClick={execDelete} disabled={current}>
            <FaIcon icon="trash fa-lg" />
          </ButtonTertiary>
        </Column>
      </Grid>
    </ListItem>
  );
};

const AccountSessions = () => {
  const ctx = useContext(GovUICtx);
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>
      <FaIcon icon="trash" /> Session deleted
    </SnackbarSurface>,
  );

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_stage, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const paginate = usePaginate(SESSIONS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthook = useCallback(
    (_res, sessions) => {
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

  const posthookDelete = useCallback(() => {
    displaySnackbar();
    reexecute();
  }, [reexecute, displaySnackbar]);

  return (
    <Fragment>
      <h3>Sessions</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <ListGroup>
            {sessions.data.map(
              ({session_id, ip, time, auth_time, user_agent}) => (
                <SessionRow
                  key={session_id}
                  session_id={session_id}
                  current={session_id === sessionid}
                  ip={ip}
                  time={time}
                  auth_time={auth_time}
                  user_agent={user_agent}
                  posthook={posthookDelete}
                  errhook={displayErrSnack}
                  parsePlatform={ctx.userSessionParsePlatform}
                />
              ),
            )}
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
          {sessions.err && <p>{sessions.err.message}</p>}
        </Column>
      </Grid>
    </Fragment>
  );
};

const AccountSecurity = ({pathConfirm, parsePlatform}) => {
  return (
    <div>
      <AccountPass />
      <AccountEmail pathConfirm={pathConfirm} />
      <Account2FA />
      <AccountSessions parsePlatform={parsePlatform} />
    </div>
  );
};

export default AccountSecurity;
