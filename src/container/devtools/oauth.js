import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import {useResource} from '@xorkevin/substation';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  FieldSelect,
  FieldSearchSelect,
  FieldMultiSelect,
  Form,
  useForm,
  Description,
  ButtonGroup,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {getSearchParams, randomID} from '../../utility';

const selectAPIOidConfig = (api) => api.wellknown.openidconfig;
const selectAPIApps = (api) => api.oauth.app.get;

const NONCE_LENGTH = 43;
const OAUTHAPP_LIMIT = 32;

const responseTypeOpts = [{display: 'code', value: 'code'}];
const responseModeOpts = [
  {display: 'default', value: ''},
  {display: 'query', value: 'query'},
  {display: 'fragment', value: 'fragment'},
];
const promptOpts = [
  {display: 'default', value: ''},
  {display: 'none', value: 'none'},
  {display: 'login', value: 'login'},
  {display: 'consent', value: 'consent'},
  {display: 'select_account', value: 'select_account'},
];
const challengeMethodOpts = [
  {display: 'none', value: ''},
  {display: 'plain', value: 'plain'},
  {display: 'SHA-256', value: 'S256'},
];

const secondsMinute = 60;

const unixTime = () => Date.now() / 1000;

const storageOAuthReqKey = () => `govui:devtools:oauthreq`;

const storeOAuthReq = (key, req) => {
  localStorage.setItem(key, JSON.stringify(req));
};

const retrieveOAuthReq = (key) => {
  const k = localStorage.getItem(key);
  try {
    return JSON.parse(k);
  } catch (_e) {
    return null;
  }
};

const ChipList = ({list}) => {
  if (!Array.isArray(list)) {
    return null;
  }
  return (
    <Fragment>
      {list.map((i) => (
        <Chip key={i}>{i}</Chip>
      ))}
    </Fragment>
  );
};

