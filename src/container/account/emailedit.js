import React from 'react';
import {Link} from 'react-router-dom';
import {emailRegex} from '../../utility';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Container,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIEdit = (api) => api.u.user.email.edit;

const formErrCheck = ({email}) => {
  const err = {};
  if (email.length > 0 && !emailRegex.test(email)) {
    err.email = true;
  }
  return err;
};

const formValidCheck = ({email}) => {
  const valid = {};
  if (emailRegex.test(email)) {
    valid.email = true;
  }
  return valid;
};

const AccountEmailEdit = ({pathAccount, pathConfirm}) => {
  const form = useForm({
    email: '',
    password: '',
  });

  const [edit, execEdit] = useAuthCall(selectAPIEdit, [
    form.state.email,
    form.state.password,
  ]);

  return (
    <Card
      center
      width="md"
      title={
        <Container padded>
          <h3>Change Account Email</h3>
        </Container>
      }
      bar={
        edit.success ? (
          <ButtonGroup>
            <Link to={pathConfirm}>
              <ButtonSecondary>Confirm</ButtonSecondary>
            </Link>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Link to={pathAccount}>
              <ButtonTertiary>Cancel</ButtonTertiary>
            </Link>
            <ButtonPrimary onClick={execEdit}>Update</ButtonPrimary>
          </ButtonGroup>
        )
      }
    >
      <Container padded>
        <Form
          formState={form.state}
          onChange={form.update}
          onSubmit={execEdit}
          errCheck={formErrCheck}
          validCheck={formValidCheck}
        >
          <Field name="email" label="email" fullWidth />
          <Field name="password" type="password" label="password" fullWidth />
        </Form>
        {edit.err && <span>{edit.err}</span>}
        {edit.success && (
          <span>
            Confirm your email change with the code emailed to the address
            provided above.
          </span>
        )}
      </Container>
    </Card>
  );
};

export default AccountEmailEdit;
