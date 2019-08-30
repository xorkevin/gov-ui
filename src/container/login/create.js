import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {emailRegex} from 'utility';
import {useAPICall} from 'apiclient';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPICreateAccount = (api) => api.u.user.create;

const formErrCheck = ({password, email, password_confirm, email_confirm}) => {
  const err = {};
  if (password.length > 0 && password.length < 10) {
    err.password = true;
  }
  if (password_confirm.length > 0 && password_confirm !== password) {
    err.password_confirm = 'Must match password';
  }
  if (email.length > 0 && !emailRegex.test(email)) {
    err.email = true;
  }
  if (email_confirm.length > 0 && email_confirm !== email) {
    err.email_confirm = 'Must match email';
  }
  return err;
};

const formValidCheck = ({
  username,
  password,
  email,
  first_name,
  last_name,
  password_confirm,
  email_confirm,
}) => {
  const valid = {};
  if (username.length > 2) {
    valid.username = true;
  }
  if (password.length > 9) {
    valid.password = true;
  }
  if (emailRegex.test(email)) {
    valid.email = true;
  }
  if (first_name.length > 0) {
    valid.first_name = true;
  }
  if (last_name.length > 0) {
    valid.last_name = true;
  }
  if (password.length > 0 && password_confirm === password) {
    valid.password_confirm = true;
  }
  if (email_confirm.length > 0 && email_confirm === email) {
    valid.email_confirm = true;
  }
  return valid;
};

const prehookValidate = ([form]) => {
  const {password, email, password_confirm, email_confirm} = form;
  if (password !== password_confirm) {
    return 'Passwords do not match';
  }
  if (email !== email_confirm) {
    return 'Emails do not match';
  }
};

const CreateAccount = () => {
  const [formState, updateForm] = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    password_confirm: '',
    email_confirm: '',
  });

  const [createState, execCreate] = useAPICall(
    selectAPICreateAccount,
    [formState],
    {},
    {prehook: prehookValidate},
  );

  const {success, err} = createState;

  const bar = success ? (
    <Fragment>
      <Link to="/x/confirm">
        <Button outline>Confirm</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/x/login">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execCreate}>
        Create
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
        title={<h3>Sign up</h3>}
        bar={bar}
      >
        <Form
          formState={formState}
          onChange={updateForm}
          onEnter={execCreate}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Input label="first name" name="first_name" fullWidth />
          <Input label="last name" name="last_name" fullWidth />
          <Input label="username" name="username" fullWidth />
          <Input label="password" type="password" name="password" fullWidth />
          <Input
            label="confirm password"
            type="password"
            name="password_confirm"
            fullWidth
          />
          <Input label="email" name="email" fullWidth />
          <Input label="confirm email" name="email_confirm" fullWidth />
        </Form>
        {err && <span>{err}</span>}
        {success && (
          <span>
            <span>
              Confirm your account with a code emailed to the address you
              provided above
            </span>
          </span>
        )}
      </Card>
    </Section>
  );
};

export default CreateAccount;
