import {Fragment, useCallback, useMemo, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
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
  Chip,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';
import {randomID} from '../../utility';

const selectAPIOidConfig = (api) => api.wellknown.openidconfig;
const selectAPIApps = (api) => api.oauth.app.get;

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

  const randomState = useMemo(() => randomID(24), []);
  const randomNonce = useMemo(() => randomID(24), []);
  const randomChallenge = useMemo(() => randomID(24), []);
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

  const onSubmit = useCallback(() => {
    console.log('sent auth request');
  }, []);

  return (
    <div>
      <h3>OAuth Tester</h3>
      <Grid>
        <Column md={12}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={onSubmit}
          >
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
                  label="Code Challenge"
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
    </div>
  );
};

const OAuthCB = () => {
  return (
    <div>
      <h3>OAuth Callback Tester</h3>
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
