import React, {Fragment} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from '../../utility';
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

const selectAPIConfirmAccount = (api) => api.u.user.create.confirm;

const ConfirmAccount = ({pathLogin}) => {
  const {search} = useLocation();
  const form = useForm({
    userid: decodeURIComponent(getSearchParams(search).get('userid') || ''),
    key: decodeURIComponent(getSearchParams(search).get('key') || ''),
  });

  const [confirmAcct, execConfirm] = useAPICall(selectAPIConfirmAccount, [
    form.state.userid,
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
                  <Link to={pathLogin}>
                    <ButtonSecondary>Sign in</ButtonSecondary>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={pathLogin}>
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
                <Field name="userid" label="Userid" fullWidth />
                <Field name="key" label="Code" fullWidth />
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
