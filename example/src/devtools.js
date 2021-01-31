import {useCallback, useMemo, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  Field,
  FieldSelect,
  FieldMultiSelect,
  Form,
  useForm,
} from '@xorkevin/nuke';
import {GovUICtx} from '@xorkevin/gov-ui';
import {randomID} from '@xorkevin/gov-ui/src/utility';

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

const OAuthCBTool = () => {
  return (
    <div>
      <h3>OAuth Callback Tester</h3>
    </div>
  );
};

const DevToolsContainer = () => {
  const match = useRouteMatch();
  return (
    <MainContent>
      <Section>
        <Container padded>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Devtools</SidebarHeader>
                <SidebarItem local link={`${match.url}/oauth`}>
                  OAuth
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Switch>
                <Route exact path={`${match.path}/oauth`}>
                  <OAuthTool pathCallback={`${match.url}/oauth/cb`} />
                </Route>
                <Route exact path={`${match.path}/oauth/cb`}>
                  <OAuthCBTool />
                </Route>
                <Redirect to={`${match.url}/oauth`} />
              </Switch>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default DevToolsContainer;
