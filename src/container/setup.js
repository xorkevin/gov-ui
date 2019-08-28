import React, {Fragment, useCallback} from 'react';
import {useAPICall} from 'apiclient';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

import {URL} from 'config';

const selectAPISetup = (api) => api.setupz;

const SetupContainer = ({history}) => {
  const navigateHome = useCallback(() => {
    history.push(URL.home);
  }, [history]);

  const [formState, updateForm] = useForm({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    orgname: '',
  });

  const [formConfirmState, updateFormConfirm] = useForm({
    password_confirm: '',
    email_confirm: '',
  });

  const prehook = useCallback(
    ([form]) => {
      const {password, email} = form;
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

  const [setupState, execSetup] = useAPICall(
    selectAPISetup,
    [formState],
    {orgname: ''},
    {prehook},
  );

  const {success, err, data} = setupState;

  return (
    <Section container padded>
      <Card
        center
        size="md"
        restrictWidth
        titleBar
        title={<h3>Setup</h3>}
        bar={
          <Fragment>
            <Button text onClick={navigateHome}>
              Cancel
            </Button>
            <Button primary onClick={execSetup}>
              Setup
            </Button>
          </Fragment>
        }
      >
        <Section subsection sectionTitle="Organization">
          <Input
            label="organization name"
            name="orgname"
            value={formState.orgname}
            onChange={updateForm}
            fullWidth
          />
        </Section>
        <Section subsection sectionTitle="Admin Account">
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
            onEnter={execSetup}
            fullWidth
          />
        </Section>
        {err && <span>{err}</span>}
        {success && (
          <span>
            <span>{data && data.orgname} has been created</span>
            <Button outline onClick={navigateHome}>
              Finish
            </Button>
          </span>
        )}
      </Card>
    </Section>
  );
};

export default SetupContainer;
