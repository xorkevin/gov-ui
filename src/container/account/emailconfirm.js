import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from '../../utility';
import {useAuthCall} from '@xorkevin/turbine';
import {
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

const selectAPIConfirm = (api) => api.u.user.email.edit.confirm;

const AccountEmailConfirm = ({pathAccount}) => {
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
    <Card
      center
      width="md"
      title={
        <Container padded>
          <h3>Confirm Email</h3>
        </Container>
      }
      bar={
        confirmState.success ? (
          <ButtonGroup>
            <Link to={pathAccount}>
              <ButtonSecondary>Back</ButtonSecondary>
            </Link>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Link to={pathAccount}>
              <ButtonTertiary>Cancel</ButtonTertiary>
            </Link>
            <ButtonPrimary onClick={execConfirm}>Update</ButtonPrimary>
          </ButtonGroup>
        )
      }
    >
      <Container padded>
        <Form
          formState={form.state}
          onChange={form.update}
          onSubmit={execConfirm}
        >
          <Field name="key" label="code" fullWidth />
          <Field name="password" type="password" label="password" fullWidth />
        </Form>
        {confirmState.err && <span>{confirmState.err}</span>}
        {confirmState.success && <span>Email updated</span>}
      </Container>
    </Card>
  );
};

export default AccountEmailConfirm;
