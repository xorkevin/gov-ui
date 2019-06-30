import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIEditEmail = (api) => api.u.user.email.edit;

const AccountEmailEdit = ({match}) => {
  const [formState, updateForm] = useForm({
    email: '',
    password: '',
  });

  const [emailState, execEditEmail] = useAuthCall(selectAPIEditEmail, [
    formState.email,
    formState.password,
  ]);

  const {loading, success, err} = emailState;

  const bar = success ? (
    <Fragment>
      <Link to={`${match.path}/confirm`}>
        <Button outline>Confirm</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/a/account">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execEditEmail}>
        Update
      </Button>
    </Fragment>
  );

  return (
    <Card size="md" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Account Details">
        <Input
          label="email"
          name="email"
          value={formState.email}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="password"
          type="password"
          name="password"
          value={formState.password}
          onChange={updateForm}
          onEnter={execEditEmail}
          fullWidth
        />
      </Section>
      {err && <span>{err}</span>}
      {success && (
        <span>
          Confirm your email change with a code emailed to the address provided
          above
        </span>
      )}
    </Card>
  );
};

export default AccountEmailEdit;
