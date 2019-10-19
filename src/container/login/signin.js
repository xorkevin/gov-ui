import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useLoginCall} from '@xorkevin/turbine';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const SigninContainer = () => {
  const [formState, updateForm] = useForm({
    username: '',
    password: '',
  });

  const [loginState, execLogin] = useLoginCall(
    formState.username,
    formState.password,
  );

  const {err} = loginState;

  return (
    <Section container padded>
      <Card
        center
        size="md"
        restrictWidth
        titleBar
        title={<h3>Sign in</h3>}
        bar={
          <Fragment>
            <Menu
              icon={
                <Button text>
                  <FaIcon icon="ellipsis-v" />
                </Button>
              }
              size="md"
              align="left"
              position="bottom"
            >
              <Link to="/x/create">
                <FaIcon icon="user-plus" /> Create Account
              </Link>
              <Link to="/x/forgot">
                <FaIcon icon="unlock-alt" /> Forgot Password
              </Link>
            </Menu>
            <Button primary onClick={execLogin}>
              Login
            </Button>
          </Fragment>
        }
      >
        <Form formState={formState} onChange={updateForm} onEnter={execLogin}>
          <Input label="username / email" name="username" fullWidth />
          <Input label="password" type="password" name="password" fullWidth />
        </Form>
        {err && <span>{err}</span>}
      </Card>
    </Section>
  );
};

export default SigninContainer;
