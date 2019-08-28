import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAPICall} from 'apiclient';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIResetPass = (api) => api.u.user.pass.forgot.confirm;

const ConfirmReset = ({match}) => {
  const [formState, updateForm] = useForm({
    key: match.params.key || '',
    new_password: '',
    password_confirm: '',
  });

  const prehook = useCallback(([form]) => {
    const {new_password, password_confirm} = form;
    if (new_password !== password_confirm) {
      return 'Passwords do not match';
    }
  }, []);

  const [resetState, execReset] = useAPICall(
    selectAPIResetPass,
    [formState.key, formState.new_password],
    {},
    {prehook},
  );

  const {success, err} = resetState;

  const bar = success ? (
    <Fragment>
      <Link to="/x/login">
        <Button outline>Sign in</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/x/login">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execReset}>
        Reset Password
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
        title={<h3>Reset password</h3>}
        bar={bar}
      >
        <Input
          label="code"
          name="key"
          value={formState.key}
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
          onEnter={execReset}
          fullWidth
        />
        {err && <span>{err}</span>}
        {success && (
          <span>
            <span>Your password has been reset</span>
          </span>
        )}
      </Card>
    </Section>
  );
};

export default ConfirmReset;
