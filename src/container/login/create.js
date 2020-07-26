import React, {Fragment, useContext} from 'react';
import {Link} from 'react-router-dom';
import {emailRegex} from '../../utility';
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
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

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

const CreateAccount = ({userApprovals}) => {
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

  const [create, execCreate] = useAPICall(
    selectAPICreateAccount,
    [form.state],
    {},
    {prehook: prehookValidate},
  );

  return (
    <MainContent>
      <Section>
        <Container padded>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h3>Sign up</h3>
              </Container>
            }
            bar={
              <ButtonGroup>
                {create.success ? (
                  userApprovals ? (
                    <Link to={ctx.pathLogin}>
                      <ButtonSecondary>Finish</ButtonSecondary>
                    </Link>
                  ) : (
                    <Link
                      to={`/x/confirm?email=${encodeURIComponent(
                        form.state.email,
                      )}`}
                    >
                      <ButtonSecondary>Confirm</ButtonSecondary>
                    </Link>
                  )
                ) : (
                  <Fragment>
                    <Link to={ctx.pathLogin}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Link>
                    <ButtonPrimary onClick={execCreate}>Create</ButtonPrimary>
                  </Fragment>
                )}
              </ButtonGroup>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={execCreate}
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
                  hintRight={`${form.state.password.length} chars`}
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
              {create.err && <span>{create.err}</span>}
              {create.success &&
                (userApprovals ? (
                  <span>
                    A new user request has been sent to an administrator. A
                    confirmation email will be emailed to the address you
                    provided above when the request is approved.
                  </span>
                ) : (
                  <span>
                    Confirm your account with a code emailed to the address you
                    provided above.
                  </span>
                ))}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default CreateAccount;
