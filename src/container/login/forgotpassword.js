import React, {Fragment} from 'react';
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

const selectAPIForgotPass = (api) => api.u.user.pass.forgot;

const ForgotPassContainer = ({pathLogin, pathResetPass}) => {
  const form = useForm({
    username: '',
  });

  const [forgot, execForgot] = useAPICall(selectAPIForgotPass, [
    form.state.username,
  ]);

  return (
    <MainContent>
      <Section>
        <Container padded>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h3>Forgot password</h3>
              </Container>
            }
            bar={
              <ButtonGroup>
                {forgot.success ? (
                  <Link to={pathResetPass}>
                    <ButtonSecondary>Reset</ButtonSecondary>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={pathLogin}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Link>
                    <ButtonPrimary onClick={execForgot}>
                      Forgot Password
                    </ButtonPrimary>
                  </Fragment>
                )}
              </ButtonGroup>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={execForgot}
              >
                <Field name="username" label="Username / Email" fullWidth />
              </Form>
              {forgot.err && <span>{forgot.err}</span>}
              {forgot.success && (
                <span>
                  <span>
                    If the username or email is valid, an email with the code to
                    reset your password has been has been sent to the
                    corresponding email address.
                  </span>
                </span>
              )}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default ForgotPassContainer;
