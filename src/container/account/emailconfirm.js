import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIConfirmEmail = (api) => api.u.user.email.edit.confirm;

const AccountEmailConfirm = ({match}) => {
  const [formState, updateForm] = useForm({
    key: match.params.key || '',
    password: '',
  });

  const [confirmState, execConfirm] = useAuthCall(selectAPIConfirmEmail, [
    formState.key,
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
        <Input
          label="code"
          name="key"
          value={formState.key}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="password"
          type="password"
          name="password"
          value={formState.password}
          onChange={updateForm}
          onEnter={execConfirm}
          fullWidth
        />
      </Section>
      {err && <span>{err}</span>}
      {success && <span>Email updated</span>}
    </Card>
  );
};

export default AccountEmailConfirm;
