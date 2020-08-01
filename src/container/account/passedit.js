import React from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Container,
  Card,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIEdit = (api) => api.u.user.pass.edit;

const formErrCheck = ({new_password, password_confirm}) => {
  const err = {};
  if (new_password.length > 0 && new_password.length < 10) {
    err.new_password = true;
  }
  if (password_confirm.length > 0 && password_confirm !== new_password) {
    err.password_confirm = 'Must match password';
  }
  return err;
};

const formValidCheck = ({new_password, password_confirm}) => {
  const valid = {};
  if (new_password.length > 9) {
    valid.new_password = true;
  }
  if (password_confirm.length > 0 && password_confirm === new_password) {
    valid.password_confirm = true;
  }
  return valid;
};

const prehookValidate = ([_old_pass, new_password, password_confirm]) => {
  if (new_password !== password_confirm) {
    return 'Passwords do not match';
  }
};

const AccountPassEdit = ({pathAccount}) => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>Password updated</SnackbarSurface>,
  );

  const form = useForm({
    old_password: '',
    new_password: '',
    password_confirm: '',
  });

  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [
      form.state.old_password,
      form.state.new_password,
      form.state.password_confirm,
    ],
    {},
    {prehook: prehookValidate, posthook: displaySnackbar},
  );

  return (
    <Card
      center
      width="md"
      title={
        <Container padded>
          <h3>Change Account Password</h3>
        </Container>
      }
      bar={
        edit.success ? (
          <ButtonGroup>
            <Link to={pathAccount}>
              <ButtonTertiary>Back</ButtonTertiary>
            </Link>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Link to={pathAccount}>
              <ButtonTertiary>Cancel</ButtonTertiary>
            </Link>
            <ButtonPrimary onClick={execEdit}>Update</ButtonPrimary>
          </ButtonGroup>
        )
      }
    >
      <Container padded>
        <Form
          formState={form.state}
          onChange={form.update}
          onSubmit={execEdit}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Field
            name="old_password"
            type="password"
            label="old password"
            fullWidth
          />
          <Field
            name="new_password"
            type="password"
            label="new password"
            hint="Must be at least 10 characters"
            hintRight={`${form.state.new_password.length} chars`}
            fullWidth
          />
          <Field
            name="password_confirm"
            type="password"
            label="confirm password"
            fullWidth
          />
        </Form>
        {edit.err && <span>{edit.err}</span>}
      </Container>
    </Card>
  );
};

export default AccountPassEdit;
