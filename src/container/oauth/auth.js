import {Fragment, useState, useMemo, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useResource, useURL, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useLogin} from '@xorkevin/turbine';
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

const CardHeader = () => {
  const ctx = useContext(GovUICtx);
  return (
    <Container padded>
      <h5>Sign in with {ctx.siteName}</h5>
    </Container>
  );
};

const Login = ({app, loginPosthook, usernameHint}) => {
  const form = useForm({
    username: usernameHint,
    password: '',
  });

  const [login, execLogin] = useLogin(form.state.username, form.state.password);

  if (login.success) {
    loginPosthook();
  }

  const imageURL = useURL(selectAPIImage, [app.client_id]);

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
        {app.logo && (
          <Img
            className="oauth-auth-app-logo"
            src={imageURL}
            preview={app.logo}
            ratio={1}
          />
        )}
        <h3>
          Log in to continue to{' '}
          <AnchorText ext href={app.url}>
            {app.name}
          </AnchorText>
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
  const {username} = useAuthValue();

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

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          {app.success && (
            <Login
              app={app.data}
              loginPosthook={reloginPosthook}
              usernameHint={params.loginHint || username}
            />
          )}
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
