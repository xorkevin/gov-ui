import {Fragment, useState, useMemo, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthResource, useLogin} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  FaIcon,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';
import Img from '@xorkevin/nuke/src/component/image/rounded';

import {GovUICtx} from '../../middleware';
import {getSearchParams} from '../../utility';

const selectAPIApp = (api) => api.oauth.app.id;
const selectAPIImage = (api) => api.oauth.app.id.image;
const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;

const CardHeader = () => {
  const ctx = useContext(GovUICtx);
  return (
    <Container padded>
      <h5>Sign in with {ctx.siteName}</h5>
    </Container>
  );
};

const CardLogo = ({app}) => {
  const imageURL = useURL(selectAPIImage, [app.client_id]);
  if (!app.logo) {
    return null;
  }
  return (
    <Img
      className="oauth-auth-app-logo"
      src={imageURL}
      preview={app.logo}
      ratio={1}
    />
  );
};

const CardLink = ({app}) => {
  return (
    <AnchorText ext href={app.url}>
      {app.name}
    </AnchorText>
  );
};

const ProfileImg = () => {
  const {userid} = useAuthValue();
  const imageURL = useURL(selectAPIProfileImage, [userid]);
  const [profile] = useAuthResource(selectAPIProfile, [], {
    image: '',
  });
  if (!profile.success || !profile.data.image) {
    return null;
  }
  return (
    <Img
      className="oauth-auth-profile-image"
      src={imageURL}
      preview={profile.data.image}
      ratio={1}
    />
  );
};

const Login = ({app, loginPosthook, usernameHint}) => {
  const form = useForm({
    username: usernameHint || '',
    password: '',
  });

  const [login, execLogin] = useLogin(form.state.username, form.state.password);
  if (login.success) {
    loginPosthook();
  }

  return (
    <Card
      center
      width="md"
      title={<CardHeader />}
      bar={
        <Fragment>
          <ButtonGroup>
            <ButtonTertiary>
              <FaIcon icon="ellipsis-v" />
            </ButtonTertiary>
            <ButtonPrimary onClick={execLogin}>Login</ButtonPrimary>
          </ButtonGroup>
        </Fragment>
      }
    >
      <Container padded>
        <CardLogo app={app} />
        <h3>
          Log in to continue to <CardLink app={app} />
        </h3>
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
        {login.err && <p>{login.err}</p>}
      </Container>
    </Card>
  );
};

const CheckConsent = ({app}) => {
  const ctx = useContext(GovUICtx);
  const {username} = useAuthValue();

  return (
    <Card
      center
      width="md"
      title={<CardHeader />}
      bar={
        <Fragment>
          <ButtonGroup>
            <ButtonTertiary>
              <FaIcon icon="ellipsis-v" />
            </ButtonTertiary>
            <ButtonTertiary>Cancel</ButtonTertiary>
            <ButtonPrimary>Allow</ButtonPrimary>
          </ButtonGroup>
        </Fragment>
      }
    >
      <Container padded>
        <CardLogo app={app} />
        <h3>
          <CardLink app={app} /> wants to access your {ctx.siteName} account
        </h3>
        <h5>
          <ProfileImg /> {username}
        </h5>
        <h5>
          This will allow <CardLink app={app} /> to:
        </h5>
        <ul>
          <li>permission one</li>
          <li>permission two</li>
        </ul>
      </Container>
    </Card>
  );
};

const ErrCard = ({children}) => {
  return (
    <Card center width="md" title={<CardHeader />}>
      <Container padded>{children}</Container>
    </Card>
  );
};

const AuthContainer = () => {
  const [performedRelogin, setRelogin] = useState(false);
  const reloginPosthook = useMemo(() => {
    if (performedRelogin) {
      return () => {};
    }
    return () => {
      setRelogin(true);
    };
  }, [performedRelogin, setRelogin]);
  const {loggedIn, username} = useAuthValue();

  const {search} = useLocation();
  const [clientid, params, _reqParams] = useMemo(() => {
    const query = getSearchParams(search);
    const clientid = query.get('client_id') || '';
    return [
      clientid,
      {
        redirectURI: query.get('redirect_uri'),
        state: query.get('state'),
        codeChallenge: query.get('code_challenge'),
        codeChallengeMethod: query.get('code_challenge_method'),
        display: query.get('display'),
        prompt: query.get('prompt'),
        maxage: query.get('max_age'),
        idtokenHint: query.get('id_token_hint'),
        loginHint: query.get('login_hint'),
      },
      {
        clientid,
        responseType: query.get('response_type'),
        responseMode: query.get('response_mode'),
        scope: query.get('scope'),
        nonce: query.get('nonce'),
      },
    ];
  }, [search]);

  const [app] = useResource(
    clientid.length > 0 ? selectAPIApp : selectAPINull,
    [clientid],
    {},
  );

  const redirectValid = params.redirectURI === app.data.redirect_uri;

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          {app.success &&
            (redirectValid ? (
              loggedIn ? (
                <CheckConsent app={app.data} />
              ) : (
                <Login
                  app={app.data}
                  loginPosthook={reloginPosthook}
                  usernameHint={params.loginHint || (loggedIn && username)}
                />
              )
            ) : (
              <ErrCard>
                <p>Invalid OAuth redirect url</p>
              </ErrCard>
            ))}
          {clientid.length === 0 && (
            <ErrCard>
              <p>Invalid OAuth client</p>
            </ErrCard>
          )}
          {app.err && (
            <ErrCard>
              <p>{app.err}</p>
            </ErrCard>
          )}
        </Container>
      </Section>
    </MainContent>
  );
};

export default AuthContainer;
