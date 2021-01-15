import {Fragment, useContext} from 'react';
import {useLogin} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  FaIcon,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../../middleware';

const AuthContainer = () => {
  const ctx = useContext(GovUICtx);

  const form = useForm({
    username: '',
    password: '',
  });

  const [login, execLogin] = useLogin(form.state.username, form.state.password);

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h4>Sign in with {ctx.siteName}</h4>
              </Container>
            }
            bar={
              <Fragment>
                <ButtonGroup>
                  <ButtonTertiary>
                    <FaIcon icon="ellipsis-v" />
                  </ButtonTertiary>
                  <ButtonPrimary onClick={execLogin}>Login</ButtonPrimary>
                </ButtonGroup>
              </Fragment>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={execLogin}
              >
                <Field
                  name="username"
                  label="Username / Email"
                  fullWidth
                  autoComplete="username"
                  autoFocus
                />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  autoComplete="current-password"
                />
              </Form>
              {login.err && <p>{login.err}</p>}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default AuthContainer;
