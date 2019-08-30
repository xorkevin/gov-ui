import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useAPICall} from 'apiclient';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIForgotPass = (api) => api.u.user.pass.forgot;

const ForgotPassContainer = () => {
  const [formState, updateForm] = useForm({
    username: '',
  });

  const [forgotState, execForgot] = useAPICall(selectAPIForgotPass, [
    formState.username,
  ]);

  const {success, err} = forgotState;

  const bar = success ? (
    <Fragment>
      <Link to="/x/forgotconfirm">
        <Button outline>Confirm</Button>
      </Link>
    </Fragment>
  ) : (
    <Fragment>
      <Link to="/x/login">
        <Button text>Cancel</Button>
      </Link>
      <Button primary onClick={execForgot}>
        Forgot Password
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
        title={<h3>Forgot password</h3>}
        bar={bar}
      >
        <Form formState={formState} onChange={updateForm} onEnter={execForgot}>
          <Input label="username / email" name="username" fullWidth />
        </Form>
        {err && <span>{err}</span>}
        {success && (
          <span>
            <span>Reset your password with the code emailed to you</span>
          </span>
        )}
      </Card>
    </Section>
  );
};

export default ForgotPassContainer;
