import React, {Fragment, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {emailRegex} from 'utility';
import {useAPICall} from '@xorkevin/substation';
import {Section, Card, Button, Form, Input, useForm} from '@xorkevin/nuke';

import {URL} from 'example/config';

const selectAPISetup = (api) => api.setupz;

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
  orgname,
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
  if (orgname.length > 0) {
    valid.orgname = true;
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

const Setup = () => {
  const history = useHistory();
  const navigateHome = useCallback(() => {
    history.push(URL.home);
  }, [history]);

  const [formState, updateForm] = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    orgname: '',
    password_confirm: '',
    email_confirm: '',
  });

  const [setupState, execSetup] = useAPICall(
    selectAPISetup,
    [formState],
    {orgname: ''},
    {prehook: prehookValidate},
  );

  const {success, err, data} = setupState;

  return (
    <Section container padded>
      <Card
        center
        size="md"
        restrictWidth
        titleBar
        title={<h3>Setup</h3>}
        bar={
          <Fragment>
            <Button text onClick={navigateHome}>
              Cancel
            </Button>
            <Button primary onClick={execSetup}>
              Setup
            </Button>
          </Fragment>
        }
      >
        <Form
          formState={formState}
          onChange={updateForm}
          onEnter={execSetup}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Section subsection sectionTitle="Organization">
            <Input label="organization name" name="orgname" fullWidth />
          </Section>
          <Section subsection sectionTitle="Admin Account">
            <Input label="first name" name="first_name" fullWidth />
            <Input label="last name" name="last_name" fullWidth />
            <Input label="username" name="username" fullWidth />
            <Input
              label="password"
              type="password"
              name="password"
              info="Must be at least 10 characters"
              fullWidth
            />
            <Input
              label="confirm password"
              type="password"
              name="password_confirm"
              fullWidth
            />
            <Input label="email" name="email" fullWidth />
            <Input label="confirm email" name="email_confirm" fullWidth />
          </Section>
          {err && <span>{err}</span>}
          {success && (
            <span>
              <span>{data && data.orgname} has been created</span>
              <Button outline onClick={navigateHome}>
                Finish
              </Button>
            </span>
          )}
        </Form>
      </Card>
    </Section>
  );
};

export {Setup as default, Setup};