const OAuthTool = ({pathCallback}) => {
  const ctx = useContext(GovUICtx);

  const randomState = useMemo(() => randomID(NONCE_LENGTH), []);
  const randomNonce = useMemo(() => randomID(NONCE_LENGTH), []);
  const randomChallenge = useMemo(() => randomID(NONCE_LENGTH), []);
  const form = useForm({
    authendpoint: '',
    clientid: '',
    redirecturi: ctx.siteURL + pathCallback,
    responsetype: 'code',
    responsemode: '',
    scope: ctx.openidAllScopes,
    prompt: '',
    maxage: '',
    loginhint: '',
    state: randomState,
    nonce: randomNonce,
    challengemethod: 'S256',
    challenge: randomChallenge,
  });

  const scopeOpts = useMemo(
    () => ctx.openidAllScopes.map((i) => ({display: i, value: i})),
    [ctx],
  );

  const formAssign = form.assign;
  const posthookConfig = useCallback(
    (_status, config) => {
      formAssign({
        authendpoint: config.authorization_endpoint,
      });
    },
    [formAssign],
  );
  const [oidConfig] = useResource(
    selectAPIOidConfig,
    [],
    {},
    {posthook: posthookConfig},
  );

  const [apps] = useAuthResource(selectAPIApps, [OAUTHAPP_LIMIT, 0], []);

  const clientOpts = useMemo(
    () =>
      apps.success
        ? apps.data.map((i) => ({display: i.name, value: i.client_id}))
        : [],
    [apps],
  );

  const formChallengeMethod = form.state.challengemethod;
  const formChallenge = form.state.challenge;
  const [codeChallengeValue, setCodeChallengeValue] = useState(formChallenge);
  useEffect(() => {
    const cancelRef = {current: false};
    switch (formChallengeMethod) {
      case 'plain':
        setCodeChallengeValue(formChallenge);
        break;
      case 'S256':
        (async () => {
          const data = new TextEncoder().encode(formChallenge);
          const hash = await crypto.subtle.digest('SHA-256', data);
          if (cancelRef.current) {
            return;
          }
          const hashstr = btoa(
            new Uint8Array(hash).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          )
            .replaceAll('=', '')
            .replaceAll('+', '-')
            .replaceAll('/', '_');
          setCodeChallengeValue(hashstr);
        })();
        break;
      default:
        setCodeChallengeValue('');
    }
    return () => {
      cancelRef.current = true;
    };
  }, [formChallengeMethod, formChallenge]);
  const formState = form.state;
  const linkDest = useMemo(() => {
    const {
      authendpoint,
      clientid,
      redirecturi,
      responsetype,
      responsemode,
      scope,
      prompt,
      maxage,
      loginhint,
      state,
      nonce,
      challengemethod,
    } = formState;
    if (authendpoint.length === 0) {
      return '#';
    }
    try {
      const url = new URL(authendpoint);
      const q = url.searchParams;
      if (clientid.length > 0) {
        q.set('client_id', clientid);
      }
      if (redirecturi.length > 0) {
        q.set('redirect_uri', redirecturi);
      }
      if (responsetype.length > 0) {
        q.set('response_type', responsetype);
      }
      if (responsemode.length > 0) {
        q.set('response_mode', responsemode);
      }
      if (state.length > 0) {
        q.set('state', state);
      }
      if (nonce.length > 0) {
        q.set('nonce', nonce);
      }
      if (challengemethod.length > 0 && codeChallengeValue.length > 0) {
        q.set('code_challenge_method', challengemethod);
        q.set('code_challenge', codeChallengeValue);
      }
      if (scope.length > 0) {
        q.set('scope', scope.join(' '));
      }
      if (prompt.length > 0) {
        q.set('prompt', prompt);
      }
      if (maxage.length > 0) {
        q.set('max_age', maxage);
      }
      if (loginhint.length > 0) {
        q.set('login_hint', loginhint);
      }
      return url.toString();
    } catch (_e) {
      return '#';
    }
  }, [formState, codeChallengeValue]);

  const makeOAuthReq = useCallback(() => {
    const req = {
      time: unixTime(),
      clientid: formState.clientid,
      state: formState.state,
      nonce: formState.nonce,
      challengemethod: formState.challengemethod,
      challenge: formState.challenge,
    };
    storeOAuthReq(storageOAuthReqKey(), req);
    window.location.replace(linkDest);
  }, [formState, linkDest]);

  return (
    <div>
      <h3>OAuth Tool</h3>
      <Grid>
        <Column md={12}>
          <Form formState={form.state} onChange={form.update}>
            <Grid>
              <Column md={12}>
                <FieldSearchSelect
                  name="clientid"
                  label="Client"
                  options={clientOpts}
                  nohint
                  fullWidth
                />
                <Field name="clientid" label="Client ID" nohint fullWidth />
                <Field
                  name="redirecturi"
                  label="Redirect URI"
                  nohint
                  fullWidth
                />
                <FieldSelect
                  name="responsetype"
                  label="Response Type"
                  options={responseTypeOpts}
                  nohint
                  fullWidth
                />
                <FieldSelect
                  name="responsemode"
                  label="Response Mode"
                  options={responseModeOpts}
                  nohint
                  fullWidth
                />
                <FieldMultiSelect
                  name="scope"
                  label="Scope"
                  options={scopeOpts}
                  nohint
                  fullWidth
                />
                <FieldSelect
                  name="prompt"
                  label="Prompt"
                  options={promptOpts}
                  nohint
                  fullWidth
                />
                <Field name="maxage" label="Max Age" nohint fullWidth />
                <Field name="loginhint" label="Login Hint" nohint fullWidth />
              </Column>
              <Column md={12}>
                <Field
                  name="authendpoint"
                  label="Authorization Endpoint"
                  nohint
                  fullWidth
                />
                <Field name="state" label="State" nohint fullWidth />
                <Field name="nonce" label="Nonce" nohint fullWidth />
                <FieldSelect
                  name="challengemethod"
                  label="Code Challenge Method"
                  options={challengeMethodOpts}
                  nohint
                  fullWidth
                />
                <Field
                  name="challenge"
                  label="Code Challenge Secret"
                  nohint
                  fullWidth
                />
                <Field
                  noctx
                  value={codeChallengeValue}
                  label="Code Challenge"
                  readOnly
                  nohint
                  fullWidth
                />
              </Column>
            </Grid>
          </Form>
        </Column>
        <Column md={12}>
          <h4>Openid Configuration</h4>
          {oidConfig.success && (
            <Fragment>
              <Description label="Issuer" item={oidConfig.data.issuer} />
              <Description
                label="Authorization Endpoint"
                item={oidConfig.data.authorization_endpoint}
              />
              <Description
                label="Token Endpoint"
                item={oidConfig.data.token_endpoint}
              />
              <Description
                label="Userinfo Endpoint"
                item={oidConfig.data.userinfo_endpoint}
              />
              <Description label="JWKs URI" item={oidConfig.data.jwks_uri} />
              <Description
                label="Scopes Supported"
                item={<ChipList list={oidConfig.data.scopes_supported} />}
              />
              <Description
                label="Response Types Supported"
                item={
                  <ChipList list={oidConfig.data.response_types_supported} />
                }
              />
              <Description
                label="Response Modes Supported"
                item={
                  <ChipList list={oidConfig.data.response_modes_supported} />
                }
              />
              <Description
                label="Grant Types Supported"
                item={<ChipList list={oidConfig.data.grant_types_supported} />}
              />
              <Description
                label="Subject Types Supported"
                item={
                  <ChipList list={oidConfig.data.subject_types_supported} />
                }
              />
              <Description
                label="ID Token Signing Algorithms Supported"
                item={
                  <ChipList
                    list={oidConfig.data.id_token_signing_alg_values_supported}
                  />
                }
              />
              <Description
                label="Token Endpoint Auth Methods Supported"
                item={
                  <ChipList
                    list={oidConfig.data.token_endpoint_auth_methods_supported}
                  />
                }
              />
              <Description
                label="Code Challenge Methods Supported"
                item={
                  <ChipList
                    list={oidConfig.data.code_challenge_methods_supported}
                  />
                }
              />
              <Description
                label="Claims Supported"
                item={<ChipList list={oidConfig.data.claims_supported} />}
              />
            </Fragment>
          )}
          {oidConfig.err && <p>{oidConfig.err.message}</p>}
        </Column>
      </Grid>
      <h4>OAuth Link</h4>
      <AnchorText href={linkDest}>
        <code>{linkDest}</code>
      </AnchorText>
      <ButtonGroup>
        <ButtonPrimary onClick={makeOAuthReq}>Send OAuth Request</ButtonPrimary>
      </ButtonGroup>
    </div>
  );
};

