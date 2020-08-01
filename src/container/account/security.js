import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
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

const AccountSecurity = ({pathConfirm}) => {
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
    </div>
  );
};

export default AccountSecurity;
