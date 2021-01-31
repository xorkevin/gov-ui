import {Fragment, useCallback, useMemo, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {useResource} from '@xorkevin/substation';
import {
  Grid,
  Column,
  Field,
  FieldSelect,
  FieldMultiSelect,
  Form,
  useForm,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';
import {randomID} from '../../utility';

const selectAPIOidConfig = (api) => api.wellknown.openidconfig;

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

  const onSubmit = useCallback(() => {
    console.log('sent auth request');
  }, []);

  return (
    <div>
      <h3>OAuth Tester</h3>
      <Grid>
        <Column md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={onSubmit}
          >
            <Grid>
              <Column md={12}>
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
        <Column md={8}>
          {oidConfig.success && (
            <Fragment>{JSON.stringify(oidConfig.data, null, 2)}</Fragment>
          )}
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