const OAuthCB = () => {
  const {search} = useLocation();
  const params = useMemo(() => {
    const query = getSearchParams(search);
    return {
      state: query.get('state') || '',
      error: query.get('error') || '',
      errorDesc: query.get('error_description') || '',
      code: query.get('code') || '',
    };
  }, [search]);
  const req = useMemo(() => {
    return retrieveOAuthReq(storageOAuthReqKey());
  }, []);

  const [timeValid, setTimeValid] = useState(true);
  useEffect(() => {
    if (!timeValid) {
      return;
    }
    const handler = () => {
      const k = req && unixTime() < req.time + secondsMinute;
      if (k !== timeValid) {
        setTimeValid(k);
      }
    };
    const interval = window.setInterval(handler, 1000);
    handler();
    return () => {
      window.clearInterval(interval);
    };
  }, [req, timeValid, setTimeValid]);

  return (
    <div>
      <h3>OAuth Callback Tool</h3>
      <Grid>
        <Column md={12}>
          <h4>OAuth Response</h4>
          {params.error ? (
            <Fragment>
              <Description label="State" item={params.state} />
              <Description label="Error Code" item={params.error} />
              <Description label="Error Message" item={params.errorDesc} />
            </Fragment>
          ) : (
            <Fragment>
              <Description label="State" item={params.state} />
              <Description label="Code" item={params.code} />
            </Fragment>
          )}
        </Column>
        <Column md={12}>
          <h4>Stored request</h4>
          {!req && <strong>None</strong>}
          {req && (
            <Fragment>
              <Description
                label="Time"
                item={`${req.time}${timeValid ? '' : ' (Expired)'}`}
              />
              <Description label="Client ID" item={req.clientid} />
              <Description label="State" item={req.state} />
              <Description label="Nonce" item={req.nonce} />
              <Description
                label="Challenge Method"
                item={req.challengemethod}
              />
              <Description label="Challenge Secret" item={req.challenge} />
            </Fragment>
          )}
        </Column>
      </Grid>
    </div>
  );
};

const OAuth = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <OAuthTool pathCallback={`${match.url}/cb`} />
      </Route>
      <Route path={`${match.path}/cb`}>
        <OAuthCB />
      </Route>
      <Redirect to={`${match.url}`} />
    </Switch>
  );
};

export default OAuth;
