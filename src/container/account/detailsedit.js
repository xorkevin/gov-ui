import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Card,
  Button,
  Form,
  Input,
  useForm,
  useSnackbarView,
} from '@xorkevin/nuke';

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

  const [edit, execEditAccount] = useAuthCall(
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

  const [account] = useAuthResource(
    selectAPIAccount,
    [],
    {
      username: '',
      first_name: '',
      last_name: '',
    },
    {posthook},
  );

  const bar = edit.success ? (
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
      {account.success && (
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
          {edit.err && <span>{edit.err}</span>}
        </Card>
      )}
      {account.err && <span>{account.err}</span>}
    </Fragment>
  );
};

export default AccountDetailsEdit;
