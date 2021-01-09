import {Fragment, useContext} from 'react';
import {Link} from 'react-router-dom';
import {useAPICall} from '@xorkevin/substation';
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

import {GovUICtx} from '../../middleware';
import {formatURL, emailRegex} from '../../utility';

const selectAPICreateAccount = (api) => api.u.user.create;

const formErrCheck = ({password, email}) => {
  const err = {};
  if (password.length > 0 && password.length < 10) {
    err.password = true;
  }
  if (email.length > 0 && !emailRegex.test(email)) {
    err.email = true;
  }
  return err;
};

const formValidCheck = ({username, password, email, first_name, last_name}) => {
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
  return valid;
};

const CreateAccount = ({pathLogin, pathConfirm}) => {
  const ctx = useContext(GovUICtx);
  const form = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [create, execCreate] = useAPICall(
    selectAPICreateAccount,
    [form.state],
    {},
  );

  const pathConfirmTpl = `${pathConfirm}?userid={0}`;

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
                  ctx.enableUserApprovals ? (
                    <Link to={pathLogin}>
                      <ButtonSecondary>Finish</ButtonSecondary>
                    </Link>
                  ) : (
                    <Link to={formatURL(pathConfirmTpl, create.data.userid)}>
                      <ButtonSecondary>Confirm</ButtonSecondary>
                    </Link>
                  )
                ) : (
                  <Fragment>
                    <Link to={pathLogin}>
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
                <Field
                  name="first_name"
                  label="First name"
                  fullWidth
                  autoComplete="given-name"
                  autoFocus
                />
                <Field
                  name="last_name"
                  label="Last name"
                  fullWidth
                  autoComplete="family-name"
                />
                <Field
                  name="username"
                  label="Username"
                  hint="Must be at least 3 characters"
                  fullWidth
                  autoComplete="username"
                />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  hint="Must be at least 10 characters"
                  hintRight={
                    form.state.password.length > 0
                      ? form.state.password.length
                      : ''
                  }
                  fullWidth
                  autoComplete="new-password"
                />
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  fullWidth
                  autoComplete="email"
                />
              </Form>
              {create.err && <p>{create.err}</p>}
              {create.success &&
                (ctx.enableUserApprovals ? (
                  <p>
                    A new user request has been sent to an administrator. A
                    confirmation email will be emailed to the address you
                    provided above when the request is approved.
                  </p>
                ) : (
                  <p>
                    Confirm your account with a code emailed to the address you
                    provided above.
                  </p>
                ))}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default CreateAccount;
