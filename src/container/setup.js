import {Fragment, useContext} from 'react';
import {Link} from 'react-router-dom';
import {emailRegex} from '../utility';
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
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../middleware';

const selectAPISetup = (api) => api.setupz;

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

const Setup = () => {
  const ctx = useContext(GovUICtx);
  const form = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [setup, execSetup] = useAPICall(selectAPISetup, [form.state], {});

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
                <Field
                  name="first_name"
                  label="first name"
                  fullWidth
                  autoComplete="given-name"
                  autoFocus
                />
                <Field
                  name="last_name"
                  label="last name"
                  fullWidth
                  autoComplete="family-name"
                />
                <Field
                  name="username"
                  label="username"
                  hint="Must be at least 3 characters"
                  fullWidth
                  autoComplete="username"
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
                  autoComplete="new-password"
                />
                <Field
                  name="email"
                  type="email"
                  label="email"
                  fullWidth
                  autoComplete="email"
                />
              </Form>
              {setup.err && <p>{setup.err.message}</p>}
              {setup.success && <p>Server successfully setup</p>}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default Setup;
