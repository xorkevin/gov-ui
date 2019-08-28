import React, {Fragment, useCallback} from 'react';
import {useSnackbarView} from 'service/snackbar';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIEditAccount = (api) => api.u.user.edit;
const selectAPIAccount = (api) => api.u.user.get;

const AccountDetailsEdit = () => {
  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>Changes saved</span>
    </Fragment>,
  );

  const [formState, updateForm] = useForm({
    username: '',
    first_name: '',
    last_name: '',
  });

  const [accountState, execEditAccount] = useAuthCall(
    selectAPIEditAccount,
    [formState],
    {},
    {posthook: displaySnackbar},
  );

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
            <Form
              formState={formState}
              onChange={updateForm}
              onEnter={execEditAccount}
            >
              <Input label="username" name="username" fullWidth />
              <Input label="first name" name="first_name" fullWidth />
              <Input label="last name" name="last_name" fullWidth />
            </Form>
          </Section>
          {err && <span>{err}</span>}
        </Card>
      )}
      {errGetAccount && <span>{errGetAccount}</span>}
    </Fragment>
  );
};

export default AccountDetailsEdit;
