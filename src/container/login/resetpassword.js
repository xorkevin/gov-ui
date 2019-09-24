import React, {Fragment} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from 'utility';
import {useAPICall} from 'apiclient';
import {useSnackbarView} from 'service/snackbar';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIResetPass = (api) => api.u.user.pass.forgot.confirm;

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

const prehookValidate = ([_key, new_password, password_confirm]) => {
  if (new_password !== password_confirm) {
    return 'Passwords do not match';
  }
};

const ConfirmReset = () => {
  const {search} = useLocation();

  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>Password updated</span>
    </Fragment>,
  );

  const [formState, updateForm] = useForm({
    key: getSearchParams(search).get('key') || '',
    new_password: '',
    password_confirm: '',
  });

  const [resetState, execReset] = useAPICall(
    selectAPIResetPass,
    [formState.key, formState.new_password, formState.password_confirm],
    {},
    {prehook: prehookValidate, posthook: displaySnackbar},
  );

  const {success, err} = resetState;

  const bar = success ? (
    <Fragment>
      <Link to="/x/login">
        <Button outline>Sign in</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/x/login">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execReset}>
        Reset Password
      </Button>
    </Fragment>
  );

  return (
    <Section container padded>
      <Card
        center
        size="md"
        restrictWidth
        titleBar
        title={<h3>Reset password</h3>}
        bar={bar}
      >
        <Form
          formState={formState}
          onChange={updateForm}
          onEnter={execReset}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Input label="code" name="key" fullWidth />
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
        {err && <span>{err}</span>}
      </Card>
    </Section>
  );
};

export default ConfirmReset;
