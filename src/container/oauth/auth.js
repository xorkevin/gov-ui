import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
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

const OID_ERR_INVALID_REQ = 'invalid_request';
const OID_ERR_UNSUPPORTED_RESTYPE = 'unsupported_response_type';

const OID_RESTYPE_CODE = 'code';

const OID_RESMODE_QUERY = 'query';
const OID_RESMODE_FRAGMENT = 'fragment';

const OID_RESMODE_SET = new Set([OID_RESMODE_QUERY, OID_RESMODE_FRAGMENT]);

const OID_PROMPT_NONE = 'none';
const OID_PROMPT_LOGIN = 'login';
const OID_PROMPT_CONSENT = 'consent';
const OID_PROMPT_SELECT = 'select_account';

const intRegex = /^\d+$/;

const AuthFlow = ({app, params, reqParams}) => {
  const ctx = useContext(GovUICtx);
  const {loggedIn, username, timeAuth} = useAuthValue();

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

  const maxAgeValid = intRegex.test(params.maxage);
  const maxAge = maxAgeValid ? parseInt(params.maxage, 10) : -1;

  const openidAllScopeSet = useMemo(() => new Set(ctx.openidAllScopes), [ctx]);
  const scopes = useMemo(
    () => reqParams.scope.split(' ').filter((i) => openidAllScopeSet.has(i)),
    [reqParams, openidAllScopeSet],
  );
  const prompts = useMemo(() => new Set(params.prompt.split(' ')), [params]);

  const showNone = prompts.has(OID_PROMPT_NONE);
  if (showNone) {
    return null;
  }
  const showLogin =
    !loggedIn ||
    (params.loginHint !== '' && params.loginHint !== username) ||
    prompts.has(OID_PROMPT_LOGIN) ||
    (maxAgeValid && Date.now() / 1000 - timeAuth > maxAge);
  if (showLogin) {
    return (
      <Login
        app={app}
        loginPosthook={reloginPosthook}
        usernameHint={
          params.loginHint !== '' ? params.loginHint : loggedIn && username
        }
      />
    );
  }
  const showConsent = prompts.has(OID_PROMPT_CONSENT);
  if (showConsent) {
    return <CheckConsent app={app} profile={profile.data} scopes={scopes} />;
  }
  const _showSelect = prompts.has(OID_PROMPT_SELECT);
  return <CheckConsent app={app} profile={profile.data} scopes={scopes} />;
};

const ErrCard = ({children}) => {
  return (
    <Card center width="md" title={<CardHeader />}>
      <Container padded>{children}</Container>
    </Card>
  );
};

const AuthContainer = () => {
  const {search} = useLocation();
  const [
    clientid,
    redirectURI,
    responseType,
    responseMode,
    state,
    params,
    reqParams,
  ] = useMemo(() => {
    const query = getSearchParams(search);
    const clientid = query.get('client_id') || '';
    return [
      clientid,
      query.get('redirect_uri'),
      query.get('response_type'),
      query.get('response_mode') || OID_RESMODE_QUERY,
      query.get('state'),
      {
        codeChallenge: query.get('code_challenge'),
        codeChallengeMethod: query.get('code_challenge_method'),
        display: query.get('display'),
        prompt: query.get('prompt') || '',
        maxage: query.get('max_age') || '',
        idtokenHint: query.get('id_token_hint'),
        loginHint: query.get('login_hint') || '',
      },
      {
        client_id: clientid,
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

  const redirectValid = redirectURI === app.data.redirect_uri;
  const responseTypeValid = responseType === OID_RESTYPE_CODE;
  const responseModeValid = OID_RESMODE_SET.has(responseMode);

  const redirErr = useCallback(
    (errcode, msg) => {
      if (!redirectURI) {
        return;
      }
      const modeFrag =
        responseModeValid && responseMode === OID_RESMODE_FRAGMENT;
      try {
        const url = new URL(redirectURI);
        const q = modeFrag ? new URLSearchParams() : url.searchParams;
        q.set('error', errcode);
        if (msg) {
          q.set('error_description', msg);
        }
        if (state) {
          q.Add('state', state);
        }
        if (modeFrag) {
          url.hash = '#' + q.toString();
        }
        window.location.replace(url.toString());
      } catch (_e) {}
    },
    [redirectURI, responseMode, responseModeValid, state],
  );

  if (redirectValid) {
    if (!responseTypeValid) {
      redirErr(OID_ERR_UNSUPPORTED_RESTYPE, 'Invalid response type');
    }
    if (!responseModeValid) {
      redirErr(OID_ERR_INVALID_REQ, 'Invalid response mode');
    }
  }

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          {app.success &&
            (redirectValid ? (
              <AuthFlow
                redirErr={redirErr}
                app={app.data}
                params={params}
                reqParams={reqParams}
              />
            ) : (
              <ErrCard>
                <CardLogo app={app.data} />
                <h3 className="text-center">
                  Error logging in to <CardLink app={app.data} />
                </h3>
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
