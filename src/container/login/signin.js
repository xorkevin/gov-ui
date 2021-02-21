import {Fragment, useState, useCallback} from 'react';
import {useLogin, useAccounts} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  useMenu,
  Menu,
  MenuItem,
  FaIcon,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const SigninContainer = ({
  hasAccounts,
  displayAccounts,
  pathCreate,
  pathForgot,
}) => {
  const menu = useMenu();

  const form = useForm({
    username: '',
    password: '',
  });

  const [login, execLogin] = useLogin(form.state.username, form.state.password);

  return (
    <Card
      center
      width="md"
      title={
        <Container padded>
          <h3>Sign in</h3>
        </Container>
      }
      bar={
        <Fragment>
          <ButtonGroup>
            <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
              <FaIcon icon="ellipsis-v" />
            </ButtonTertiary>
            {hasAccounts && (
              <ButtonSecondary onClick={displayAccounts}>
                Choose account
              </ButtonSecondary>
            )}
            <ButtonPrimary onClick={execLogin}>Login</ButtonPrimary>
          </ButtonGroup>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem
                local
                link={pathCreate}
                icon={<FaIcon icon="user-plus" />}
              >
                Create Account
              </MenuItem>
              <MenuItem
                local
                link={pathForgot}
                icon={<FaIcon icon="unlock-alt" />}
              >
                Forgot Password
              </MenuItem>
            </Menu>
          )}
        </Fragment>
      }
    >
      <Container padded>
        <Form
          formState={form.state}
          onChange={form.update}
          onSubmit={execLogin}
        >
          <Field
            name="username"
            label="Username / Email"
            fullWidth
            autoComplete="username"
            autoFocus
          />
          <Field
            name="password"
            type="password"
            label="Password"
            fullWidth
            autoComplete="current-password"
          />
        </Form>
        {login.err && <p>{login.err.message}</p>}
      </Container>
    </Card>
  );
};

const SwitchAccountContainer = ({accounts, displayLogin}) => {
  return (
    <Card
      center
      width="md"
      title={
        <Container padded>
          <h3>Choose account</h3>
        </Container>
      }
    >
      <Container padded>
        {accounts.map((i) => (
          <div key={i}>{i}</div>
        ))}
        <ButtonSecondary onClick={displayLogin}>Add account</ButtonSecondary>
      </Container>
    </Card>
  );
};

const LoginContainer = ({pathCreate, pathForgot}) => {
  const accounts = useAccounts();
  const hasAccounts = accounts.length > 0;
  const [showAccounts, setShowAccounts] = useState(true);
  const displayLogin = useCallback(() => {
    setShowAccounts(false);
  }, [setShowAccounts]);
  const displayAccounts = useCallback(() => {
    setShowAccounts(true);
  }, [setShowAccounts]);
  const viewAccounts = hasAccounts && showAccounts;

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          {viewAccounts ? (
            <SwitchAccountContainer
              accounts={accounts}
              displayLogin={displayLogin}
            />
          ) : (
            <SigninContainer
              hasAccounts={hasAccounts}
              displayAccounts={displayAccounts}
              pathCreate={pathCreate}
              pathForgot={pathForgot}
            />
          )}
        </Container>
      </Section>
    </MainContent>
  );
};

export default LoginContainer;
