import React, {Fragment} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from '../../utility';
import {useAuthCall} from '@xorkevin/turbine';
import {Grid, Column, Field, Form, useForm, ButtonGroup} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIConfirm = (api) => api.u.user.email.edit.confirm;

const AccountEmailConfirm = ({pathSecurity}) => {
  const {search} = useLocation();
  const form = useForm({
    key: decodeURIComponent(getSearchParams(search).get('key') || ''),
    password: '',
  });

  const [userid, key] = form.state.key.split('.', 2);

  const [confirmState, execConfirm] = useAuthCall(selectAPIConfirm, [
    userid,
    key,
    form.state.password,
  ]);

  return (
    <div>
      <h3>Confirm email</h3>
      <hr />
      <Grid>
        <Column md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execConfirm}
          >
            <Field name="key" label="Code" fullWidth />
            <Field name="password" type="password" label="Password" fullWidth />
          </Form>
          <ButtonGroup>
            {confirmState.success ? (
              <Link to={pathSecurity}>
                <ButtonSecondary>Back</ButtonSecondary>
              </Link>
            ) : (
              <Fragment>
                <Link to={pathSecurity}>
                  <ButtonTertiary>Cancel</ButtonTertiary>
                </Link>
                <ButtonPrimary onClick={execConfirm}>
                  Confirm Email
                </ButtonPrimary>
              </Fragment>
            )}
          </ButtonGroup>
          {confirmState.err && <p>{confirmState.err}</p>}
          {confirmState.success && <p>Email updated</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default AccountEmailConfirm;
