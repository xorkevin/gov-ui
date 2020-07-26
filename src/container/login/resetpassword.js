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

const selectAPIResetPass = (api) => api.u.user.pass.forgot.confirm;

const formErrCheck = ({new_password, password_confirm}) => {
  const err = {};
  if (new_password.length > 0 && new_password.length < 10) {
    err.new_password = true;
  }
  if (password_confirm.length > 0 && password_confirm !== new_password) {
    err.password_confirm = 'Must match password';
  }
  return err;
};

const formValidCheck = ({new_password, password_confirm}) => {
  const valid = {};
  if (new_password.length > 9) {
    valid.new_password = true;
  }
  if (password_confirm.length > 0 && password_confirm === new_password) {
    valid.password_confirm = true;
  }
  return valid;
};

const prehookValidate = ([_userid, _key, new_password, password_confirm]) => {
  if (new_password !== password_confirm) {
    return 'Passwords do not match';
  }
};

const ResetPass = ({pathLogin}) => {
  const {search} = useLocation();
  const form = useForm({
    key: decodeURIComponent(getSearchParams(search).get('key') || ''),
    new_password: '',
    password_confirm: '',
  });

  const [userid, key] = form.state.key.split('.', 2);

  const [reset, execReset] = useAPICall(
    selectAPIResetPass,
    [userid, key, form.state.new_password, form.state.password_confirm],
    {},
    {prehook: prehookValidate},
  );

  return (
    <MainContent>
      <Section>
        <Container>
          <Card
            center
            width="md"
            title={
              <Container padded>
                <h3>Reset password</h3>
              </Container>
            }
            bar={
              <ButtonGroup>
                {reset.success ? (
                  <Link to={pathLogin}>
                    <ButtonSecondary>Sign in</ButtonSecondary>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={pathLogin}>
                      <ButtonTertiary>Cancel</ButtonTertiary>
                    </Link>
                    <ButtonPrimary onClick={execReset}>
                      Reset Password
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
                onSubmit={execReset}
                errCheck={formErrCheck}
                validCheck={formValidCheck}
              >
                <Field name="key" label="code" fullWidth />
                <Field
                  name="new_password"
                  type="password"
                  label="new password"
                  hint="Must be at least 10 characters"
                  hintRight={`${form.state.new_password.length} chars`}
                  fullWidth
                />
                <Field
                  name="password_confirm"
                  type="password"
                  label="confirm password"
                  fullWidth
                />
              </Form>
              {reset.err && <span>{reset.err}</span>}
              {reset.success && <span>Password updated.</span>}
            </Container>
          </Card>
        </Container>
      </Section>
    </MainContent>
  );
};

export default ResetPass;
