import {Fragment, useState, useMemo, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthResource, useLogin} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
  FaIcon,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';
import Img from '@xorkevin/nuke/src/component/image/rounded';
import ImgCircle from '@xorkevin/nuke/src/component/image/circle';

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

const CardAccount = ({profile}) => {
  const {userid, username} = useAuthValue();
  const imageURL = useURL(selectAPIProfileImage, [userid]);
  return (
    <Grid justify="center" align="center">
      {profile.image && (
        <ImgCircle
          className="oauth-auth-profile-image"
          src={imageURL}
          preview={profile.image}
          ratio={1}
        />
      )}
      <h5 className="oauth-auth-account-name">{username}</h5>
    </Grid>
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
        <h3 className="text-center">
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

const CheckConsent = ({app, profile, scopes}) => {
  const ctx = useContext(GovUICtx);
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
        <h3 className="text-center">
          <CardLink app={app} /> wants to access your {ctx.siteName} account
        </h3>
        <CardAccount profile={profile} />
        <h5>
          This will allow <CardLink app={app} /> to:
        </h5>
        {scopes
          .filter((i) => ctx.openidAllScopeDesc[i])
          .map((i) => (
            <Grid key={i} align="center">
              <span className="oauth-auth-scope-indicator"></span>{' '}
              <span className="oauth-auth-scope-desc">
                {ctx.openidAllScopeDesc[i]}
              </span>
            </Grid>
          ))}
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

const AuthFlow = ({app, params, reqParams}) => {
  const ctx = useContext(GovUICtx);
  const {loggedIn, username} = useAuthValue();

  const [performedRelogin, setRelogin] = useState(false);
  const reloginPosthook = useMemo(() => {
    if (performedRelogin) {
      return () => {};
    }
    return () => {
      setRelogin(true);
    };
  }, [performedRelogin, setRelogin]);

  const [profile] = useAuthResource(
    loggedIn ? selectAPIProfile : selectAPINull,
    [],
    {
      image: '',
    },
  );

  const openidAllScopeSet = useMemo(() => new Set(ctx.openidAllScopes), [ctx]);

  const [scopes, scopeSet] = useMemo(() => {
    const scopes = reqParams.scope
      .split(' ')
      .filter((i) => openidAllScopeSet.has(i));
    return [scopes, new Set(scopes)];
  }, [reqParams, openidAllScopeSet]);

  if (!scopeSet.has('openid')) {
    console.log('missing openid scope');
  }

  if (!loggedIn) {
    return (
      <Login
        app={app}
        loginPosthook={reloginPosthook}
        usernameHint={params.loginHint || (loggedIn && username)}
      />
    );
  }

  return <CheckConsent app={app} profile={profile.data} scopes={scopes} />;
};

const AuthContainer = () => {
  const {search} = useLocation();
  const [clientid, params, reqParams] = useMemo(() => {
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
        scope: query.get('scope') || '',
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
              <AuthFlow app={app.data} params={params} reqParams={reqParams} />
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
