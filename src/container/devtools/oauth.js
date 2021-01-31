import {useCallback, useMemo, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {
  Field,
  FieldSelect,
  FieldMultiSelect,
  Form,
  useForm,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';
import {randomID} from '../../utility';

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

  const onSubmit = useCallback(() => {
    console.log('sent auth request');
  }, []);

  return (
    <div>
      <h3>OAuth Tester</h3>
      <Form formState={form.state} onChange={form.update} onSubmit={onSubmit}>
        <Field name="clientid" label="Client ID" nohint />
        <Field name="redirecturi" label="Redirect URI" nohint />
        <FieldSelect
          name="responsetype"
          label="Response Type"
          options={responseTypeOpts}
          nohint
        />
        <FieldSelect
          name="responsemode"
          label="Response Mode"
          options={responseModeOpts}
          nohint
        />
        <FieldMultiSelect
          name="scope"
          label="Scope"
          options={scopeOpts}
          nohint
        />
        <FieldSelect name="prompt" label="Prompt" options={promptOpts} nohint />
        <Field name="maxage" label="Max Age" nohint />
        <Field name="loginhint" label="Login Hint" nohint />
        <Field name="state" label="State" nohint />
        <Field name="nonce" label="Nonce" nohint />
        <FieldSelect
          name="challengemethod"
          label="Code Challenge Method"
          options={challengeMethodOpts}
          nohint
        />
        <Field name="challenge" label="Code Challenge" nohint />
      </Form>
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
