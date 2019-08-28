import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIEditAccount = (api) => api.u.user.edit;
const selectAPIAccount = (api) => api.u.user.get;

const AccountDetailsEdit = () => {
  const [formState, updateForm] = useForm({
    username: '',
    first_name: '',
    last_name: '',
  });

  const [accountState, execEditAccount] = useAuthCall(selectAPIEditAccount, [
    formState,
  ]);

  const posthook = useCallback(
    (_status, {username, first_name, last_name}) => {
      updateForm('username', username);
      updateForm('first_name', first_name);
      updateForm('last_name', last_name);
    },
    [updateForm],
  );

  const {success: successGetAccount, err: errGetAccount} = useAuthResource(
    selectAPIAccount,
    [],
    {
      username: '',
      first_name: '',
      last_name: '',
    },
    {posthook},
  );

  const {success, err} = accountState;

  const bar = success ? (
    <Fragment>
      <Link to="/a/account">
        <Button text>Back</Button>
      </Link>
      <Button primary onClick={execEditAccount}>
        Save
      </Button>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/a/account">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execEditAccount}>
        Save
      </Button>
    </Fragment>
  );

  return (
    <Fragment>
      {successGetAccount && (
        <Card size="md" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Account Details">
            <Input
              label="username"
              name="username"
              value={formState.username}
              onChange={updateForm}
              fullWidth
            />
            <Input
              label="first name"
              name="first_name"
              value={formState.first_name}
              onChange={updateForm}
              fullWidth
            />
            <Input
              label="last name"
              name="last_name"
              value={formState.last_name}
              onChange={updateForm}
              fullWidth
            />
          </Section>
          {err && <span>{err}</span>}
          {success && <span>Changes saved</span>}
        </Card>
      )}
      {errGetAccount && <span>{errGetAccount}</span>}
    </Fragment>
  );
};

export default AccountDetailsEdit;
