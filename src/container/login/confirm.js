import React, {Fragment, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from '../../utility';
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

const selectAPIConfirmAccount = (api) => api.u.user.create.confirm;

const ConfirmAccount = () => {
  const ctx = useContext(AuthCtx);
  const {search} = useLocation();
  const form = useForm({
    email: decodeURIComponent(getSearchParams(search).get('email') || ''),
    key: decodeURIComponent(getSearchParams(search).get('key') || ''),
  });

  const [confirmAcct, execConfirm] = useAPICall(selectAPIConfirmAccount, [
    form.state.email,
    form.state.key,
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
                <h3>Confirm account</h3>
              </Container>
            }
            bar={
              <ButtonGroup>
                {confirmAcct.success ? (
                  <Link to={ctx.pathLogin}>
                    <ButtonSecondary>Finish</ButtonSecondary>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={ctx.pathLogin}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Link>
                    <ButtonPrimary onClick={execConfirm}>Confirm</ButtonPrimary>
                  </Fragment>
                )}
              </ButtonGroup>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onEnter={execConfirm}
              >
                <Field name="email" label="email" fullWidth />
                <Field name="key" label="code" fullWidth />
              </Form>
              {confirmAcct.err && <span>{confirmAcct.err}</span>}
              {confirmAcct.success && (
                <span>
                  <span>Your account has been created.</span>
                </span>
              )}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default ConfirmAccount;
