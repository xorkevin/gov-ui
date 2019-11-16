import React, {Fragment} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getSearchParams} from 'utility';
import {useAPICall} from '@xorkevin/substation';
import {Section, Card, Button, Form, Input, useForm} from '@xorkevin/nuke';

const selectAPIConfirmAccount = (api) => api.u.user.create.confirm;

const ConfirmAccount = () => {
  const {search} = useLocation();

  const [formState, updateForm] = useForm({
    email: getSearchParams(search).get('email') || '',
    key: getSearchParams(search).get('key') || '',
  });

  const [confirmState, execConfirm] = useAPICall(selectAPIConfirmAccount, [
    formState.email,
    formState.key,
  ]);

  const {success, err} = confirmState;

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
      <Button primary onClick={execConfirm}>
        Confirm
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
        title={<h3>Confirm account</h3>}
        bar={bar}
      >
        <Form formState={formState} onChange={updateForm} onEnter={execConfirm}>
          <Input label="email" name="email" fullWidth />
          <Input label="code" name="key" fullWidth />
        </Form>
        {err && <span>{err}</span>}
        {success && (
          <span>
            <span>Your account has been created</span>
          </span>
        )}
      </Card>
    </Section>
  );
};

export default ConfirmAccount;
