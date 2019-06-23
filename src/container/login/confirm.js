import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAPICall} from 'apiclient';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIConfirmAccount = (api) => api.u.user.create.confirm;

const ConfirmAccount = ({match}) => {
  const [formState, updateForm] = useForm({
    key: match.params.key || '',
  });

  const [confirmState, execConfirm] = useAPICall(selectAPIConfirmAccount, [
    formState.key,
  ]);

  const {loading, success, err} = confirmState;

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
        <Input
          label="code"
          name="key"
          value={formState.key}
          onChange={updateForm}
          fullWidth
        />
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
