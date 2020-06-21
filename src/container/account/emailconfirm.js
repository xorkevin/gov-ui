import React, {Fragment} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from '../../../utility';
import {useAuthCall} from '@xorkevin/turbine';
import {Section, Card, Button, Form, Input, useForm} from '@xorkevin/nuke';

const selectAPIConfirmEmail = (api) => api.u.user.email.edit.confirm;

const AccountEmailConfirm = () => {
  const {search} = useLocation();

  const [formState, updateForm] = useForm({
    key: getSearchParams(search).get('key') || '',
    password: '',
  });

  const [userid, key] = formState.key.split('.', 2);

  const [confirmState, execConfirm] = useAuthCall(selectAPIConfirmEmail, [
    userid,
    key,
    formState.password,
  ]);

  const {success, err} = confirmState;

  const bar = success ? (
    <Fragment>
      <Link to="/a/account">
        <Button primary>Back</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/a/account">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execConfirm}>
        Update
      </Button>
    </Fragment>
  );

  return (
    <Card size="md" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Account Details">
        <Form formState={formState} onChange={updateForm} onEnter={execConfirm}>
          <Input label="code" name="key" fullWidth />
          <Input label="password" type="password" name="password" fullWidth />
        </Form>
      </Section>
      {err && <span>{err}</span>}
      {success && <span>Email updated</span>}
    </Card>
  );
};

export default AccountEmailConfirm;
