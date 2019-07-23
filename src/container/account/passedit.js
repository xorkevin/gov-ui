import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIEditPass = (api) => api.u.user.pass.edit;

const AccountPassEdit = () => {
  const [formState, updateForm] = useForm({
    old_password: '',
    new_password: '',
    password_confirm: '',
  });

  const prehook = useCallback(({new_password, password_confirm}) => {
    if (new_password !== password_confirm) {
      return 'Passwords do not match';
    }
  }, []);

  const [passState, execEditPass] = useAuthCall(
    selectAPIEditPass,
    [formState.old_password, formState.new_password],
    {},
    {prehook},
  );

  const {loading, success, err} = passState;

  const bar = success ? (
    <Fragment>
      <Link to="/a/account">
        <Button text>Back</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/a/account">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execEditPass}>
        Update
      </Button>
    </Fragment>
  );

  return (
    <Card size="md" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Account Details">
        <Input
          label="old password"
          type="password"
          name="old_password"
          value={formState.old_password}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="new password"
          type="password"
          name="new_password"
          value={formState.new_password}
          onChange={updateForm}
          fullWidth
        />
        <Input
          label="confirm password"
          type="password"
          name="password_confirm"
          value={formState.password_confirm}
          onChange={updateForm}
          onEnter={execEditPass}
          fullWidth
        />
      </Section>
      {err && <span>{err}</span>}
      {success && <span>Password updated</span>}
    </Card>
  );
};

export default AccountPassEdit;
