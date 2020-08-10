import React, {Fragment, useContext} from 'react';
import {Link} from 'react-router-dom';
import {emailRegex} from '../utility';
import {useAPICall} from '@xorkevin/substation';
import {AuthCtx} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

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

const Setup = () => {
  const ctx = useContext(AuthCtx);
  const form = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    password_confirm: '',
    email_confirm: '',
  });

  const [setup, execSetup] = useAPICall(
    selectAPISetup,
    [form.state],
    {},
    {prehook: prehookValidate},
  );

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h3>Setup</h3>
              </Container>
            }
            bar={
              <ButtonGroup>
                {setup.success ? (
                  <Link to={ctx.pathHome}>
                    <ButtonPrimary>Finish</ButtonPrimary>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={ctx.pathHome}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Link>
                    <ButtonPrimary onClick={execSetup}>Setup</ButtonPrimary>
                  </Fragment>
                )}
              </ButtonGroup>
            }
          >
            <Container padded>
              <h4>Admin Account</h4>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={execSetup}
                errCheck={formErrCheck}
                validCheck={formValidCheck}
              >
                <Field name="first_name" label="first name" fullWidth />
                <Field name="last_name" label="last name" fullWidth />
                <Field
                  name="username"
                  label="username"
                  hint="Must be at least 3 characters"
                  fullWidth
                />
                <Field
                  name="password"
                  type="password"
                  label="password"
                  hint="Must be at least 10 characters"
                  hintRight={
                    form.state.password.length > 0
                      ? form.state.password.length
                      : ''
                  }
                  fullWidth
                />
                <Field
                  name="password_confirm"
                  type="password"
                  label="confirm password"
                  fullWidth
                />
                <Field name="email" label="email" fullWidth />
                <Field name="email_confirm" label="confirm email" fullWidth />
              </Form>
              {setup.err && <span>{setup.err}</span>}
              {setup.success && (
                <span>
                  <span>Server successfully setup</span>
                </span>
              )}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Setup as default, Setup};
