import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Card,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIEdit = (api) => api.u.user.edit;
const selectAPIAccount = (api) => api.u.user.get;

const AccountDetailsEdit = ({pathAccount}) => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>&#x2713; Changes saved</SnackbarSurface>,
  );

  const form = useForm({
    username: '',
    first_name: '',
    last_name: '',
  });

  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [form.state],
    {},
    {posthook: displaySnackbar},
  );

  const formAssign = form.assign;
  const posthook = useCallback(
    (_status, {username, first_name, last_name}) => {
      formAssign({
        username,
        first_name,
        last_name,
      });
    },
    [formAssign],
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

  return (
    <div>
      {account.success && (
        <Card
          center
          width="md"
          title={
            <Container padded>
              <h3>Account Details</h3>
            </Container>
          }
          bar={
            <ButtonGroup>
              <Link to={pathAccount}>
                <ButtonTertiary>
                  {edit.success ? 'Back' : 'Cancel'}
                </ButtonTertiary>
              </Link>
              <ButtonPrimary onClick={execEdit}>Save</ButtonPrimary>
            </ButtonGroup>
          }
        >
          <Container padded>
            <Form
              formState={form.state}
              onChange={form.update}
              onSubmit={execEdit}
            >
              <Field name="username" label="username" fullWidth />
              <Field name="first_name" label="first name" fullWidth />
              <Field name="last_name" label="last name" fullWidth />
            </Form>
            {edit.err && <span>{edit.err}</span>}
          </Container>
        </Card>
      )}
      {account.err && <span>{account.err}</span>}
    </div>
  );
};

export default AccountDetailsEdit;
