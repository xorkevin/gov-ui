import {Fragment, useState, useCallback, useMemo} from 'react';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {
  useLogin,
  useSwitchAccount,
  useProtectedRedir,
  useAccounts,
} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  useMenu,
  Menu,
  MenuItem,
  Card,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  FaIcon,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Img from '@xorkevin/nuke/src/component/image/circle';

const selectAPIUsers = (api) => api.u.user.ids;
const selectAPIProfiles = (api) => api.profile.ids;
const selectAPIProfileImage = (api) => api.profile.id.image;

const AddAccountContainer = ({
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
  const redirect = useProtectedRedir();

  const handleLogin = useCallback(async () => {
    const [_data, _status, err] = await execLogin();
    if (err) {
      return;
    }
    redirect();
  }, [execLogin, redirect]);

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
            <ButtonPrimary onClick={handleLogin}>Login</ButtonPrimary>
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
          onSubmit={handleLogin}
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

const AccountRow = ({
  userid,
  username,
  first_name,
  last_name,
  img,
  redirectSuccess,
  displayErrSnack,
}) => {
  const [_switchState, switchAccount] = useSwitchAccount(userid);

  const handleSwitchAccount = useCallback(async () => {
    const [_data, _status, err] = await switchAccount();
    if (err) {
      displayErrSnack(err);
      return;
    }
    redirectSuccess();
  }, [switchAccount, redirectSuccess, displayErrSnack]);

  const imageURL = useURL(selectAPIProfileImage, [userid]);
  return (
    <Grid
      className="signin-account-item"
      align="center"
      nowrap
      onClick={handleSwitchAccount}
    >
      <Column className="signin-account-image text-center" shrink="0">
        {img && <Img src={imageURL} preview={img} ratio={1} />}
        {!img && <FaIcon icon="user" />}
      </Column>
      <Column>
        <h4>
          {first_name} {last_name}
        </h4>
        <div>{username}</div>
      </Column>
    </Grid>
  );
};

const SwitchAccountContainer = ({accounts, displayLogin}) => {
  const [users] = useResource(
    accounts.length > 0 ? selectAPIUsers : selectAPINull,
    [accounts],
    [],
  );
  const userAccounts = useMemo(
    () =>
      users.data.sort((a, b) => {
        const au = a.username;
        const bu = b.username;
        if (au < bu) {
          return -1;
        }
        if (bu < au) {
          return 1;
        }
        return 0;
      }),
    [users],
  );

  const [profiles] = useResource(
    accounts.length > 0 ? selectAPIProfiles : selectAPINull,
    [accounts],
    [],
  );
  const userProfiles = useMemo(
    () => Object.fromEntries(profiles.data.map((i) => [i.userid, i])),
    [profiles],
  );

  const redirectSuccess = useProtectedRedir();

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

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
        {userAccounts.map((i) => (
          <AccountRow
            key={i.userid}
            userid={i.userid}
            username={i.username}
            first_name={i.first_name}
            last_name={i.last_name}
            img={userProfiles[i.userid] && userProfiles[i.userid].image}
            redirectSuccess={redirectSuccess}
            displayErrSnack={displayErrSnack}
          />
        ))}
        <Grid
          className="signin-account-item"
          align="center"
          onClick={displayLogin}
        >
          <Column className="signin-account-image text-center" shrink="0">
            <FaIcon icon="user-plus" />
          </Column>
          <Column>
            <strong>Add account</strong>
          </Column>
        </Grid>
      </Container>
    </Card>
  );
};

const SigninContainer = ({pathCreate, pathForgot}) => {
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
            <AddAccountContainer
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

export default SigninContainer;
