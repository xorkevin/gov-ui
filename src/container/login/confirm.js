import {Fragment} from 'react';
import {useLocation} from 'react-router-dom';
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
  Anchor,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIConfirmAccount = (api) => api.u.user.create.confirm;

const ConfirmAccount = ({pathLogin}) => {
  const {search} = useLocation();
  const form = useForm({
    userid: getSearchParams(search).get('userid') || '',
    key: getSearchParams(search).get('key') || '',
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
                  <Anchor local href={pathLogin}>
                    <ButtonSecondary>Sign in</ButtonSecondary>
                  </Anchor>
                ) : (
                  <Fragment>
                    <Anchor local href={pathLogin}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Anchor>
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
                <Field
                  name="key"
                  label="Code"
                  fullWidth
                  autoComplete="one-time-code"
                />
              </Form>
              {confirmAcct.err && <p>{confirmAcct.err.message}</p>}
              {confirmAcct.success && <p>Your account has been created.</p>}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default ConfirmAccount;
