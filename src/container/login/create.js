import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAPICall} from 'apiclient';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPICreateAccount = (api) => api.u.user.create;

const CreateAccount = () => {
  const [formState, updateForm] = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [formConfirmState, updateFormConfirm] = useForm({
    password_confirm: '',
    email_confirm: '',
  });

  const prehook = useCallback(
    ({password, email}) => {
      const {password_confirm, email_confirm} = formConfirmState;
      if (password !== password_confirm) {
        return 'Passwords do not match';
      }
      if (email !== email_confirm) {
        return 'Emails do not match';
      }
    },
    [formConfirmState],
  );

  const [createState, execCreate] = useAPICall(
    selectAPICreateAccount,
    [formState],
    {},
    {prehook},
  );

  const {loading, success, err} = createState;

  const bar = success ? (
    <Fragment>
      <Link to="/x/confirm">
        <Button outline>Confirm</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/x/login">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execCreate}>
        Create
      </Button>
    </Fragment>
  );

  return (
    <Section container padded>
      <Card
        center
        size="md"
        restrictWidth
        titleBar
        title={<h3>Sign up</h3>}
        bar={bar}
      >
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
        <Input
          label="username"
          name="username"
          value={formState.username}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="password"
          type="password"
          name="password"
          value={formState.password}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="confirm password"
          type="password"
          name="password_confirm"
          value={formConfirmState.password_confirm}
          onChange={updateFormConfirm}
          fullWidth
        />
        <Input
          label="email"
          name="email"
          value={formState.email}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="confirm email"
          name="email_confirm"
          value={formConfirmState.email_confirm}
          onChange={updateFormConfirm}
          onEnter={execCreate}
          fullWidth
        />
        {err && <span>{err}</span>}
        {success && (
          <span>
            <span>
              Confirm your account with a code emailed to the address you
              provided above
            </span>
          </span>
        )}
      </Card>
    </Section>
  );
};

export default CreateAccount;
