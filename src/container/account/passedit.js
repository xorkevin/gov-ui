import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall} from 'service/auth';
import {useSnackbarView} from 'service/snackbar';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIEditPass = (api) => api.u.user.pass.edit;

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

const prehookValidate = ([form]) => {
  const {new_password, password_confirm} = form;
  if (new_password !== password_confirm) {
    return 'Passwords do not match';
  }
};

const AccountPassEdit = () => {
  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>Password updated</span>
    </Fragment>,
  );

  const [formState, updateForm] = useForm({
    old_password: '',
    new_password: '',
    password_confirm: '',
  });

  const [passState, execEditPass] = useAuthCall(
    selectAPIEditPass,
    [formState.old_password, formState.new_password],
    {},
    {prehook: prehookValidate, posthook: displaySnackbar},
  );

  const {success, err} = passState;

  const bar = success ? (
    <Fragment>
      <Link to="/a/account">
        <Button text>Back</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/a/account">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execEditPass}>
        Update
      </Button>
    </Fragment>
  );

  return (
    <Card size="md" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Account Details">
        <Form
          formState={formState}
          onChange={updateForm}
          onEnter={execEditPass}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Input
            label="old password"
            type="password"
            name="old_password"
            fullWidth
          />
          <Input
            label="new password"
            type="password"
            name="new_password"
            info="Must be at least 10 characters"
            fullWidth
          />
          <Input
            label="confirm password"
            type="password"
            name="password_confirm"
            fullWidth
          />
        </Form>
      </Section>
      {err && <span>{err}</span>}
    </Card>
  );
};

export default AccountPassEdit;
