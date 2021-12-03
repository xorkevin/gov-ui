import {Fragment} from 'react';
import {useLocation} from 'react-router-dom';
import {getSearchParams} from '../../utility';
import {useAuthCall, useRefreshUser} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  Form,
  useForm,
  Anchor,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIConfirm = (api) => api.u.user.email.edit.confirm;

const AccountEmailConfirm = ({pathSecurity}) => {
  const [_user, refreshUser] = useRefreshUser();

  const {search} = useLocation();
  const form = useForm({
    key: getSearchParams(search).get('key') || '',
    password: '',
  });

  const [userid, key] = form.state.key.split('.', 2);

  const [confirmState, execConfirm] = useAuthCall(
    selectAPIConfirm,
    [userid, key, form.state.password],
    {},
    {posthook: refreshUser},
  );

  return (
    <div>
      <h3>Confirm email</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execConfirm}
          >
            <Field
              name="key"
              label="Code"
              fullWidth
              autoComplete="one-time-code"
            />
            <Field
              name="password"
              type="password"
              label="Password"
              fullWidth
              autoComplete="current-password"
              autoFocus
            />
          </Form>
          <ButtonGroup>
            {confirmState.success ? (
              <Anchor local href={pathSecurity}>
                <ButtonSecondary>Back</ButtonSecondary>
              </Anchor>
            ) : (
              <Fragment>
                <Anchor local href={pathSecurity}>
                  <ButtonTertiary>Cancel</ButtonTertiary>
                </Anchor>
                <ButtonPrimary onClick={execConfirm}>
                  Confirm Email
                </ButtonPrimary>
              </Fragment>
            )}
          </ButtonGroup>
          {confirmState.err && <p>{confirmState.err.message}</p>}
          {confirmState.success && <p>Email updated</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default AccountEmailConfirm;
